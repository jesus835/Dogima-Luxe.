const CACHE_NAME = 'dogima-images-v1';
const RUNTIME_CACHE = 'dogima-runtime-v1';

self.addEventListener('install', (event) => {
  // Activación inmediata
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Limpiar caches viejos si cambiamos el nombre
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
          return caches.delete(key);
        }
      })
    );
    await self.clients.claim();
  })());
});

// Estrategia cache-first para imágenes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const isImage = request.destination === 'image' || /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);

  if (isImage) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const response = await fetch(request, { credentials: 'same-origin' });
        if (response && response.ok) {
          // Clonar y guardar en cache sin bloquear la respuesta
          const copy = response.clone();
          cache.put(request, copy);
        }
        return response;
      } catch (err) {
        // Fallback opcional: podríamos devolver una imagen placeholder
        return new Response('', { status: 504, statusText: 'Offline image fetch failed' });
      }
    })());
    return;
  }

  // Para otras solicitudes, dejar pasar o agregar más estrategias según necesidad
});


