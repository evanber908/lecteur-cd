const CACHE_NAME = 'ecoute-taylor-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './radio.html',
  './style.css',
  './manifest.json',
  './java/script.js',
  './java/radio.js',
  './img/favicon.svg',
  './img/icon-192_20years-of-taylor-swift.png',
  './img/icon-512_20years-of-taylor-swift.png',
  './img/20years-of-taylor-swift.png',
  './img/screenshot.png',
];

// Installation : mise en cache des assets statiques
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : stratégie Cache-first pour les assets, réseau pour le reste
self.addEventListener('fetch', (e) => {
  // Ne pas intercepter les requêtes non-GET ni les API externes (YouTube, NRJ, proxy)
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        // Mettre en cache uniquement les réponses valides
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});