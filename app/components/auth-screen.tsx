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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-20">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Kioskito
                    </h1>
                    <p className="text-muted-foreground">
                        Tu comida favorita, a un tap
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">
                            {isLogin ? "Bienvenido" : "Crear cuenta"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isLogin
                                ? "Ingresa tus credenciales para continuar"
                                : "Completa tus datos para registrarte"
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg border border-destructive/20 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Nombre completo"
                                        className="pl-10 h-11"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="DNI"
                                        className="pl-10 h-11"
                                        value={dni}
                                        onChange={(e) => setDni(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Usuario o correo electrónico"
                                className="pl-10 h-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="tel"
                                        placeholder="Teléfono"
                                        className="pl-10 h-11"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Dirección"
                                        className="pl-10 h-11"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                className="pl-10 h-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                isLogin ? "Ingresar" : "Registrarme"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                            }}
                            className="font-medium text-primary hover:underline"
                            disabled={loading}
                        >
                            {isLogin ? "Crear una" : "Inicia sesión"}
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-3 text-xs text-muted-foreground uppercase">
                            o
                        </span>
                    </div>
                </div>

                {/* Guest button */}
                <Button
                    variant="outline"
                    className="w-full h-11"
                    type="button"
                    onClick={setAsGuest}
                    disabled={loading}
                >
                    Continuar como invitado
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
