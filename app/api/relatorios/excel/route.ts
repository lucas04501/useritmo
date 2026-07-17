import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import ExcelJS from 'exceljs';
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

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Ritmo';
  workbook.created = new Date();

  // --- Aba de resumo ---
  const resumoSheet = workbook.addWorksheet('Resumo');
  resumoSheet.columns = [{ width: 28 }, { width: 20 }];
  resumoSheet.addRow(['Ritmo — Relatório de Jornada']);
  resumoSheet.getRow(1).font = { bold: true, size: 14 };
  resumoSheet.addRow([`${dados.usuario.nome} — ${dados.usuario.email}`]);
  resumoSheet.addRow([`Período: ${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`]);
  resumoSheet.addRow([]);
  resumoSheet.addRow(['Total trabalhado', formatarMinutosRelatorio(dados.resumo.totalMinutosTrabalhados)]);
  resumoSheet.addRow(['Total de horas extras', formatarMinutosRelatorio(dados.resumo.totalMinutosExtras)]);
  resumoSheet.addRow(['Dias trabalhados', dados.resumo.diasTrabalhados]);
  resumoSheet.addRow(['Saldo do banco de horas', formatarMinutosRelatorio(dados.resumo.saldoBancoHoras)]);

  // --- Aba de detalhamento ---
  const detalheSheet = workbook.addWorksheet('Detalhamento');
  detalheSheet.columns = [
    { header: 'Data', key: 'data', width: 14 },
    { header: 'Entrada', key: 'entrada', width: 12 },
    { header: 'Saída', key: 'saida', width: 12 },
    { header: 'Trabalhado', key: 'trabalhado', width: 14 },
    { header: 'Pausado', key: 'pausado', width: 14 },
    { header: 'Extra', key: 'extra', width: 12 },
    { header: 'Observação', key: 'observacao', width: 40 },
  ];
  detalheSheet.getRow(1).font = { bold: true };
  detalheSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' },
  };

  for (const linha of dados.linhas) {
    detalheSheet.addRow({
      data: formatarData(linha.data),
      entrada: formatarHora(linha.entrada),
      saida: formatarHora(linha.saida),
      trabalhado: formatarMinutosRelatorio(linha.minutosTrabalhados),
      pausado: formatarMinutosRelatorio(linha.minutosPausados),
      extra: linha.minutosExtras > 0 ? `+${formatarMinutosRelatorio(linha.minutosExtras)}` : '—',
      observacao: linha.observacao ?? '',
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ritmo-relatorio-${formatarData(inicio).replace(/\//g, '-')}_a_${formatarData(fim).replace(/\//g, '-')}.xlsx"`,
    },
  });
}
