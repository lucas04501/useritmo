import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hojeSemHora } from '@/lib/data';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const data = hojeSemHora();

  const [registro, usuario, bancoHoras] = await Promise.all([
    prisma.registroPonto.findUnique({
      where: { usuarioId_data: { usuarioId, data } },
      include: { pausas: true },
    }),
    prisma.usuario.findUnique({ where: { id: usuarioId } }),
    prisma.bancoHoras.findUnique({ where: { usuarioId } }),
  ]);

  const inicioSemana = new Date(data);
  inicioSemana.setDate(data.getDate() - data.getDay());

  const registrosSemana = await prisma.registroPonto.findMany({
    where: { usuarioId, data: { gte: inicioSemana, lte: data } },
  });
  const minutosSemana = registrosSemana.reduce(
    (acc: number, r: { minutosTrabalhados: number }) => acc + r.minutosTrabalhados,
    0
  );

  return NextResponse.json({
    registro,
    metaDiariaMin: usuario?.metaDiariaMin ?? 480,
    metaSemanalMin: usuario?.metaSemanalMin ?? 2400,
    saldoBancoHoras: bancoHoras?.saldoMinutos ?? 0,
    minutosSemana,
  });
}
