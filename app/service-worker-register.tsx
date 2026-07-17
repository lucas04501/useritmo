'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registro do service worker falhou silenciosamente — o app segue
        // funcionando normalmente, só sem o modo offline/instalável.
      });
    }
  }, []);

  return null;
}
