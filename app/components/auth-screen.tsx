import { useState } from "react"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthScreenProps {
    onLogin: () => void
    onGuest: () => void
}

export function AuthScreen({ onLogin, onGuest }: AuthScreenProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onLogin()
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight mb-2">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Correo electronico"
                                className="pl-10 h-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="Contrasena"
                                className="pl-10 h-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-11">
                            {isLogin ? "Ingresar" : "Registrarme"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLogin ? "No tienes cuenta? " : "Ya tienes cuenta? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-medium hover:underline"
                        >
                            {isLogin ? "Crear una" : "Inicia sesion"}
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
                    onClick={onGuest}
                >
                    Continuar como invitado
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
