import { prisma } from '@/lib/prisma';

export interface LinhaRelatorio {
  data: Date;
  entrada: Date | null;
  saida: Date | null;
  minutosTrabalhados: number;
  minutosPausados: number;
  minutosExtras: number;
  observacao: string | null;
}

export interface DadosRelatorio {
  usuario: { nome: string; email: string };
  periodo: { inicio: Date; fim: Date };
  linhas: LinhaRelatorio[];
  resumo: {
    totalMinutosTrabalhados: number;
    totalMinutosExtras: number;
    diasTrabalhados: number;
    saldoBancoHoras: number;
  };
}

export async function obterDadosRelatorio(
  usuarioId: string,
  inicio: Date,
  fim: Date
): Promise<DadosRelatorio> {
  const [usuario, registros, bancoHoras] = await Promise.all([
    prisma.usuario.findUniqueOrThrow({ where: { id: usuarioId }, select: { nome: true, email: true } }),
    prisma.registroPonto.findMany({
      where: { usuarioId, data: { gte: inicio, lte: fim } },
      orderBy: { data: 'asc' },
    }),
    prisma.bancoHoras.findUnique({ where: { usuarioId } }),
  ]);

  const linhas: LinhaRelatorio[] = registros.map((r: any) => ({
    data: r.data,
    entrada: r.entrada,
    saida: r.saida,
    minutosTrabalhados: r.minutosTrabalhados,
    minutosPausados: r.minutosPausados,
    minutosExtras: r.minutosExtras,
    observacao: r.observacao,
  }));

  const totalMinutosTrabalhados = linhas.reduce((acc, l) => acc + l.minutosTrabalhados, 0);
  const totalMinutosExtras = linhas.reduce((acc, l) => acc + l.minutosExtras, 0);
  const diasTrabalhados = linhas.filter((l) => l.minutosTrabalhados > 0).length;

  return {
    usuario,
    periodo: { inicio, fim },
    linhas,
    resumo: {
      totalMinutosTrabalhados,
      totalMinutosExtras,
      diasTrabalhados,
      saldoBancoHoras: bancoHoras?.saldoMinutos ?? 0,
    },
  };
}

/** Resolve um período nomeado ("semanal" | "mensal" | "anual") em datas de início/fim. */
export function resolverPeriodo(tipo: string, hoje: Date = new Date()): { inicio: Date; fim: Date } {
  const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  if (tipo === 'semanal') {
    const inicio = new Date(fim);
    inicio.setDate(fim.getDate() - fim.getDay());
    return { inicio, fim };
  }

  if (tipo === 'anual') {
    return { inicio: new Date(fim.getFullYear(), 0, 1), fim };
  }

  // mensal (padrão)
  return { inicio: new Date(fim.getFullYear(), fim.getMonth(), 1), fim };
}

export function formatarMinutosRelatorio(minutos: number): string {
  const sinal = minutos < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutos));
  const horas = Math.floor(abs / 60);
  const mins = abs % 60;
  return `${sinal}${horas}h${mins.toString().padStart(2, '0')}m`;
}
