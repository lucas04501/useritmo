'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatarCronometro } from '@/lib/calculos/tempoTrabalhado';
import { useCronometro } from '@/hooks/useCronometro';
import { adicionarAcaoPendente } from '@/lib/pwa/queue';

interface Pausa {
  id: string;
  inicio: string;
  fim: string | null;
}

interface RegistroHoje {
  id: string;
  entrada: string | null;
  saida: string | null;
  pausas: Pausa[];
}

interface RelogioCardProps {
  registro: RegistroHoje | null;
  onAtualizar: () => void;
}

type Acao = 'iniciar' | 'pausar' | 'retornar' | 'finalizar';

export function RelogioCard({ registro, onAtualizar }: RelogioCardProps) {
  const [carregando, setCarregando] = useState<Acao | null>(null);
  const [horaAtual, setHoraAtual] = useState(new Date());

  const pausas = registro?.pausas ?? [];
  const emPausa = pausas.some((p) => !p.fim);
  const emAndamento = !!registro?.entrada && !registro?.saida;
  const finalizado = !!registro?.saida;

  const segundosTrabalhados = useCronometro({
    entrada: registro?.entrada ?? null,
    saida: registro?.saida ?? null,
    pausas,
  });

  useEffect(() => {
    const interval = setInterval(() => setHoraAtual(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function executar(acao: Acao) {
    setCarregando(acao);
    try {
      await fetch(`/api/ponto/${acao}`, { method: 'POST' });
      onAtualizar();
    } catch {
      // Sem conexão: a ação fica guardada no IndexedDB e é reenviada
      // automaticamente pelo useSyncOffline assim que a internet voltar.
      await adicionarAcaoPendente(acao);
    } finally {
      setCarregando(null);
    }
  }

  return (
    <div className="rounded-card border border-border bg-surface p-8 text-center">
      <p className="text-sm text-secondary">
        {horaAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </p>

      <p className="mt-2 font-mono text-5xl font-medium tracking-tight text-primary md:text-6xl">
        {formatarCronometro(segundosTrabalhados)}
      </p>
      <p className="mt-1 text-xs text-secondary">
        {finalizado ? 'expediente finalizado' : emPausa ? 'em pausa' : emAndamento ? 'tempo trabalhado hoje' : 'pronto para começar'}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          {!registro?.entrada || finalizado ? (
            <motion.button
              key="iniciar"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              disabled={finalizado || carregando !== null}
              onClick={() => executar('iniciar')}
              className="rounded-lg bg-success px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
            >
              {finalizado ? 'Expediente concluído' : carregando === 'iniciar' ? 'Iniciando...' : 'Iniciar Expediente'}
            </motion.button>
          ) : (
            <motion.div
              key="controles"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex gap-3"
            >
              {emPausa ? (
                <button
                  disabled={carregando !== null}
                  onClick={() => executar('retornar')}
                  className="rounded-lg bg-success px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
                >
                  {carregando === 'retornar' ? 'Retornando...' : 'Retornar'}
                </button>
              ) : (
                <button
                  disabled={carregando !== null}
                  onClick={() => executar('pausar')}
                  className="rounded-lg bg-warning px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
                >
                  {carregando === 'pausar' ? 'Pausando...' : 'Pausar'}
                </button>
              )}
              <button
                disabled={carregando !== null}
                onClick={() => executar('finalizar')}
                className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-primary transition hover:bg-surface-hover disabled:opacity-40"
              >
                {carregando === 'finalizar' ? 'Finalizando...' : 'Finalizar Expediente'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
