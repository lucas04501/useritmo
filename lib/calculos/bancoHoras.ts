import { prisma } from '@/lib/prisma';
import { calcularVariacaoBancoHoras } from './tempoTrabalhado';

/**
 * Aplica a variação do dia (positiva ou negativa) ao saldo acumulado do usuário.
 * Chamado sempre que um expediente é finalizado.
 */
export async function atualizarBancoHoras(
  usuarioId: string,
  minutosTrabalhados: number,
  metaDiariaMin: number
) {
  const variacao = calcularVariacaoBancoHoras(minutosTrabalhados, metaDiariaMin);

  return prisma.bancoHoras.upsert({
    where: { usuarioId },
    update: { saldoMinutos: { increment: variacao } },
    create: { usuarioId, saldoMinutos: variacao },
  });
}
