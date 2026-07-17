import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { trocarSenhaSchema } from '@/lib/validations/usuario';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));
  const parsed = trocarSenhaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    return NextResponse.json({ erro: 'Usuário não encontrado.' }, { status: 404 });
  }

  const senhaAtualValida = await bcrypt.compare(parsed.data.senhaAtual, usuario.senhaHash);
  if (!senhaAtualValida) {
    return NextResponse.json({ erro: 'Senha atual incorreta.' }, { status: 401 });
  }

  const novoHash = await bcrypt.hash(parsed.data.novaSenha, 10);
  await prisma.usuario.update({ where: { id: usuarioId }, data: { senhaHash: novoHash } });

  return NextResponse.json({ ok: true });
}
