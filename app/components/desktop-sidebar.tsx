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
        <aside className="w-64 glass border-r border-border h-screen sticky top-0 flex-col hidden lg:flex shadow-xl shadow-primary/5">
            <div className="h-20 flex flex-col justify-center px-6 border-b border-border/50">
                <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
                    Kioskito <span className="text-primary font-normal italic">Delivery</span>
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">Premium Service</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <button
                    onClick={() => onTabChange("inicio")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === "inicio" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <Home className={`h-4 w-4 ${activeTab === "inicio" ? "fill-primary-foreground/20" : ""}`} />
                    Inicio
                </button>

                <button
                    onClick={() => onTabChange("pedidos")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === "pedidos" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <ClipboardList className={`h-4 w-4 ${activeTab === "pedidos" ? "fill-primary-foreground/20" : ""}`} />
                    Mis Pedidos
                </button>

                <button
                    onClick={() => onTabChange("cuenta")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === "cuenta" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                    <User className={`h-4 w-4 ${activeTab === "cuenta" ? "fill-primary-foreground/20" : ""}`} />
                    Cuenta
                </button>
            </nav>

            <div className="p-4 border-t border-border/50">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                    {isGuest ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    {isGuest ? "Iniciar Sesión" : "Cerrar Sesión"}
                </button>
            </div>
        </aside>
    )
}
