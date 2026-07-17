import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const { searchParams } = new URL(req.url);

  const inicio = searchParams.get('inicio');
  const fim = searchParams.get('fim');
  const busca = searchParams.get('busca');

  const registros = await prisma.registroPonto.findMany({
    where: {
      usuarioId,
      ...(inicio && fim ? { data: { gte: new Date(inicio), lte: new Date(fim) } } : {}),
      ...(busca ? { observacao: { contains: busca, mode: 'insensitive' } } : {}),
    },
    include: { pausas: true },
    orderBy: { data: 'desc' },
    take: 200,
  });

  return NextResponse.json(registros);
}
