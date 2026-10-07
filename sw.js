const CACHE_NAME = 'gym-tracker-v7'; 
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    // Bersihin semua cache lama biar gak bentrok
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                .map(cacheName => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Pakai cache kalau ada, kalau gak ada coba tarik dari internet
                return response || fetch(event.request);
            })
            .catch(err => {
                // Fallback SUPER AMAN: Cuma balikin file HTML kalau yang error adalah request halaman web (navigate)
                // Jadi script JS atau CSS nggak bakal keselek file HTML lagi pas offline
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});
