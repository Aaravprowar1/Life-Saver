/* ==========================================================================
   Life Saver: Service Worker (cache-first, offline-first)
   Bump CACHE_VERSION whenever any app file changes so clients get the update.
   ========================================================================== */
'use strict';

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `life-saver-${CACHE_VERSION}`;

// Relative to the service worker's location, so the app works from a
// sub-path (GitHub Pages project sites) as well as a domain root (Vercel).
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

const INDEX_URL = new URL('./index.html', self.location).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map((path) => new Request(path, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('life-saver-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  // ignoreSearch so "index.html?source=pwa" etc. still hit the cached shell.
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Offline and not cached: any page navigation falls back to the app shell.
    if (request.mode === 'navigate') {
      const shell = await cache.match(INDEX_URL);
      if (shell) return shell;
    }
    return new Response('Offline and this resource is not cached.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
