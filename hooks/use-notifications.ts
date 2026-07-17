"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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

  const restored = useRef(false)

  useEffect(() => {
    if (authState === "login") return
    if (!swReady) return
    if (notificationState !== "granted") return
    if (fcmToken) return
    if (restored.current) return
    if (!messaging) return

    restored.current = true

    ;(async () => {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (!subscription) return

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        if (!vapidKey) return

        const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })

        const res = await fetch(SUBSCRIBE_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ token, plataforma: "WEB" }),
        })

        if (!res.ok) throw new Error("Fallo al restaurar suscripción")

        setFcmToken(token)
        sessionStorage.setItem(ASKED_KEY, "granted")
      } catch (err) {
        console.error("Error restoring subscription:", err)
      }
    })()
  }, [authState, swReady, notificationState, fcmToken])

  return {
    notificationState,
    isSubscribed: notificationState === "granted" && fcmToken !== null,
    subscribe,
    unsubscribe,
  }
}
