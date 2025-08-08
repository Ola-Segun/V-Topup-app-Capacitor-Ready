const CACHE_NAME = 'vtopup-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Push event
self.addEventListener('push', (event) => {
  const options = {
    body: 'Default notification body',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = data.data || options.data
  }

  event.waitUntil(
    self.registration.showNotification('VTopup', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow('/dashboard')
  )
})

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Sync offline transactions
  try {
    const response = await fetch('/api/sync/offline-transactions', {
      method: 'POST'
    })
    
    if (response.ok) {
      console.log('Background sync completed')
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}
