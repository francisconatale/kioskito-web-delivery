import { useState } from "react"
import { Mail, Lock, ArrowRight, User, Fingerprint, MapPin, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

export function AuthScreen() {
    const { login, register, setAsGuest } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nombre, setNombre] = useState("")
    const [dni, setDni] = useState("")
    const [direccion, setDireccion] = useState("")
    const [telefono, setTelefono] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                await login({ username: email, password })
            } else {
                await register({
                    username: email,
                    email,
                    password,
                    nombre,
                    dni,
                    direccion,
                    telefono
                })
            }
        } catch (err: any) {
            console.error("Auth error:", err)
            setError(err.message || "Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-24 selection:bg-primary/20 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10 translate-y-0 group">
                    <h1 className="text-4xl font-bold tracking-tighter mb-3 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                        Kioskito <span className="text-primary italic font-medium">Delivery</span>
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-70">
                        Premium Service • Fast & Reliable
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass border-border/40 p-1 rounded-[2.5rem] shadow-2xl shadow-primary/5">
                    <div className="bg-card/50 rounded-[2.2rem] p-8 space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-tight">
                                {isLogin ? "Bienvenido de nuevo" : "Unite a la experiencia"}
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">
                                {isLogin
                                    ? "Ingresá tus credenciales para continuar"
                                    : "Completá tus datos para registrarte"
                                }
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/5 text-destructive text-[10px] font-bold uppercase tracking-wider p-4 rounded-2xl border border-destructive/10 text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-4 duration-300">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            type="text"
                                            placeholder="Nombre completo"
                                            className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            type="text"
                                            placeholder="DNI"
                                            className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    type="text"
                                    placeholder="Usuario o email"
                                    className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-4 duration-300">
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            type="tel"
                                            placeholder="Teléfono"
                                            className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            type="text"
                                            placeholder="Dirección de entrega"
                                            className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                <Input
                                    type="password"
                                    placeholder="Contraseña"
                                    className="pl-11 h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base tracking-tight shadow-lg shadow-primary/10 active:scale-[0.98] transition-all" disabled={loading}>
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    isLogin ? "Iniciar Sesión" : "Crear mi Cuenta"
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setError(null)
                                }}
                                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                                disabled={loading}
                            >
                                {isLogin ? (
                                    <>¿No tenés cuenta? <span className="text-primary italic">Registrate</span></>
                                ) : (
                                    <>¿Ya tenés cuenta? <span className="text-primary italic">Iniciá sesión</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-10 px-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
                            o también
                        </span>
                    </div>
                </div>

                {/* Guest button */}
                <button
                    type="button"
                    onClick={setAsGuest}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-muted/30 border border-border/40 text-sm font-semibold text-foreground/70 hover:bg-muted/50 hover:border-primary/20 hover:text-primary transition-all group active:scale-[0.98]"
                >
                    Continuar como invitado
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <p className="mt-12 text-center text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest">
                    © 2024 Kioskito Ecosystem
                </p>
            </div>
        </div>
    )
}
