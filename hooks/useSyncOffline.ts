'use client';

import { useEffect, useState, useCallback } from 'react';
import { sincronizarAcoesPendentes } from '@/lib/pwa/sync';
import { contarAcoesPendentes } from '@/lib/pwa/queue';

export function useSyncOffline(onSincronizado?: () => void) {
  const [online, setOnline] = useState(true);
  const [pendentes, setPendentes] = useState(0);

  const atualizarContagem = useCallback(async () => {
    try {
      setPendentes(await contarAcoesPendentes());
    } catch {
      // IndexedDB indisponível (ex: modo privado) — segue sem fila offline.
    }
  }, []);

  const sincronizar = useCallback(async () => {
    try {
      const { sincronizadas } = await sincronizarAcoesPendentes();
      await atualizarContagem();
      if (sincronizadas > 0) onSincronizado?.();
    } catch {
      // sem-op: tenta de novo no próximo evento 'online'
    }
  }, [atualizarContagem, onSincronizado]);

  useEffect(() => {
    setOnline(navigator.onLine);
    atualizarContagem();

    function aoFicarOnline() {
      setOnline(true);
      sincronizar();
    }
    function aoFicarOffline() {
      setOnline(false);
    }

    window.addEventListener('online', aoFicarOnline);
    window.addEventListener('offline', aoFicarOffline);

    if (navigator.onLine) sincronizar();

    return () => {
      window.removeEventListener('online', aoFicarOnline);
      window.removeEventListener('offline', aoFicarOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { online, pendentes };
}
