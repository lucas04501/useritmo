import type { StatusDia } from '@prisma/client';

export interface PausaCalculo {
  inicio: Date;
  fim: Date | null;
}

/**
 * Soma o total de minutos pausados. Uma pausa em aberto (sem `fim`)
 * conta até o momento atual — importante para o dashboard em tempo real.
 */
export function calcularMinutosPausados(pausas: PausaCalculo[], agora: Date = new Date()): number {
  return pausas.reduce((total, pausa) => {
    const fim = pausa.fim ?? agora;
    const minutos = Math.max(0, (fim.getTime() - pausa.inicio.getTime()) / 60000);
    return total + minutos;
  }, 0);
}

/**
 * Calcula o tempo efetivamente trabalhado em minutos:
 * (saída - entrada) - soma das pausas.
 * Se ainda não houver saída, usa `agora` — para o cronômetro ao vivo.
 */
export function calcularMinutosTrabalhados(
  entrada: Date | null,
  saida: Date | null,
  pausas: PausaCalculo[],
  agora: Date = new Date()
): number {
  if (!entrada) return 0;
  const fimReferencia = saida ?? agora;
  const brutoMin = (fimReferencia.getTime() - entrada.getTime()) / 60000;
  const pausadoMin = calcularMinutosPausados(pausas, agora);
  return Math.max(0, Math.round(brutoMin - pausadoMin));
}

/**
 * Horas extras do dia: excedente sobre a meta diária (nunca negativo aqui —
 * o déficit é tratado separadamente no banco de horas).
 */
export function calcularMinutosExtras(minutosTrabalhados: number, metaDiariaMin: number): number {
  return Math.max(0, minutosTrabalhados - metaDiariaMin);
}

/**
 * Variação no banco de horas do dia: positiva se trabalhou acima da meta,
 * negativa se ficou abaixo. É esse valor que deve ser somado ao saldo acumulado.
 */
export function calcularVariacaoBancoHoras(minutosTrabalhados: number, metaDiariaMin: number): number {
  return minutosTrabalhados - metaDiariaMin;
}

/**
 * Deriva o status do dia a partir dos dados do registro.
 */
export function calcularStatusDia(params: {
  temRegistro: boolean;
  saidaPreenchida: boolean;
  minutosTrabalhados: number;
  metaDiariaMin: number;
  ehFeriado: boolean;
}): StatusDia {
  const { temRegistro, saidaPreenchida, minutosTrabalhados, metaDiariaMin, ehFeriado } = params;

  if (ehFeriado) return 'FERIADO';
  if (!temRegistro) return 'AUSENTE';
  if (!saidaPreenchida) return 'EM_ANDAMENTO';
  return minutosTrabalhados >= metaDiariaMin ? 'COMPLETO' : 'INCOMPLETO';
}

/** Formata minutos totais em "HHhMMm", ex: 258 -> "4h18m". Aceita negativos. */
export function formatarMinutos(minutosTotais: number): string {
  const sinal = minutosTotais < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutosTotais));
  const horas = Math.floor(abs / 60);
  const minutos = abs % 60;
  return `${sinal}${horas}h${minutos.toString().padStart(2, '0')}m`;
}

/** Formata segundos em "HH:MM:SS" para o cronômetro ao vivo. */
export function formatarCronometro(segundosTotais: number): string {
  const abs = Math.max(0, Math.floor(segundosTotais));
  const horas = Math.floor(abs / 3600);
  const minutos = Math.floor((abs % 3600) / 60);
  const segundos = abs % 60;
  return [horas, minutos, segundos].map((v) => v.toString().padStart(2, '0')).join(':');
}
