import { User, ShoppingBag, MapPin, Sun, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

interface AccountTabProps {
    isGuest: boolean
    onLogout: () => void
}

export function AccountTab({ isGuest, onLogout }: AccountTabProps) {
    if (isGuest) {
        return (
            <div className="pb-24 pt-12 px-6 flex flex-col items-center justify-center text-center min-h-[60vh] max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">Descubre más</h2>
                <p className="text-muted-foreground mb-10 text-lg">Para ver tu historial de pedidos, guardar direcciones favoritas y ganar puntos.</p>
                <Button
                    className="w-full h-14 bg-gradient-to-r from-[#106efd] to-[#40cfde] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]"
                    onClick={onLogout}
                >
                    Iniciar sesión
                </Button>
                <Button variant="ghost" className="mt-4 font-semibold text-muted-foreground hover:text-foreground">
                    Crear cuenta nueva
                </Button>
            </div>
        )
    }

    return (
        <div className="pb-24 max-w-xl mx-auto w-full">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#106efd] to-[#40cfde] px-6 pt-6 pb-12 rounded-b-[3xl] shadow-md relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h1 className="text-2xl font-black text-white tracking-tight">Mi Perfil</h1>
                    <ThemeToggle variant="header" />
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center p-1 shadow-lg shadow-black/10">
                        <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="h-8 w-8 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-white text-2xl">Usuario Demo</h2>
                        <p className="font-medium text-white/80">usuario@email.com</p>
                        <div className="mt-2 inline-flex items-center bg-white/20 rounded-full px-3 py-1">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">🌟 1.250 Puntos</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-6 relative z-20 space-y-3">
                <MenuItem
                    icon={<ShoppingBag className="h-5 w-5 text-[#40cfde]" />}
                    title="Historial de Pedidos"
                    description="Repite tus pedidos anteriores"
                    bgColor="bg-[#40cfde]/10"
                />

                <MenuItem
                    icon={<MapPin className="h-5 w-5 text-[#106efd]" />}
                    title="Tus Direcciones"
                    description="Gestiona dónde enviamos tu comida"
                    bgColor="bg-[#106efd]/10"
                />

                <MenuItem
                    icon={<Sun className="h-5 w-5 text-amber-500" />}
                    title="Configuración"
                    description="Preferencias y notificaciones"
                    bgColor="bg-amber-500/10"
                />

                <Card className="border-border/50 shadow-sm cursor-pointer hover:bg-muted/50 transition-colors mt-8 rounded-2xl group" onClick={onLogout}>
                    <CardContent className="p-4 flex items-center justify-center gap-2 text-destructive">
                        <h3 className="font-bold">Cerrar Sesión</h3>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function MenuItem({ icon, title, description, bgColor }: { icon: React.ReactNode, title: string, description: string, bgColor: string }) {
    return (
        <Card className="border-border/50 shadow-sm cursor-pointer hover:scale-[1.01] hover:shadow-md transition-all rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${bgColor} flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{description}</p>
                </div>
                <ChevronDown className="h-5 w-5 text-muted-foreground/50 -rotate-90 shrink-0" />
            </CardContent>
        </Card>
    )
}
