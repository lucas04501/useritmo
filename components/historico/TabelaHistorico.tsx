'use client';

import { useEffect, useState } from 'react';
import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';

interface Registro {
  id: string;
  data: string;
  entrada: string | null;
  saida: string | null;
  minutosTrabalhados: number;
  minutosPausados: number;
  minutosExtras: number;
  observacao: string | null;
}

function formatarHora(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function TabelaHistorico() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setCarregando(true);
      const params = new URLSearchParams();
      if (busca) params.set('busca', busca);
      const res = await fetch(`/api/historico?${params.toString()}`);
      if (res.ok) setRegistros(await res.json());
      setCarregando(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [busca]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-primary">Histórico</h1>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por observação..."
          className="w-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-primary outline-none focus:border-accent"
        />
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-secondary">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Entrada</th>
              <th className="px-4 py-3 font-medium">Saída</th>
              <th className="px-4 py-3 font-medium">Trabalhado</th>
              <th className="px-4 py-3 font-medium">Pausado</th>
              <th className="px-4 py-3 font-medium">Extra</th>
              <th className="px-4 py-3 font-medium">Observação</th>
            </tr>
          </thead>
          <tbody>
            {!carregando && registros.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {registros.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="px-4 py-3 text-primary">
                  {new Date(r.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' })}
                </td>
                <td className="px-4 py-3 font-mono-num text-primary">{formatarHora(r.entrada)}</td>
                <td className="px-4 py-3 font-mono-num text-primary">{formatarHora(r.saida)}</td>
                <td className="px-4 py-3 font-mono-num text-primary">{formatarMinutos(r.minutosTrabalhados)}</td>
                <td className="px-4 py-3 font-mono-num text-secondary">{formatarMinutos(r.minutosPausados)}</td>
                <td className="px-4 py-3 font-mono-num text-success">
                  {r.minutosExtras > 0 ? `+${formatarMinutos(r.minutosExtras)}` : '—'}
                </td>
                <td className="px-4 py-3 text-secondary">{r.observacao ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
