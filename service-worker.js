const CACHE_NAME = "wmaa-scheduler-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
  // add icon files here when you create them: "icon-192.png", "icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then(cached => {
      return (
        cached ||
        fetch(request).then(response => {
          return response;
        })
      );
    })
  );
});
