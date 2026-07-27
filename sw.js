const CACHE_NAME = 'shopflow-v1';

// Derive the base path from where sw.js is located.
// On GitHub Pages: self.location.pathname = '/repo-name/sw.js' -> base = '/repo-name/'
// On custom domain: self.location.pathname = '/sw.js'           -> base = '/'
// On localhost:     self.location.pathname = '/sw.js'           -> base = '/'
const BASE = self.location.pathname.replace(/sw\.js$/, '');

// All paths are relative to BASE so this works on every host automatically.
const ASSETS_TO_CACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'suggestions.json',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  // Let CDN requests (fonts, libraries) pass through with network-first.
  // Cache app shell and local data files with cache-first strategy.
  const url = new URL(event.request.url);
  const isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
