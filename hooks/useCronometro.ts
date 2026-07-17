'use client';

import { useEffect, useState } from 'react';

interface PausaLeve {
  inicio: string;
  fim: string | null;
}

interface UseCronometroParams {
  entrada: string | null;
  saida: string | null;
  pausas: PausaLeve[];
}

export function useCronometro({ entrada, saida, pausas }: UseCronometroParams) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!entrada) {
      setSegundos(0);
      return;
    }

    function calcular() {
      const agora = Date.now();
      const inicioMs = new Date(entrada as string).getTime();
      const fimMs = saida ? new Date(saida).getTime() : agora;

      const pausadoMs = pausas.reduce((total, p) => {
        const pFim = p.fim ? new Date(p.fim).getTime() : agora;
        return total + Math.max(0, pFim - new Date(p.inicio).getTime());
      }, 0);

      const trabalhadoMs = Math.max(0, fimMs - inicioMs - pausadoMs);
      setSegundos(Math.floor(trabalhadoMs / 1000));
    }

    calcular();
    if (saida) return;

    const emPausa = pausas.some((p) => !p.fim);
    if (emPausa) return;

    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [entrada, saida, pausas]);

  return segundos;
}
