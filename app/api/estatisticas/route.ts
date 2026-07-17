import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hojeSemHora } from '@/lib/data';

const NOMES_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface RegistroResumo {
  data: Date;
  minutosTrabalhados: number;
  minutosExtras: number;
  status: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 });
  }

  const usuarioId = (session.user as any).id as string;
  const hoje = hojeSemHora();

  // Janela de 1 ano para o heatmap e demais agregações.
  const umAnoAtras = new Date(hoje);
  umAnoAtras.setDate(umAnoAtras.getDate() - 364);

  const registros = await prisma.registroPonto.findMany({
    where: { usuarioId, data: { gte: umAnoAtras, lte: hoje } },
    select: {
      data: true,
      minutosTrabalhados: true,
      minutosExtras: true,
      status: true,
    },
    orderBy: { data: 'asc' },
  });

  // --- Horas médias por dia da semana ---
  const somaPorDiaSemana = Array(7).fill(0);
  const contagemPorDiaSemana = Array(7).fill(0);
  for (const r of registros as RegistroResumo[]) {
    if (r.minutosTrabalhados <= 0) continue;
    const diaSemana = new Date(r.data).getDay();
    somaPorDiaSemana[diaSemana] += r.minutosTrabalhados;
    contagemPorDiaSemana[diaSemana]++;
  }
  const horasPorDiaSemana = NOMES_DIA.map((nome, i) => ({
    dia: nome,
    minutos: contagemPorDiaSemana[i] > 0 ? Math.round(somaPorDiaSemana[i] / contagemPorDiaSemana[i]) : 0,
  }));

  // --- Evolução de horas trabalhadas nas últimas 12 semanas ---
  const inicioJanela12Semanas = new Date(hoje);
  inicioJanela12Semanas.setDate(inicioJanela12Semanas.getDate() - 7 * 11);
  const semanas: { label: string; minutosTrabalhados: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const inicioSemana = new Date(inicioJanela12Semanas);
    inicioSemana.setDate(inicioSemana.getDate() + i * 7);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(fimSemana.getDate() + 6);

    const registrosSemana = (registros as RegistroResumo[]).filter(
      (r) => new Date(r.data) >= inicioSemana && new Date(r.data) <= fimSemana
    );
    const minutosTrabalhados = registrosSemana.reduce((acc: number, r: RegistroResumo) => acc + r.minutosTrabalhados, 0);
    semanas.push({
      label: `${inicioSemana.getDate()}/${inicioSemana.getMonth() + 1}`,
      minutosTrabalhados,
    });
  }

  // --- Heatmap: minutos trabalhados por dia no último ano ---
  const heatmap = (registros as RegistroResumo[])
    .filter((r) => r.minutosTrabalhados > 0)
    .map((r) => ({ data: r.data.toISOString(), minutos: r.minutosTrabalhados }));

  // --- Recordes ---
  const diasComTrabalho = (registros as RegistroResumo[]).filter((r) => r.minutosTrabalhados > 0);
  const maiorJornada = diasComTrabalho.reduce((max: number, r: RegistroResumo) => Math.max(max, r.minutosTrabalhados), 0);
  const menorJornada = diasComTrabalho.length
    ? diasComTrabalho.reduce((min: number, r: RegistroResumo) => Math.min(min, r.minutosTrabalhados), Infinity)
    : 0;
  const diasTrabalhados = diasComTrabalho.length;
  const diasAusentes = (registros as RegistroResumo[]).filter((r) => r.status === 'AUSENTE').length;
  const mediaDiaria = diasTrabalhados
    ? Math.round(diasComTrabalho.reduce((acc: number, r: RegistroResumo) => acc + r.minutosTrabalhados, 0) / diasTrabalhados)
    : 0;

  // --- Comparação: semana atual vs anterior ---
  const inicioSemanaAtual = new Date(hoje);
  inicioSemanaAtual.setDate(hoje.getDate() - hoje.getDay());
  const fimSemanaAtual = hoje;

  const inicioSemanaAnterior = new Date(inicioSemanaAtual);
  inicioSemanaAnterior.setDate(inicioSemanaAnterior.getDate() - 7);
  const fimSemanaAnterior = new Date(inicioSemanaAtual);
  fimSemanaAnterior.setDate(fimSemanaAnterior.getDate() - 1);

  const minutosSemanaAtual = (registros as RegistroResumo[])
    .filter((r) => new Date(r.data) >= inicioSemanaAtual && new Date(r.data) <= fimSemanaAtual)
    .reduce((acc: number, r: RegistroResumo) => acc + r.minutosTrabalhados, 0);
  const minutosSemanaAnterior = (registros as RegistroResumo[])
    .filter((r) => new Date(r.data) >= inicioSemanaAnterior && new Date(r.data) <= fimSemanaAnterior)
    .reduce((acc: number, r: RegistroResumo) => acc + r.minutosTrabalhados, 0);

  return NextResponse.json({
    horasPorDiaSemana,
    evolucaoSemanal: semanas,
    heatmap,
    recordes: {
      maiorJornada,
      menorJornada: menorJornada === Infinity ? 0 : menorJornada,
      diasTrabalhados,
      diasAusentes,
      mediaDiaria,
    },
    comparacaoSemanas: {
      atual: minutosSemanaAtual,
      anterior: minutosSemanaAnterior,
    },
  });
}
