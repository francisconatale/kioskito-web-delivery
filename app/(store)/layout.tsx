"use client"

import { useState } from "react"
import { Home, ClipboardList, User, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/app/components/bottom-nav"
import { useAuth } from "@/hooks/use-auth"
import { AuthScreen } from "@/app/components/auth-screen"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationBanner } from "@/app/components/notification-banner"

const sidebarTabs = [
    { id: "inicio", icon: Home, label: "Inicio", href: "/" },
    { id: "horarios", icon: Clock, label: "Horarios", href: "/horarios" },
    { id: "pedidos", icon: ClipboardList, label: "Pedidos", href: "/pedidos" },
    { id: "cuenta", icon: User, label: "Cuenta", href: "/cuenta" },
]

function Sidebar() {
    const pathname = usePathname()
    const [isHoveredTab, setIsHoveredTab] = useState<string | null>(null)

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r border-neutral-200/60 shadow-[1px_0_0_rgba(0,0,0,0.02)]">
            {/* Brand Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-500 to-blue-600 p-6 pb-10">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
                </div>
                <div className="relative z-10">

                    <h1 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-sm">Caffres</h1>
                    <p className="text-blue-100/80 text-xs font-medium mt-0.5 drop-shadow-sm">Delivery de confianza</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 pt-5 space-y-1">
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">Menú</p>
                {sidebarTabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = pathname === tab.href
                    const isHovered = isHoveredTab === tab.id
                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            onMouseEnter={() => setIsHoveredTab(tab.id)}
                            onMouseLeave={() => setIsHoveredTab(null)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                                isActive
                                    ? 'text-primary-700 bg-primary-100/60'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                            }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-700 shadow-[1px_0_8px_rgba(46,92,130,0.3)]" />
                            )}
                            <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isHovered ? 'scale-110' : ''} ${isActive ? 'text-primary-700' : ''}`} />
                            {tab.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-neutral-100">
                <div className="px-3 py-2.5 rounded-xl bg-neutral-50/80">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] text-center">
                        Powered by Kioskito
                    </p>
                </div>
            </div>
        </aside>
    )
}

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
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto scrollbar-hide relative pb-16 lg:pb-0">
                <NotificationBanner />
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
