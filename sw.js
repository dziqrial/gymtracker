const CACHE_NAME = 'gym-tracker-v5'; // Naik versi biar maksa refresh
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Paksa langsung jalan tanpa nunggu tab ditutup
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    // Hapus cache versi lama biar memori HP nggak penuh & gak nyangkut
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
            .then(response => response || fetch(event.request))
            .catch(() => caches.match('./index.html')) // Fallback kalau gagal
    );
});
