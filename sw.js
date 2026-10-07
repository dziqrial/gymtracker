const CACHE_NAME = 'gym-tracker-v10'; 
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
    // Link Tailwind kita keluarin dari sini biar proses install 100% sukses
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
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
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                // 1. Kalau filenya udah ada di cache HP, langsung pakai
                if (response) {
                    return response;
                }
                // 2. Kalau belum ada (kayak CSS Tailwind), tarik dari internet...
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        // ...lalu simpan diam-diam ke HP buat dipake pas offline nanti
                        if (event.request.url.startsWith('http')) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
            .catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html', { ignoreSearch: true });
                }
            })
    );
});
