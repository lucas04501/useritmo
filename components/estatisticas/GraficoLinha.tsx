'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';

interface GraficoLinhaProps {
  dados: { label: string; minutosTrabalhados: number }[];
}

export function GraficoLinha({ dados }: GraficoLinhaProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="mb-4 text-sm font-medium text-primary">Horas trabalhadas — últimas 12 semanas</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={dados} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
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
          <Line
            type="monotone"
            dataKey="minutosTrabalhados"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent)' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
