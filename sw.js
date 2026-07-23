// Crimpify service worker — offline-first met verse index
const CACHE = 'crimpify-v38';
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
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
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
