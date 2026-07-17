import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organizacao.upsert({
    where: { id: 'org_escritorio' },
    update: {},
    create: {
      id: 'org_escritorio',
      nome: 'Escritório de Contabilidade',
    },
  });

  const senhaHashLucas = await bcrypt.hash('mude-esta-senha-1', 10);
  const senhaHashTia = await bcrypt.hash('mude-esta-senha-2', 10);

  const lucas = await prisma.usuario.upsert({
    where: { email: 'lucas@ritmo.app' },
    update: {},
    create: {
      organizacaoId: org.id,
      nome: 'Lucas',
      email: 'lucas@ritmo.app',
      senhaHash: senhaHashLucas,
      papel: 'ADMIN',
    },
  });

  const tia = await prisma.usuario.upsert({
    where: { email: 'tia@ritmo.app' },
    update: {},
    create: {
      organizacaoId: org.id,
      nome: 'Tia',
      email: 'tia@ritmo.app',
      senhaHash: senhaHashTia,
      papel: 'MEMBRO',
    },
  });

  await prisma.bancoHoras.upsert({
    where: { usuarioId: lucas.id },
    update: {},
    create: { usuarioId: lucas.id, saldoMinutos: 0 },
  });

  await prisma.bancoHoras.upsert({
    where: { usuarioId: tia.id },
    update: {},
    create: { usuarioId: tia.id, saldoMinutos: 0 },
  });

  console.log('Seed concluído. Troque as senhas padrão em produção.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
