'use client';

import { useMemo, useState } from 'react';

interface HeatmapProps {
  dados: { data: string; minutos: number }[];
}

const NOMES_MES_CURTO = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function corIntensidade(minutos: number, maximo: number): string {
  if (minutos <= 0) return 'var(--border)';
  const proporcao = Math.min(1, minutos / (maximo || 1));
  if (proporcao < 0.25) return 'color-mix(in srgb, var(--success) 30%, var(--bg-surface))';
  if (proporcao < 0.5) return 'color-mix(in srgb, var(--success) 55%, var(--bg-surface))';
  if (proporcao < 0.75) return 'color-mix(in srgb, var(--success) 80%, var(--bg-surface))';
  return 'var(--success)';
}

export function Heatmap({ dados }: HeatmapProps) {
  const [diaHover, setDiaHover] = useState<{ data: string; minutos: number } | null>(null);

  const { semanas, maximo, mesesLabel } = useMemo(() => {
    const mapa = new Map(dados.map((d) => [new Date(d.data).toDateString(), d.minutos]));
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setDate(inicio.getDate() - 363);
    // recuar até o domingo anterior para alinhar as colunas por semana
    inicio.setDate(inicio.getDate() - inicio.getDay());

    const dias: { data: Date; minutos: number }[] = [];
    const cursor = new Date(inicio);
    while (cursor <= hoje) {
      dias.push({ data: new Date(cursor), minutos: mapa.get(cursor.toDateString()) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const semanasArr: { data: Date; minutos: number }[][] = [];
    for (let i = 0; i < dias.length; i += 7) {
      semanasArr.push(dias.slice(i, i + 7));
    }

    const max = Math.max(1, ...dias.map((d) => d.minutos));

    const labels: { semanaIndex: number; label: string }[] = [];
    let ultimoMes = -1;
    semanasArr.forEach((semana, i) => {
      const mesDaSemana = semana[0].data.getMonth();
      if (mesDaSemana !== ultimoMes) {
        labels.push({ semanaIndex: i, label: NOMES_MES_CURTO[mesDaSemana] });
        ultimoMes = mesDaSemana;
      }
    });

    return { semanas: semanasArr, maximo: max, mesesLabel: labels };
  }, [dados]);

  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-4 text-sm font-medium text-primary">Heatmap de produtividade — últimos 12 meses</p>
      <div className="overflow-x-auto">
        <div className="relative mb-1 h-4" style={{ width: semanas.length * 13 }}>
          {mesesLabel.map(({ semanaIndex, label }) => (
            <span
              key={semanaIndex}
              className="absolute text-[10px] text-secondary"
              style={{ left: semanaIndex * 13 }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-[3px]" style={{ width: semanas.length * 13 }}>
          {semanas.map((semana, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {semana.map((dia, j) => (
                <div
                  key={j}
                  onMouseEnter={() => setDiaHover({ data: dia.data.toISOString(), minutos: dia.minutos })}
                  onMouseLeave={() => setDiaHover(null)}
                  className="h-[10px] w-[10px] rounded-[2px] transition"
                  style={{ backgroundColor: corIntensidade(dia.minutos, maximo) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 h-4 text-xs text-secondary">
        {diaHover &&
          `${new Date(diaHover.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}: ${
            diaHover.minutos > 0 ? `${Math.floor(diaHover.minutos / 60)}h${(diaHover.minutos % 60).toString().padStart(2, '0')}m` : 'sem registro'
          }`}
      </div>
    </div>
  );
}
