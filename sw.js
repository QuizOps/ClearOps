// ClearOps Service Worker
const CACHE = 'clearops-v1';
const ASSETS = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network first — always get fresh data from Power Automate
  // Fall back to cache only for app shell files
  if (e.request.url.includes('powerplatform') || e.request.url.includes('graph.microsoft')) {
    return; // Never cache PA/Graph calls
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
