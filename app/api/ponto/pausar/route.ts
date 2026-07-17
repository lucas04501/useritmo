import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hojeSemHora } from '@/lib/data';
import { pausaSchema } from '@/lib/validations/ponto';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const data = hojeSemHora();

  const body = await req.json().catch(() => ({}));
  const parsed = pausaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400 });
  }

  const registro = await prisma.registroPonto.findUnique({
    where: { usuarioId_data: { usuarioId, data } },
    include: { pausas: true },
  });

  if (!registro || !registro.entrada || registro.saida) {
    return NextResponse.json({ erro: 'Nenhum expediente em andamento.' }, { status: 409 });
  }

  const pausaAberta = registro.pausas.find((p: { fim: Date | null }) => !p.fim);
  if (pausaAberta) {
    return NextResponse.json(registro);
  }

  await prisma.pausa.create({
    data: {
      registroId: registro.id,
      inicio: new Date(),
      motivo: parsed.data.motivo,
    },
  });

  const registroAtualizado = await prisma.registroPonto.findUnique({
    where: { id: registro.id },
    include: { pausas: true },
  });

  return NextResponse.json(registroAtualizado);
}
