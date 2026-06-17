const CACHE_NAME = 'lore-cache-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  '/feed',
  '/bookmarks',
  '/profile',
  '/offline'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Exclude API and Auth routes from caching
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but update it in the background
        event.waitUntil(
          fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }).catch(() => {})
        );
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache successful GET requests to grow the offline cache dynamically
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            
            // Limit cache size - primitive way (just as an example, in real app more complex logic)
            // e.g. cache last 20 articles offline
          });
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
