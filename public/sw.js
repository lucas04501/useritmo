const CACHE_NOME = 'ritmo-v1';
const APP_SHELL = ['/dashboard', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((chave) => chave !== CACHE_NOME).map((chave) => caches.delete(chave)))
    )
  );
  self.clients.claim();
});

// Estratégia: network-first para /api (dados sempre frescos quando online),
// cache-first para o app shell (garante que o app abre offline).
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(
        () => new Response(JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respostaCache) => {
      const fetchPromise = fetch(event.request)
        .then((respostaRede) => {
          caches.open(CACHE_NOME).then((cache) => cache.put(event.request, respostaRede.clone()));
          return respostaRede;
        })
        .catch(() => respostaCache);
      return respostaCache || fetchPromise;
    })
  );
});
