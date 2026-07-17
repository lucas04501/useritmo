import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hojeSemHora } from '@/lib/data';
import {
  calcularMinutosPausados,
  calcularMinutosTrabalhados,
  calcularMinutosExtras,
  calcularStatusDia,
} from '@/lib/calculos/tempoTrabalhado';
import { atualizarBancoHoras } from '@/lib/calculos/bancoHoras';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const data = hojeSemHora();

  const [registro, usuario] = await Promise.all([
    prisma.registroPonto.findUnique({
      where: { usuarioId_data: { usuarioId, data } },
      include: { pausas: true },
    }),
    prisma.usuario.findUnique({ where: { id: usuarioId } }),
  ]);

  if (!registro || !registro.entrada) {
    return NextResponse.json({ erro: 'Nenhum expediente em andamento.' }, { status: 409 });
  }
  if (!usuario) {
    return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
  }

  if (registro.saida) {
    return NextResponse.json(registro);
  }

  const agora = new Date();

  const pausaAberta = registro.pausas.find((p: { fim: Date | null }) => !p.fim);
  if (pausaAberta) {
    await prisma.pausa.update({ where: { id: pausaAberta.id }, data: { fim: agora } });
  }

  const pausasFinal = await prisma.pausa.findMany({ where: { registroId: registro.id } });

  const minutosPausados = Math.round(calcularMinutosPausados(pausasFinal, agora));
  const minutosTrabalhados = calcularMinutosTrabalhados(registro.entrada, agora, pausasFinal, agora);
  const minutosExtras = calcularMinutosExtras(minutosTrabalhados, usuario.metaDiariaMin);
  const status = calcularStatusDia({
    temRegistro: true,
    saidaPreenchida: true,
    minutosTrabalhados,
    metaDiariaMin: usuario.metaDiariaMin,
    ehFeriado: false,
  });

  const registroAtualizado = await prisma.registroPonto.update({
    where: { id: registro.id },
    data: {
      saida: agora,
      minutosPausados,
      minutosTrabalhados,
      minutosExtras,
      status,
    },
    include: { pausas: true },
  });

  await atualizarBancoHoras(usuarioId, minutosTrabalhados, usuario.metaDiariaMin);

  return NextResponse.json(registroAtualizado);
}
