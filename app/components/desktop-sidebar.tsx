import { Home, User, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DesktopSidebar({
    activeTab,
    onTabChange,
    onLogout,
    isGuest
}: {
    activeTab: string
    onTabChange: (tab: string) => void
    onLogout: () => void
    isGuest: boolean
}) {
    return (
        <aside className="w-[280px] bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden lg:flex">
            <div className="p-6">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#106efd] to-[#40cfde] bg-clip-text text-transparent">
                    Kioskito
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <button
                    onClick={() => onTabChange("inicio")}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === "inicio" ? "bg-[#106efd] text-white shadow-md" : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <Home className="h-5 w-5" />
                    Inicio
                </button>

                <button
                    onClick={() => onTabChange("cuenta")}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === "cuenta" ? "bg-[#106efd] text-white shadow-md" : "text-muted-foreground hover:bg-muted"
                        }`}
                >
                    <User className="h-5 w-5" />
                    Mi Cuenta
                </button>
            </nav>

            <div className="p-6 border-t border-border mt-auto">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-3xl mb-4">
                    <span className="text-sm font-semibold">Tema</span>
                    <ThemeToggle />
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <Settings className="h-5 w-5" />
                    {isGuest ? "Iniciar Sesión" : "Cerrar Sesión"}
                </button>
            </div>
        </aside>
    )
}
