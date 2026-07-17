'use client';

import { useState } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import clsx from 'clsx';

type Periodo = 'semanal' | 'mensal' | 'anual' | 'personalizado';

const OPCOES: { valor: Periodo; label: string }[] = [
  { valor: 'semanal', label: 'Semanal' },
  { valor: 'mensal', label: 'Mensal' },
  { valor: 'anual', label: 'Anual' },
  { valor: 'personalizado', label: 'Personalizado' },
];

export function RelatoriosForm() {
  const [periodo, setPeriodo] = useState<Periodo>('mensal');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [gerando, setGerando] = useState<'pdf' | 'excel' | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function baixar(formato: 'pdf' | 'excel') {
    setErro(null);
    if (periodo === 'personalizado' && (!inicio || !fim)) {
      setErro('Selecione as datas de início e fim.');
      return;
    }

    setGerando(formato);
    try {
      const res = await fetch(`/api/relatorios/${formato}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo,
          ...(periodo === 'personalizado'
            ? { inicio: new Date(inicio).toISOString(), fim: new Date(fim).toISOString() }
            : {}),
        }),
      });

      if (!res.ok) {
        setErro('Não foi possível gerar o relatório.');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ritmo-relatorio.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setGerando(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-primary">Relatórios</h1>

      <div className="rounded-card border border-border bg-surface p-6">
        <p className="mb-3 text-xs text-secondary">Período</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {OPCOES.map((o) => (
            <button
              key={o.valor}
              onClick={() => setPeriodo(o.valor)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm transition',
                periodo === o.valor
                  ? 'bg-accent-soft text-accent'
                  : 'border border-border text-secondary hover:bg-surface-hover hover:text-primary'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {periodo === 'personalizado' && (
          <div className="mb-4 flex gap-2">
            <input
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
            />
            <input
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-base px-3 py-2 text-sm text-primary outline-none focus:border-accent"
            />
          </div>
        )}

        {erro && <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{erro}</p>}

        <div className="flex gap-2">
          <button
            onClick={() => baixar('pdf')}
            disabled={gerando !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <FileText size={15} />
            {gerando === 'pdf' ? 'Gerando...' : 'Baixar PDF'}
          </button>
          <button
            onClick={() => baixar('excel')}
            disabled={gerando !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-surface-hover disabled:opacity-50"
          >
            <FileSpreadsheet size={15} />
            {gerando === 'excel' ? 'Gerando...' : 'Baixar Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}
