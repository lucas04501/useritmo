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

  const registro = await prisma.registroPonto.findUnique({
    where: { usuarioId_data: { usuarioId, data } },
    include: { pausas: true },
  });

  if (!registro) {
    return NextResponse.json({ erro: 'Nenhum expediente em andamento.' }, { status: 409 });
  }

  const pausaAberta = registro.pausas.find((p: { fim: Date | null }) => !p.fim);
  if (pausaAberta) {
    await prisma.pausa.update({
      where: { id: pausaAberta.id },
      data: { fim: new Date() },
    });
  }

  const registroAtualizado = await prisma.registroPonto.findUnique({
    where: { id: registro.id },
    include: { pausas: true },
  });

  return NextResponse.json(registroAtualizado);
}
