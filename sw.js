// Odyssey service worker v3 — self-updating, network-first voor app-bestanden
const VERSION = 'odyssey-v3';

self.addEventListener('install', e => {
  // niet wachten: nieuwe SW meteen actief maken
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // gooi ALLE oude caches weg (ook van vorige versies)
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    // neem direct controle over alle open tabs/PWA-vensters
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // NETWORK-FIRST: altijd eerst verse versie van GitHub proberen.
    // Alleen bij offline terugvallen op cache.
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy)).catch(()=>{});
        return resp;
      }).catch(() =>
        caches.match(e.request).then(hit => hit || caches.match('index.html'))
      )
    );
  } else {
    // externe assets (fonts): cache-first
    e.respondWith(
      caches.match(e.request).then(hit =>
        hit || fetch(e.request).then(resp => {
          const copy = resp.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy)).catch(()=>{});
          return resp;
        }).catch(()=>hit)
      )
    );
  }
});
