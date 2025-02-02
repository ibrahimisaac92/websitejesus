const CACHE_NAME = "religious-app-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/songs.json",
  // Add other static assets and API endpoints here
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

