"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

const DISMISSED_KEY = "kioskito:notification-banner-dismissed"

export function NotificationBanner() {
  const { notificationState, isSubscribed, subscribe } = useNotifications()
  const [dismissed, setDismissed] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "true")
  }, [])

  if (dismissed) return null
  if (isSubscribed) return null
  if (notificationState === "denied" || notificationState === "unsupported" || notificationState === "loading") return null

  const handleActivate = async () => {
    setLoading(true)
    await subscribe()
    setLoading(false)
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, "true")
  }

  return (
    <div className="mx-4 mt-3 mb-0 bg-primary-100 rounded-2xl p-3 flex items-start gap-3 border border-primary-200">
      <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
        <Bell className="w-4 h-4 text-primary-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900">Recibí notificaciones</p>
        <p className="text-xs text-neutral-600 mt-0.5">Enterate al instante cuando tu pedido esté listo.</p>
        <button
          onClick={handleActivate}
          disabled={loading}
          className="mt-2 bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-primary-500 transition-colors disabled:opacity-50"
        >
          {loading ? "Activando..." : "Activar"}
        </button>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 mt-0.5 p-1 rounded-full hover:bg-primary-200/50 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4 text-neutral-400" />
      </button>
    </div>
  )
}
