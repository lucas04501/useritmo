import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dataSemHora, hojeSemHora } from '@/lib/data';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const organizacaoId = (session.user as any).organizacaoId as string;

  const { searchParams } = new URL(req.url);
  const mes = Number(searchParams.get('mes'));
  const ano = Number(searchParams.get('ano'));

  if (!mes || !ano || mes < 1 || mes > 12) {
    return NextResponse.json({ erro: 'Parâmetros mes/ano inválidos.' }, { status: 400 });
  }

  const inicioMes = new Date(ano, mes - 1, 1);
  const fimMes = new Date(ano, mes, 0);
  const hoje = hojeSemHora();

  const [registros, feriados] = await Promise.all([
    prisma.registroPonto.findMany({
      where: { usuarioId, data: { gte: inicioMes, lte: fimMes } },
      include: { pausas: true },
    }),
    prisma.feriado.findMany({
      where: { organizacaoId, data: { gte: inicioMes, lte: fimMes } },
    }),
  ]);

  const registrosPorDia = new Map(
    registros.map((r: { data: Date }) => [dataSemHora(r.data).getTime(), r])
  );
  const feriadosPorDia = new Map(
    feriados.map((f: { data: Date; nome: string }) => [dataSemHora(f.data).getTime(), f.nome])
  );

  const dias = [];
  for (let dia = 1; dia <= fimMes.getDate(); dia++) {
    const data = new Date(ano, mes - 1, dia);
    const chave = data.getTime();
    const registro: any = registrosPorDia.get(chave);
    const nomeFeriado = feriadosPorDia.get(chave);
    const ehFimDeSemana = data.getDay() === 0 || data.getDay() === 6;
    const ehFuturo = data.getTime() > hoje.getTime();

    let status: 'COMPLETO' | 'INCOMPLETO' | 'AUSENTE' | 'FERIADO' | 'EM_ANDAMENTO' | 'FUTURO' | 'FIM_DE_SEMANA';

    if (nomeFeriado) status = 'FERIADO';
    else if (ehFuturo) status = 'FUTURO';
    else if (registro) status = registro.status;
    else if (ehFimDeSemana) status = 'FIM_DE_SEMANA';
    else status = 'AUSENTE';

    dias.push({
      data: data.toISOString(),
      status,
      nomeFeriado: nomeFeriado ?? null,
      minutosTrabalhados: registro?.minutosTrabalhados ?? 0,
      minutosExtras: registro?.minutosExtras ?? 0,
      observacao: registro?.observacao ?? null,
      entrada: registro?.entrada ?? null,
      saida: registro?.saida ?? null,
    });
  }

  return NextResponse.json({ dias });
}
