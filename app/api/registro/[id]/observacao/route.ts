import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { observacaoSchema } from '@/lib/validations/ponto';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));
  const parsed = observacaoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400 });
  }

  const registro = await prisma.registroPonto.findUnique({ where: { id: params.id } });
  if (!registro || registro.usuarioId !== usuarioId) {
    return NextResponse.json({ erro: 'Registro não encontrado.' }, { status: 404 });
  }

  const atualizado = await prisma.registroPonto.update({
    where: { id: params.id },
    data: { observacao: parsed.data.observacao },
  });

  return NextResponse.json(atualizado);
}
