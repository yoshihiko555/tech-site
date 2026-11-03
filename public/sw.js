// The old site registered a PWA service worker at /sw.js.
// This replacement removes itself: it clears the old caches, unregisters,
// and reloads open tabs so they are served straight from the network.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach(client => client.navigate(client.url))
    })(),
  )
})
