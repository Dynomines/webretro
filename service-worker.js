
const CACHE_NAME = 'webretro-cache-v1';

// This will dynamically cache the entire site when it is accessed.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/', 
        '/index.html', 
        '/manifest.json', 
        '/assets/base.css?v=6.5',
        '/assets/jswindow.css',
        '/assets/icons/icon204.png',
        '/assets/icons/iconm256.png',
        '/assets/zip-2.4.7.min.js',
        '/assets/md5.min.js',
        '/uauth/uauth.js',
        '/assets/jswindow.js',
        '/pwa.js',
        '/assets/charToCodeMap.js?v=6.5',
        '/assets/base.js?v=6.5',
      ]).then(() => {
        // Notify all clients (pages) that caching is complete
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage('caching-complete'));
        });
      });
    })
  );
});


// Serve cached content when offline or network is slow
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Delete old caches when the service worker is activated
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
