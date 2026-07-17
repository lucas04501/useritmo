import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PDFDocument from 'pdfkit';
import { authOptions } from '@/lib/auth';
import { obterDadosRelatorio, resolverPeriodo, formatarMinutosRelatorio } from '@/lib/relatorios/dadosRelatorio';

function formatarData(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatarHora(d: Date | null) {
  if (!d) return '—';
  return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));
  const { periodo, inicio: inicioCustom, fim: fimCustom } = body as {
    periodo?: 'semanal' | 'mensal' | 'anual' | 'personalizado';
    inicio?: string;
    fim?: string;
  };

  const { inicio, fim } =
    periodo === 'personalizado' && inicioCustom && fimCustom
      ? { inicio: new Date(inicioCustom), fim: new Date(fimCustom) }
      : resolverPeriodo(periodo ?? 'mensal');

  const dados = await obterDadosRelatorio(usuarioId, inicio, fim);

  const chunks: Buffer[] = [];
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.on('data', (chunk) => chunks.push(chunk));

  const pdfPronto = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  // Cabeçalho
  doc.fontSize(18).fillColor('#111114').text('Ritmo', { continued: true }).fontSize(10).fillColor('#6e6e76').text('  relatório de jornada', { align: 'left' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#6e6e76').text(`${dados.usuario.nome} — ${dados.usuario.email}`);
  doc.text(`Período: ${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`);
  doc.moveDown(1);

  // Resumo
  doc.fontSize(12).fillColor('#111114').text('Resumo do período', { underline: false });
  doc.moveDown(0.4);
  doc.fontSize(10).fillColor('#111114');
  doc.text(`Total trabalhado: ${formatarMinutosRelatorio(dados.resumo.totalMinutosTrabalhados)}`);
  doc.text(`Total de horas extras: ${formatarMinutosRelatorio(dados.resumo.totalMinutosExtras)}`);
  doc.text(`Dias trabalhados: ${dados.resumo.diasTrabalhados}`);
  doc.text(`Saldo atual do banco de horas: ${formatarMinutosRelatorio(dados.resumo.saldoBancoHoras)}`);
  doc.moveDown(1);

  // Tabela
  doc.fontSize(12).fillColor('#111114').text('Detalhamento diário');
  doc.moveDown(0.5);

  const colX = { data: 40, entrada: 130, saida: 190, trabalhado: 250, pausado: 330, extra: 400, obs: 460 };
  const linhaY = () => doc.y;

  doc.fontSize(9).fillColor('#6e6e76');
  doc.text('Data', colX.data, linhaY(), { continued: false });
  doc.text('Entrada', colX.entrada, doc.y - doc.currentLineHeight());
  doc.text('Saída', colX.saida, doc.y - doc.currentLineHeight());
  doc.text('Trabalhado', colX.trabalhado, doc.y - doc.currentLineHeight());
  doc.text('Pausado', colX.pausado, doc.y - doc.currentLineHeight());
  doc.text('Extra', colX.extra, doc.y - doc.currentLineHeight());
  doc.text('Observação', colX.obs, doc.y - doc.currentLineHeight());
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#e7e7ea').stroke();
  doc.moveDown(0.3);

  doc.fontSize(9).fillColor('#111114');
  if (dados.linhas.length === 0) {
    doc.text('Nenhum registro neste período.', 40);
  }

  for (const linha of dados.linhas) {
    if (doc.y > 760) doc.addPage();
    const y = doc.y;
    doc.text(formatarData(linha.data), colX.data, y);
    doc.text(formatarHora(linha.entrada), colX.entrada, y);
    doc.text(formatarHora(linha.saida), colX.saida, y);
    doc.text(formatarMinutosRelatorio(linha.minutosTrabalhados), colX.trabalhado, y);
    doc.text(formatarMinutosRelatorio(linha.minutosPausados), colX.pausado, y);
    doc.text(linha.minutosExtras > 0 ? `+${formatarMinutosRelatorio(linha.minutosExtras)}` : '—', colX.extra, y);
    doc.text(linha.observacao ?? '—', colX.obs, y, { width: 100 });
    doc.moveDown(0.6);
  }

  doc.end();
  const buffer = await pdfPronto;

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ritmo-relatorio-${formatarData(inicio).replace(/\//g, '-')}_a_${formatarData(fim).replace(/\//g, '-')}.pdf"`,
    },
  });
}
