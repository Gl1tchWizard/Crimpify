// Crimpify service worker — offline-first met verse index
const CACHE = 'crimpify-v50';
const CORE = [
  './',
  'index.html',
  'app.js',
  'style.css',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png',
  'favicon.svg',
  'og.png'
];

self.addEventListener('install', e => {
  // cache:'reload' dwingt verse bytes van het netwerk af; zonder dit mag de
  // browser-HTTP-cache een oude app.js in de nieuwe named cache stoppen en
  // blijft een bezoeker op verouderde code hangen tot die cache verloopt
  // skipWaiting hoort hier: zonder blijft een nieuwe sw eeuwig wachten bij
  // clients met oude app.js (die kennen geen update-balk of bericht), en
  // krijgen die intussen wel een verse index (network-first) naast hun
  // gecachte oude app.js en css. Die versie-skew was de dode Skip-knop in
  // v0.45. Reload-timing regelt de app zelf: nooit tijdens een sessie.
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // index/navigatie: netwerk eerst zodat updates landen, cache als vangnet
  if (e.request.mode === 'navigate' || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        // alleen geslaagde antwoorden cachen: een 404 mag nooit blijven
        // hangen als de offline-kopie van een pad (backlog 27, /why)
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // /why/-assets: netwerk eerst. De publieke site staat bewust niet in de
  // precache; cache-first pinde hier de allereerste site.css voor eeuwig
  // naast een verse index (network-first) — de onstijlbare bibliotheek.
  // Cache blijft het offline-vangnet.
  if (url.pathname.startsWith('/why/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // overige assets: cache eerst, netwerk als aanvulling
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
