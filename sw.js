// Odyssey service worker — auto-updating
// Strategie: network-first voor de app zelf (zodat updates direct binnenkomen),
// cache-first voor de rest (fonts e.d.). Geen handmatige versie-bump meer nodig.

const CACHE = 'odyssey';
const CORE = ['./', 'index.html', 'manifest.json', 'icon.svg'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(()=>{}));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isAppFile = url.origin === self.location.origin;

  if (isAppFile) {
    // network-first: probeer verse versie, val terug op cache bij offline
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html')))
    );
  } else {
    // externe assets (fonts): cache-first
    e.respondWith(
      caches.match(e.request).then(hit =>
        hit || fetch(e.request).then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return resp;
        }).catch(()=>hit)
      )
    );
  }
});
