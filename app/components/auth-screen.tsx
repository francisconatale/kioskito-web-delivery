import { useState } from "react"
import { Mail, Lock, ArrowRight, User, Fingerprint, MapPin, Phone, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

export function AuthScreen() {
    const { login, register, setAsGuest } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

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
        <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-primary-200/40 font-sans">
            {/* Left Panel - Brand */}
            <div className="lg:w-[480px] bg-gradient-to-br from-primary-900 via-primary-700 to-blue-800 p-8 lg:p-12 flex flex-col relative overflow-hidden min-h-[35vh] lg:min-h-screen">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/3 -left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-12">
                        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                            Caffres
                        </h1>
                        <p className="text-blue-100/70 text-sm font-medium mt-1.5 max-w-xs leading-relaxed">
                            Hacé tu pedido en segundos y recibilo donde quieras.
                        </p>
                    </div>

                    <div className="hidden lg:block mt-auto">
                        <div className="border-t border-white/15 pt-6">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                            </div>
                            <p className="text-blue-100/50 text-xs font-medium mt-4">
                                Delivery rápido y seguro • Horarios flexibles
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-neutral-50 to-white">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 mb-2">
                            {isLogin ? "Acceso" : "Registro"}
                        </p>
                        <h2 className="font-display text-2xl font-bold text-neutral-900 tracking-tight">
                            {isLogin ? "Bienvenido de nuevo" : "Unite a Caffres"}
                        </h2>
                        <p className="text-neutral-500 text-sm font-medium mt-1.5">
                            {isLogin
                                ? "Ingresá tus datos para continuar con tu pedido."
                                : "Completá tus datos y empezá a pedir."
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {!isLogin && (
                            <div className="space-y-3.5">
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre completo"
                                        className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        type="text"
                                        placeholder="DNI"
                                        className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Usuario o email"
                                className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-3.5">
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        type="tel"
                                        placeholder="Teléfono"
                                        className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        type="text"
                                        placeholder="Dirección de entrega"
                                        className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                className="pl-10 h-12 rounded-xl border-neutral-200 bg-white focus:border-primary-500/50 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary-500/15 bg-primary-700 hover:bg-primary-800 text-white active:scale-[0.98] transition-all mt-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                isLogin ? "Iniciar Sesión" : "Crear mi Cuenta"
                            )}
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                            }}
                            className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
                            disabled={loading}
                        >
                            {isLogin ? (
                                <>¿No tenés cuenta? <span className="text-primary-700 font-bold hover:underline underline-offset-2">Registrate</span></>
                            ) : (
                                <>¿Ya tenés cuenta? <span className="text-primary-700 font-bold hover:underline underline-offset-2">Iniciá sesión</span></>
                            )}
                        </button>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                                o continuá como
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={setAsGuest}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2.5 h-12 rounded-xl border-2 border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-primary-500/30 hover:text-primary-700 hover:bg-primary-50/50 transition-all group active:scale-[0.98]"
                    >
                        Invitado
                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <p className="mt-10 text-center text-[9px] text-neutral-300 font-bold uppercase tracking-[0.25em]">
                        © {new Date().getFullYear()} Caffres · Powered by Kioskito
                    </p>
                </div>
            </div>
        </div>
    )
}
