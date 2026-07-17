'use client';

import { listarAcoesPendentes, removerAcaoPendente } from './queue';

/**
 * Reproduz a fila de ações pendentes contra a API, em ordem, uma de cada vez.
 * Como todas as rotas de ponto são idempotentes (ver app/api/ponto/*), reenviar
 * uma ação que talvez já tenha sido aplicada no servidor não duplica nada.
 * Para na primeira falha de rede (mantém o restante da fila para a próxima tentativa).
 */
export async function sincronizarAcoesPendentes(): Promise<{ sincronizadas: number }> {
  const pendentes = await listarAcoesPendentes();
  let sincronizadas = 0;

  for (const item of pendentes) {
    try {
      const res = await fetch(`/api/ponto/${item.acao}`, { method: 'POST' });
      if (!res.ok && res.status !== 409) {
        // Erro do servidor (não de rede): remove da fila para não travar em loop infinito.
        if (item.id !== undefined) await removerAcaoPendente(item.id);
        continue;
      }
      if (item.id !== undefined) await removerAcaoPendente(item.id);
      sincronizadas++;
    } catch {
      // Falha de rede: provavelmente ainda offline. Interrompe e tenta de novo depois.
      break;
    }
  }

  return { sincronizadas };
}
