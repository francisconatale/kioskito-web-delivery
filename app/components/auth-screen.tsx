import { useState } from "react"
import { Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#106efd]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#40cfde]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#106efd] to-[#40cfde] rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-[#106efd]/20 transform hover:-translate-y-2 transition-transform duration-300">
                        <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#106efd] to-[#40cfde] bg-clip-text text-transparent mb-2">
                        Kioskito
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg">Tu comida favorita a un tap</p>
                </div>

                <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-8 text-foreground text-center">
                            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#106efd] transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-[#106efd]/20 focus-visible:border-[#106efd] transition-all text-base"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#106efd] transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-[#106efd]/20 focus-visible:border-[#106efd] transition-all text-base"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-[#106efd] to-[#40cfde] hover:from-[#005bf3] hover:to-[#2bc0cf] text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-[#106efd]/25 mt-2"
                            >
                                {isLogin ? "Ingresar" : "Registrarme"}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm font-medium">
                            <span className="text-muted-foreground">
                                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-[#106efd] font-extrabold hover:underline"
                            >
                                {isLogin ? "Crear una ahora" : "Inicia sesión"}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-10">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute border-t border-border w-full" />
                        <span className="bg-background px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground relative z-10">
                            o
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-14 mt-8 rounded-2xl border-border/80 bg-card hover:bg-muted text-base font-semibold transition-colors"
                        type="button"
                        onClick={onGuest}
                    >
                        Continuar como invitado
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
