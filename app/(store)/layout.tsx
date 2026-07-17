"use client"

import { DesktopSidebar } from "@/app/components/desktop-sidebar"
import { BottomNav } from "@/app/components/bottom-nav"
import { useAuth } from "@/hooks/use-auth"
import { AuthScreen } from "@/app/components/auth-screen"
import { useNotifications } from "@/hooks/use-notifications"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    const { authState, isResolvingAuth } = useAuth()
    useNotifications()

    if (isResolvingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Cargando sesión...</p>
                </div>
            </div>
        )
    }

    if (authState === "login") {
        return <AuthScreen />
    }

    return (
        <div className="min-h-screen bg-background flex w-full">
            <DesktopSidebar />
            <main className="flex-1 h-screen overflow-y-auto scrollbar-hide relative">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
