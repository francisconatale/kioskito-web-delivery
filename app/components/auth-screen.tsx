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
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-slate-900 to-black flex flex-col items-center justify-center p-6 pb-24 selection:bg-white/20 overflow-hidden relative font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-40 -left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-20 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-8 translate-y-0 group">
                    <h1 className="font-display text-5xl font-bold tracking-tighter mb-2 text-white drop-shadow-sm">
                        Caffres
                    </h1>
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] opacity-80">
                        Premium Service • Fast & Reliable
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl relative">
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                            {isLogin ? "Bienvenido de nuevo" : "Unite a la experiencia"}
                        </h2>
                        <p className="text-xs text-white/70 font-medium">
                            {isLogin
                                ? "Ingresá tus credenciales para continuar"
                                : "Completá tus datos para registrarte"
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-white text-[10px] font-bold uppercase tracking-wider p-4 rounded-2xl border border-red-500/30 text-center animate-shake mb-6 backdrop-blur-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre completo"
                                        className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                                    <Input
                                        type="text"
                                        placeholder="DNI"
                                        className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                            <Input
                                type="text"
                                placeholder="Usuario o email"
                                className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                                    <Input
                                        type="tel"
                                        placeholder="Teléfono"
                                        className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                                    <Input
                                        type="text"
                                        placeholder="Dirección de entrega"
                                        className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                className="pl-11 h-12 rounded-xl bg-white/10 border-white/20 focus:ring-white/40 focus:bg-white/20 text-white placeholder:text-white/50 transition-all outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base tracking-tight shadow-lg bg-white text-primary-800 hover:bg-white/90 active:scale-[0.98] transition-all mt-2 border-none" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-primary-800" />
                            ) : (
                                isLogin ? "Iniciar Sesión" : "Crear mi Cuenta"
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                            }}
                            className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
                            disabled={loading}
                        >
                            {isLogin ? (
                                <>¿No tenés cuenta? <span className="text-white font-bold underline decoration-white/30 underline-offset-2">Registrate</span></>
                            ) : (
                                <>¿Ya tenés cuenta? <span className="text-white font-bold underline decoration-white/30 underline-offset-2">Iniciá sesión</span></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-8 px-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-transparent px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                            o también
                        </span>
                    </div>
                </div>

                {/* Guest button */}
                <button
                    type="button"
                    onClick={setAsGuest}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-white/90 hover:bg-white/20 hover:text-white transition-all group active:scale-[0.98]"
                >
                    Continuar como invitado
                    <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <p className="mt-12 text-center text-[10px] text-white/40 font-bold uppercase tracking-widest drop-shadow-sm">
                    © {new Date().getFullYear()} Caffres | Powered by Kioskito
                </p>
            </div>
        </div>
    )
}
