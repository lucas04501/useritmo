'use client';

import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';

interface RecordesCardsProps {
  recordes: {
    maiorJornada: number;
    menorJornada: number;
    diasTrabalhados: number;
    diasAusentes: number;
    mediaDiaria: number;
  };
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs text-secondary">{titulo}</p>
      <p className="mt-1.5 font-mono text-lg font-medium text-primary">{valor}</p>
    </div>
  );
}

export function RecordesCards({ recordes }: RecordesCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <Card titulo="Maior jornada" valor={formatarMinutos(recordes.maiorJornada)} />
      <Card titulo="Menor jornada" valor={formatarMinutos(recordes.menorJornada)} />
      <Card titulo="Média diária" valor={formatarMinutos(recordes.mediaDiaria)} />
      <Card titulo="Dias trabalhados" valor={String(recordes.diasTrabalhados)} />
      <Card titulo="Dias ausentes" valor={String(recordes.diasAusentes)} />
    </div>
  );
}

export function ComparacaoSemanas({ atual, anterior }: { atual: number; anterior: number }) {
  const diferenca = anterior > 0 ? Math.round(((atual - anterior) / anterior) * 100) : atual > 0 ? 100 : 0;
  const positivo = diferenca >= 0;

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-3 text-sm font-medium text-primary">Comparação entre semanas</p>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-secondary">Semana anterior</p>
          <p className="font-mono text-lg text-primary">{formatarMinutos(anterior)}</p>
        </div>
        <div>
          <p className="text-xs text-secondary">Semana atual</p>
          <p className="font-mono text-lg text-primary">{formatarMinutos(atual)}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            positivo ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}
        >
          {positivo ? '+' : ''}
          {diferenca}% vs semana passada
        </span>
      </div>
    </div>
  );
}
