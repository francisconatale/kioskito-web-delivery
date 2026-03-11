import { Home, User, LogOut, LogIn, ClipboardList } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DesktopSidebar({
    activeTab,
    onTabChange
}: {
    activeTab: string
    onTabChange: (tab: string) => void
}) {
    const { authState, logout: onLogout } = useAuth()
    const isGuest = authState === "guest"
    return (
        <aside className="w-56 bg-card border-r border-border h-screen sticky top-0 flex-col hidden lg:flex">
            <div className="h-14 flex items-center px-4 border-b border-border">
                <h1 className="font-semibold">Kioskito</h1>
            </div>

            <nav className="flex-1 p-3 space-y-0.5">
                <button
                    onClick={() => onTabChange("inicio")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === "inicio" 
                            ? "bg-muted text-foreground font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <Home className="h-4 w-4" />
                    Inicio
                </button>

                <button
                    onClick={() => onTabChange("pedidos")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === "pedidos" 
                            ? "bg-muted text-foreground font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <ClipboardList className="h-4 w-4" />
                    Mis Pedidos
                </button>

                <button
                    onClick={() => onTabChange("cuenta")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === "cuenta" 
                            ? "bg-muted text-foreground font-medium" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <User className="h-4 w-4" />
                    Cuenta
                </button>
            </nav>

            <div className="p-3 border-t border-border">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                    {isGuest ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    {isGuest ? "Iniciar Sesion" : "Cerrar Sesion"}
                </button>
            </div>
        </aside>
    )
}
