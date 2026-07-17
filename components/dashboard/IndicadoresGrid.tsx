'use client';

import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';
import clsx from 'clsx';

interface IndicadoresGridProps {
  metaDiariaMin: number;
  minutosTrabalhadosHoje: number;
  minutosExtrasHoje: number;
  saldoBancoHoras: number;
  minutosSemana: number;
  metaSemanalMin: number;
}

function CardIndicador({
  titulo,
  valor,
  variante = 'neutral',
}: {
  titulo: string;
  valor: string;
  variante?: 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const cor = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    neutral: 'text-primary',
  }[variante];

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <p className="text-xs text-secondary">{titulo}</p>
      <p className={clsx('mt-1.5 font-mono text-xl font-medium', cor)}>{valor}</p>
    </div>
  );
}

export function IndicadoresGrid({
  metaDiariaMin,
  minutosTrabalhadosHoje,
  minutosExtrasHoje,
  saldoBancoHoras,
  minutosSemana,
  metaSemanalMin,
}: IndicadoresGridProps) {
  const restanteHoje = Math.max(0, metaDiariaMin - minutosTrabalhadosHoje);
  const metaBatida = minutosTrabalhadosHoje >= metaDiariaMin;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <CardIndicador
        titulo={metaBatida ? 'Meta batida hoje' : 'Meta restante hoje'}
        valor={metaBatida ? formatarMinutos(minutosTrabalhadosHoje - metaDiariaMin) : formatarMinutos(restanteHoje)}
        variante={metaBatida ? 'success' : 'neutral'}
      />
      <CardIndicador
        titulo="Horas extras hoje"
        valor={minutosExtrasHoje > 0 ? `+${formatarMinutos(minutosExtrasHoje)}` : '0h00m'}
        variante={minutosExtrasHoje > 0 ? 'success' : 'neutral'}
      />
      <CardIndicador
        titulo="Banco de horas"
        valor={`${saldoBancoHoras >= 0 ? '+' : ''}${formatarMinutos(saldoBancoHoras)}`}
        variante={saldoBancoHoras >= 0 ? 'success' : 'danger'}
      />
      <CardIndicador
        titulo="Semana"
        valor={`${formatarMinutos(minutosSemana)} / ${formatarMinutos(metaSemanalMin)}`}
      />
    </div>
  );
}
