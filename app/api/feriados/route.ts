import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { feriadoSchema } from '@/lib/validations/configuracoes';
import { dataSemHora } from '@/lib/data';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const organizacaoId = (session.user as any).organizacaoId as string;
  const feriados = await prisma.feriado.findMany({
    where: { organizacaoId },
    orderBy: { data: 'asc' },
  });

  return NextResponse.json(feriados);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const organizacaoId = (session.user as any).organizacaoId as string;
  const body = await req.json().catch(() => ({}));
  const parsed = feriadoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400 });
  }

  const feriado = await prisma.feriado.create({
    data: {
      organizacaoId,
      data: dataSemHora(new Date(parsed.data.data)),
      nome: parsed.data.nome,
    },
  });

  return NextResponse.json(feriado);
}
