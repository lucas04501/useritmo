'use client';

import { useEffect, useState, useCallback } from 'react';
import { RelogioCard } from '@/components/dashboard/RelogioCard';
import { IndicadoresGrid } from '@/components/dashboard/IndicadoresGrid';
import { useSyncOffline } from '@/hooks/useSyncOffline';
import { WifiOff, RefreshCw } from 'lucide-react';

interface DadosHoje {
  registro: {
    id: string;
    entrada: string | null;
    saida: string | null;
    minutosTrabalhados: number;
    minutosExtras: number;
    pausas: { id: string; inicio: string; fim: string | null }[];
  } | null;
  metaDiariaMin: number;
  metaSemanalMin: number;
  saldoBancoHoras: number;
  minutosSemana: number;
}

export function DashboardClient() {
  const [dados, setDados] = useState<DadosHoje | null>(null);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch('/api/ponto/hoje');
      if (res.ok) setDados(await res.json());
    } catch {
      // Offline: mantém os últimos dados carregados na tela.
    }
  }, []);

  useEffect(() => {
    carregar();
    const interval = setInterval(carregar, 30000);
    return () => clearInterval(interval);
  }, [carregar]);

  const { online, pendentes } = useSyncOffline(carregar);

  if (!dados) {
    return <div className="animate-pulse text-sm text-secondary">Carregando...</div>;
  }

  const minutosTrabalhadosHoje = dados.registro?.minutosTrabalhados ?? 0;
  const minutosExtrasHoje = dados.registro?.minutosExtras ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {(!online || pendentes > 0) && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-secondary">
          {!online ? (
            <>
              <WifiOff size={13} />
              Sem conexão — suas ações estão sendo salvas localmente.
            </>
          ) : (
            <>
              <RefreshCw size={13} className="animate-spin" />
              Sincronizando {pendentes} ação(ões) pendente(s)...
            </>
          )}
        </div>
      )}
      <RelogioCard registro={dados.registro} onAtualizar={carregar} />
      <IndicadoresGrid
        metaDiariaMin={dados.metaDiariaMin}
        minutosTrabalhadosHoje={minutosTrabalhadosHoje}
        minutosExtrasHoje={minutosExtrasHoje}
        saldoBancoHoras={dados.saldoBancoHoras}
        minutosSemana={dados.minutosSemana}
        metaSemanalMin={dados.metaSemanalMin}
      />
    </div>
  );
}
