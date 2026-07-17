import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const organizacaoId = (session.user as any).organizacaoId as string;
  const feriado = await prisma.feriado.findUnique({ where: { id: params.id } });

  if (!feriado || feriado.organizacaoId !== organizacaoId) {
    return NextResponse.json({ erro: 'Feriado não encontrado.' }, { status: 404 });
  }

  await prisma.feriado.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
