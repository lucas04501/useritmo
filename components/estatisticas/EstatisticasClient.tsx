'use client';

import { useEffect, useState } from 'react';
import { GraficoBarras } from './GraficoBarras';
import { GraficoLinha } from './GraficoLinha';
import { Heatmap } from './Heatmap';
import { RecordesCards, ComparacaoSemanas } from './RecordesCards';

interface DadosEstatisticas {
  horasPorDiaSemana: { dia: string; minutos: number }[];
  evolucaoSemanal: { label: string; minutosTrabalhados: number }[];
  heatmap: { data: string; minutos: number }[];
  recordes: {
    maiorJornada: number;
    menorJornada: number;
    diasTrabalhados: number;
    diasAusentes: number;
    mediaDiaria: number;
  };
  comparacaoSemanas: { atual: number; anterior: number };
}

export function EstatisticasClient() {
  const [dados, setDados] = useState<DadosEstatisticas | null>(null);

  useEffect(() => {
    fetch('/api/estatisticas')
      .then((res) => (res.ok ? res.json() : null))
      .then(setDados);
  }, []);

  if (!dados) {
    return <p className="text-sm text-secondary">Carregando...</p>;
  }

  const semRegistros = dados.recordes.diasTrabalhados === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-lg font-semibold text-primary">Estatísticas</h1>

      {semRegistros ? (
        <div className="rounded-card border border-border bg-surface p-8 text-center text-secondary">
          <p className="text-sm">Ainda não há registros suficientes para gerar estatísticas.</p>
          <p className="mt-1 text-xs">Assim que você começar a bater ponto, os gráficos aparecem aqui.</p>
        </div>
      ) : (
        <>
          <RecordesCards recordes={dados.recordes} />
          <ComparacaoSemanas atual={dados.comparacaoSemanas.atual} anterior={dados.comparacaoSemanas.anterior} />
          <div className="grid gap-6 md:grid-cols-2">
            <GraficoBarras dados={dados.horasPorDiaSemana} />
            <GraficoLinha dados={dados.evolucaoSemanal} />
          </div>
          <Heatmap dados={dados.heatmap} />
        </>
      )}
    </div>
  );
}
