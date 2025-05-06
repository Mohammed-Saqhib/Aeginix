// Enhanced service worker with optimized caching strategies

const CACHE_NAME = 'aeginix-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/normalize.css',
  '/css/sections/header.css',
  '/css/sections/about.css',
  '/css/sections/services.css',
  '/css/sections/why-us.css',
  '/css/sections/testimonials.css',
  '/css/sections/contact.css',
  '/css/sections/footer.css',
  '/js/main.js',
  '/js/components/navigation.js',
  '/js/components/animations.js',
  '/js/components/form-validation.js',
  '/js/components/testimonial-slider.js',
  '/manifest.json',
  '/offline.html'
];

const CONTENT_CACHE = [
  'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap'
];

// Remove duplicate service worker file from js directory
// This is now the single, consolidated service worker

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching app shell');
        return cache.addAll(APP_SHELL);
      }),
      caches.open(CACHE_NAME + '-content').then(cache => {
        console.log('Caching content');
        return cache.addAll(CONTENT_CACHE);
      })
    ])
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('aeginix-cache-') && 
                   cacheName !== CACHE_NAME && 
                   cacheName !== CACHE_NAME + '-content';
          })
          .map(cacheName => {
            console.log('Deleting old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests that aren't essential
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('cdn') && 
      !event.request.url.includes('fonts.googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses or non-GET requests
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If fetch fails, return the offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
