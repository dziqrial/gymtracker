const CACHE_NAME = "hit-tracker-v2"; // gue ganti v2 biar dia nge-refresh cache lama
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "https://cdn.tailwindcss.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
