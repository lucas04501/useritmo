import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const bancoHoras = await prisma.bancoHoras.findUnique({ where: { usuarioId } });

  return NextResponse.json({ saldoMinutos: bancoHoras?.saldoMinutos ?? 0 });
}
