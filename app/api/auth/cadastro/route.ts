import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { cadastroSchema } from '@/lib/validations/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = cadastroSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { erro: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
      { status: 400 }
    );
  }

  const { nome, email, senha, nomeOrganizacao } = parsed.data;

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return NextResponse.json({ erro: 'Já existe uma conta com este e-mail.' }, { status: 409 });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  // Cada nova conta ganha sua própria organização — isolamento total de dados
  // entre usuários/escritórios diferentes, mesmo compartilhando o mesmo banco.
  const organizacao = await prisma.organizacao.create({
    data: { nome: nomeOrganizacao?.trim() || `Organização de ${nome}` },
  });

  const usuario = await prisma.usuario.create({
    data: {
      organizacaoId: organizacao.id,
      nome,
      email,
      senhaHash,
      papel: 'ADMIN',
    },
  });

  await prisma.bancoHoras.create({
    data: { usuarioId: usuario.id, saldoMinutos: 0 },
  });

  return NextResponse.json({ ok: true });
}
