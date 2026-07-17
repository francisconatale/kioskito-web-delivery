"use client"

import { useState, useEffect, useCallback } from "react"
import { getToken, deleteToken, onMessage } from "firebase/messaging"
import { messaging } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { getAuthHeaders } from "@/lib/api-client"
import { toast } from "sonner"

const ASKED_KEY = "kioskito:notification-asked"
const SUBSCRIBE_URL = "/api/notifications/tokens"

type NotifState = "loading" | "unsupported" | "default" | "granted" | "denied"

export function useNotifications() {
  const { authState } = useAuth()
  const [swReady, setSwReady] = useState(false)
  const [notificationState, setNotificationState] = useState<NotifState>("loading")
  const [fcmToken, setFcmToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      setNotificationState("unsupported")
      return
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotificationState("unsupported")
      return
    }

    setNotificationState(Notification.permission as NotifState)

    if (authState !== "login") {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registrado con éxito:", reg.scope)
          setSwReady(true)
        })
        .catch((err) => {
          console.error("Error al registrar el Service Worker:", err)
        })
    }
  }, [authState])

  const subscribe = useCallback(async () => {
    if (!messaging) return

    const permission = await Notification.requestPermission()
    setNotificationState(permission as NotifState)
    if (permission !== "granted") return

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.error("NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set")
      return
    }

    try {
      console.log("Solicitando registro de SW para obtener token manualmente...")
      const registration = await navigator.serviceWorker.ready
      
      console.log("Solicitando token a FCM...")
      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })

      console.log("Token obtenido (manual):", token)

      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ token, plataforma: "WEB" }),
      })
      
      if (!res.ok) {
        throw new Error("Fallo la petición a " + SUBSCRIBE_URL)
      }
      
      console.log("Suscripción manual enviada al servidor")

      setFcmToken(token)
      sessionStorage.setItem(ASKED_KEY, "granted")
    } catch (err) {
      console.error("Error subscribiéndose a notificaciones (manual):", err)
    }
  }, [])

  const unsubscribe = useCallback(async () => {
    if (!messaging || !fcmToken) return

    try {
      await deleteToken(messaging)

      await fetch(`${SUBSCRIBE_URL}/${fcmToken}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      setFcmToken(null)
      setNotificationState("default")
      sessionStorage.removeItem(ASKED_KEY)
    } catch (err) {
      console.error("Error unsubscribing from notifications:", err)
    }
  }, [fcmToken])

  useEffect(() => {
    if (!messaging) return

    const unsub = onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || "Caffres"
      const body = payload.notification?.body || payload.data?.body || ""

      toast(title, {
        description: body,
        duration: 5000,
      })
    })

    return unsub
  }, [])

  useEffect(() => {
    if (authState === "login") return
    if (!swReady) return
    if (notificationState === "denied") return
    if (notificationState === "unsupported") return

    const asked = sessionStorage.getItem(ASKED_KEY)
    if (asked) return

    sessionStorage.setItem(ASKED_KEY, "true")

    const timer = setTimeout(() => {
      toast("¿Querés recibir notificaciones?", {
        description: "Te avisamos cuando tu pedido esté listo o tengamos promociones.",
        duration: 10000,
        action: {
          label: "Activar",
          onClick: subscribe,
        },
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [authState, swReady, notificationState, subscribe])

  return {
    notificationState,
    isSubscribed: notificationState === "granted" && fcmToken !== null,
    subscribe,
    unsubscribe,
  }
}
