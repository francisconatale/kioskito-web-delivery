import { User, ShoppingBag, MapPin, Settings, ChevronRight, LogOut, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface AccountTabProps {
    onTabChange: (tab: string) => void
}

export function AccountTab({ onTabChange }: AccountTabProps) {
    const { user: userInfo, authState, logout: onLogout } = useAuth()
    const isGuest = authState === "guest"

    if (isGuest) {
        return (
            <div className="pb-32 px-6 flex flex-col items-center justify-center text-center min-h-[80vh] max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-xl shadow-primary/5">
                    <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-3 text-foreground/90">
                    Tu Espacio <span className="text-primary italic font-medium">Kioskito</span>
                </h2>
                <p className="text-muted-foreground text-sm font-medium mb-10 leading-relaxed px-4">
                    Identificate para acceder a tus pedidos, direcciones guardadas y promociones exclusivas.
                </p>
                <div className="w-full space-y-4">
                    <Button
                        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/20"
                        onClick={onLogout}
                    >
                        <LogIn className="h-4 w-4" />
                        Iniciar sesión
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold border-border/50 hover:bg-muted/50"
                        onClick={onLogout}
                    >
                        <UserPlus className="h-4 w-4" />
                        Crear una cuenta
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-32 max-w-xl mx-auto w-full selection:bg-primary/20 animate-in fade-in duration-300">
            {/* Header */}
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0">
                <div className="px-6 h-16 flex items-center">
                    <h1 className="text-lg font-bold tracking-tight">Mi Perfil</h1>
                </div>
            </header>

            {/* Profile */}
            <div className="px-6 py-10">
                <div className="flex items-center gap-5">
                    <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group">
                        <User className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl text-foreground/90 leading-tight">
                            {userInfo?.nombre || "Cargando..."}
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">{userInfo?.email}</p>
                        {userInfo?.dni && (
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10">
                                DNI: {userInfo.dni}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 space-y-2">
                <MenuItem
                    icon={<ShoppingBag className="h-5 w-5" />}
                    title="Historial de Pedidos"
                    description="Consultá el estado de tus compras"
                    onClick={() => onTabChange("pedidos")}
                />

                <MenuItem
                    icon={<MapPin className="h-5 w-5" />}
                    title="Mis Direcciones"
                    description="Gestioná tus puntos de entrega"
                />

                <MenuItem
                    icon={<Settings className="h-5 w-5" />}
                    title="Configuración"
                    description="Personalizá tu experiencia"
                />

                <div className="pt-8 px-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5 opacity-70" />
                        Cerrar Sesión
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground/30 font-bold uppercase tracking-widest mt-10">Kioskito Delivery v1.0.0</p>
                </div>
            </div>
        </div>
    )
}

function MenuItem({
    icon,
    title,
    description,
    onClick
}: {
    icon: React.ReactNode
    title: string
    description: string
    onClick?: () => void
}) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-transparent hover:border-border/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-left group"
        >
            <div className="h-12 w-12 rounded-[1rem] bg-muted/50 flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground/90 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 group-hover:translate-x-1 group-hover:text-primary transition-all" />
        </button>
    )
}
