import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { configuracoesSchema } from '@/lib/validations/configuracoes';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      nome: true,
      email: true,
      metaDiariaMin: true,
      metaSemanalMin: true,
      metaMensalMin: true,
      tema: true,
      idioma: true,
      formatoHora: true,
    },
  });

  return NextResponse.json(usuario);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));
  const parsed = configuracoesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados inválidos.', detalhes: parsed.error.flatten() }, { status: 400 });
  }

  const usuario = await prisma.usuario.update({
    where: { id: usuarioId },
    data: parsed.data,
  });

  return NextResponse.json(usuario);
}
