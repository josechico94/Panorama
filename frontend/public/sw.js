const CACHE = 'faf-v3'
const ASSETS = ['/']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  if (e.request.url.includes('/api/')) return
  if (!e.request.url.startsWith('http')) return
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      })
      .catch(() => caches.match(e.request).then(r => r || Response.error()))
  )
})

// ── Push notification handler ──
self.addEventListener('push', e => {
  if (!e.data) return
  
  let data = {}
  try { data = e.data.json() } catch { data = { title: 'faf', body: e.data.text() } }

  const { title = 'FafApp', body = '', icon = '/icons/icon-192.png', badge = '/icons/icon-72.png', url = '/' } = data

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      vibrate: [200, 100, 200],
      data: { url },
      actions: [
        { action: 'open', title: 'Apri' },
        { action: 'close', title: 'Chiudi' },
      ],
      tag: 'faf-notification',
      renotify: true,
    })
  )
})

// ── Notification click handler ──
self.addEventListener('notificationclick', e => {
  e.notification.close()
  
  if (e.action === 'close') return

  const url = e.notification.data?.url || '/'
  
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes('faf-app.com') && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Open new tab
      if (clients.openWindow) return clients.openWindow('https://faf-app.com' + url)
    })
  )
})
