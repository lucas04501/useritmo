import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hojeSemHora } from '@/lib/data';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const data = hojeSemHora();

  const existente = await prisma.registroPonto.findUnique({
    where: { usuarioId_data: { usuarioId, data } },
    include: { pausas: true },
  });

  if (existente?.entrada) {
    return NextResponse.json(existente);
  }

  const registro = existente
    ? await prisma.registroPonto.update({
        where: { id: existente.id },
        data: { entrada: new Date(), status: 'EM_ANDAMENTO' },
        include: { pausas: true },
      })
    : await prisma.registroPonto.create({
        data: {
          usuarioId,
          data,
          entrada: new Date(),
          status: 'EM_ANDAMENTO',
        },
        include: { pausas: true },
      });

  return NextResponse.json(registro);
}
