const CACHE_NAME = 'gym-tracker-v3';
const urlsToCache = [
    '/gymtracker/',
    '/gymtracker/index.html',
    '/gymtracker/manifest.json',
    '/gymtracker/icon.png',
    'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
