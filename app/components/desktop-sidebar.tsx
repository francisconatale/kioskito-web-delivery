import { Home, User, LogOut, LogIn, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

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
    const { theme, setTheme } = useTheme()

    return (
        <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex-col hidden lg:flex">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <h1 className="text-xl font-semibold tracking-tight">
                    Kioskito
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <button
                    onClick={() => onTabChange("inicio")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "inicio" 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                    <Home className="h-4 w-4" />
                    Inicio
                </button>

                <button
                    onClick={() => onTabChange("cuenta")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "cuenta" 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                    <User className="h-4 w-4" />
                    Mi Cuenta
                </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-1">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                    <span className="ml-4">Cambiar tema</span>
                </button>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    {isGuest ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    {isGuest ? "Iniciar Sesion" : "Cerrar Sesion"}
                </button>
            </div>
        </aside>
    )
}
