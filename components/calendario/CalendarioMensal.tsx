'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatarMinutos } from '@/lib/calculos/tempoTrabalhado';

type StatusDia =
  | 'COMPLETO'
  | 'INCOMPLETO'
  | 'AUSENTE'
  | 'FERIADO'
  | 'EM_ANDAMENTO'
  | 'FUTURO'
  | 'FIM_DE_SEMANA';

interface DiaCalendario {
  data: string;
  status: StatusDia;
  nomeFeriado: string | null;
  minutosTrabalhados: number;
  minutosExtras: number;
  observacao: string | null;
  entrada: string | null;
  saida: string | null;
}

const CORES_STATUS: Record<StatusDia, string> = {
  COMPLETO: 'bg-success',
  EM_ANDAMENTO: 'bg-accent',
  INCOMPLETO: 'bg-warning',
  FERIADO: 'bg-info',
  AUSENTE: 'bg-danger',
  FUTURO: 'bg-transparent',
  FIM_DE_SEMANA: 'bg-transparent',
};

const LEGENDA: { status: StatusDia; label: string }[] = [
  { status: 'COMPLETO', label: 'Completo' },
  { status: 'INCOMPLETO', label: 'Incompleto' },
  { status: 'FERIADO', label: 'Feriado' },
  { status: 'AUSENTE', label: 'Ausência' },
];

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const NOMES_MES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatarHora(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function CalendarioMensal() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [dias, setDias] = useState<DiaCalendario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<DiaCalendario | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const res = await fetch(`/api/calendario?mes=${mes}&ano=${ano}`);
    if (res.ok) {
      const json = await res.json();
      setDias(json.dias);
    }
    setCarregando(false);
  }, [mes, ano]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function mudarMes(delta: number) {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes > 12) {
      novoMes = 1;
      novoAno++;
    } else if (novoMes < 1) {
      novoMes = 12;
      novoAno--;
    }
    setMes(novoMes);
    setAno(novoAno);
  }

  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay();
  const celulasVazias = Array.from({ length: primeiroDiaSemana });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-primary">Calendário</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => mudarMes(-1)}
            className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="w-36 text-center text-sm text-primary">
            {NOMES_MES[mes - 1]} {ano}
          </span>
          <button
            onClick={() => mudarMes(1)}
            className="rounded-lg p-1.5 text-secondary transition hover:bg-surface-hover hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-secondary">
          {DIAS_SEMANA.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <motion.div
          key={`${mes}-${ano}`}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {celulasVazias.map((_, i) => (
            <div key={`vazio-${i}`} />
          ))}
          {dias.map((dia) => {
            const numeroDia = new Date(dia.data).getDate();
            const ehHoje =
              new Date(dia.data).toDateString() === hoje.toDateString();
            const clicavel = dia.status !== 'FUTURO';

            return (
              <button
                key={dia.data}
                disabled={!clicavel}
                onClick={() => setDiaSelecionado(dia)}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition ${
                  clicavel ? 'hover:bg-surface-hover' : 'opacity-30'
                } ${ehHoje ? 'ring-1 ring-accent' : ''}`}
              >
                <span className="text-primary">{numeroDia}</span>
                {dia.status !== 'FUTURO' && dia.status !== 'FIM_DE_SEMANA' && (
                  <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${CORES_STATUS[dia.status]}`} />
                )}
              </button>
            );
          })}
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3">
          {LEGENDA.map(({ status, label }) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-secondary">
              <span className={`h-1.5 w-1.5 rounded-full ${CORES_STATUS[status]}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {diaSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setDiaSelecionado(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-card border border-border bg-surface p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-primary">
                  {new Date(diaSelecionado.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </h2>
                <button
                  onClick={() => setDiaSelecionado(null)}
                  className="rounded-lg p-1 text-secondary hover:bg-surface-hover hover:text-primary"
                >
                  <X size={16} />
                </button>
              </div>

              {diaSelecionado.nomeFeriado ? (
                <p className="text-sm text-info">Feriado: {diaSelecionado.nomeFeriado}</p>
              ) : diaSelecionado.status === 'AUSENTE' ? (
                <p className="text-sm text-secondary">Nenhum registro neste dia.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Entrada</span>
                    <span className="font-mono-num text-primary">{formatarHora(diaSelecionado.entrada)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Saída</span>
                    <span className="font-mono-num text-primary">{formatarHora(diaSelecionado.saida)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Trabalhado</span>
                    <span className="font-mono-num text-primary">
                      {formatarMinutos(diaSelecionado.minutosTrabalhados)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Extra</span>
                    <span className="font-mono-num text-success">
                      {diaSelecionado.minutosExtras > 0
                        ? `+${formatarMinutos(diaSelecionado.minutosExtras)}`
                        : '—'}
                    </span>
                  </div>
                  {diaSelecionado.observacao && (
                    <div className="border-t border-border pt-2 text-secondary">
                      {diaSelecionado.observacao}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {carregando && <p className="text-center text-xs text-secondary">Carregando...</p>}
    </div>
  );
}
