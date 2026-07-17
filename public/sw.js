self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener("push", (event) => {
  let title = "Caffres"
  let body = ""
  let data = {}

  if (event.data) {
    try {
      const payload = event.data.json()
      title = payload.notification?.title || payload.title || title
      body = payload.notification?.body || payload.body || ""
      data = payload.data || payload
    } catch {
      body = event.data.text()
    }
  }

  const options = {
    body,
    icon: "/web-app-manifest-192x192.png",
    badge: "/icon-light-32x32.png",
    data,
    vibrate: [200, 100, 200],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  let url = "/"

  if (data.web === "ECOMMERCE") {
    if (data.target === "ORDERS") url = "/?tab=pedidos"
    else if (data.target === "HOME") url = "/"
  } else if (data.web === "POS") {
    url = "/dashboard"
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
