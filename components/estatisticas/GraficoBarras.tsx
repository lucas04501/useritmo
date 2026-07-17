'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';

interface GraficoBarrasProps {
  dados: { dia: string; minutos: number }[];
}

export function GraficoBarras({ dados }: GraficoBarrasProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-4 text-sm font-medium text-primary">Média por dia da semana</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dados} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="dia" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(v / 60)}h`}
          />
          <Tooltip
            formatter={(value: number) => formatarMinutos(value)}
            contentStyle={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
          />
          <Bar dataKey="minutos" fill="var(--accent)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
