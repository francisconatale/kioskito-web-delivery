import { User, ShoppingBag, MapPin, Settings, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccountTabProps {
    isGuest: boolean
    onLogout: () => void
}

export function AccountTab({ isGuest, onLogout }: AccountTabProps) {
    if (isGuest) {
        return (
            <div className="pb-24 px-6 flex flex-col items-center justify-center text-center min-h-[60vh] max-w-sm mx-auto">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2">
                    Inicia sesion
                </h2>
                <p className="text-muted-foreground mb-8">
                    Accede a tu historial de pedidos, direcciones guardadas y mas.
                </p>
                <Button
                    className="w-full h-11"
                    onClick={onLogout}
                >
                    Iniciar sesion
                </Button>
                <Button 
                    variant="ghost" 
                    className="mt-3 text-muted-foreground"
                >
                    Crear cuenta nueva
                </Button>
            </div>
        )
    }

    return (
        <div className="pb-24 max-w-xl mx-auto w-full">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="px-6 h-16 flex items-center">
                    <h1 className="text-lg font-semibold">Mi Cuenta</h1>
                </div>
            </header>

            {/* Profile */}
            <div className="px-6 py-8">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">Usuario Demo</h2>
                        <p className="text-sm text-muted-foreground">usuario@email.com</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 space-y-1">
                <MenuItem
                    icon={<ShoppingBag className="h-5 w-5" />}
                    title="Historial de Pedidos"
                    description="Ver pedidos anteriores"
                />

                <MenuItem
                    icon={<MapPin className="h-5 w-5" />}
                    title="Direcciones"
                    description="Gestionar direcciones de entrega"
                />

                <MenuItem
                    icon={<Settings className="h-5 w-5" />}
                    title="Configuracion"
                    description="Preferencias y notificaciones"
                />

                <div className="pt-4">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesion
                    </button>
                </div>
            </div>
        </div>
    )
}

function MenuItem({ 
    icon, 
    title, 
    description 
}: { 
    icon: React.ReactNode
    title: string
    description: string 
}) {
    return (
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
    )
}
