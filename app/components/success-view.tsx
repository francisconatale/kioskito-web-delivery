"use client"

import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessViewProps {
    onBackToHome: () => void
    onViewOrders: () => void
}

export function SuccessView({ onBackToHome, onViewOrders }: SuccessViewProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-500">
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative h-24 w-24 bg-card rounded-full border-2 border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/20">
                        <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in spin-in-90 duration-700" />
                    </div>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-foreground mb-3 instrument">
                    ¡Pedido Confirmado!
                </h1>
                
                <p className="text-muted-foreground max-w-[280px] mx-auto text-sm font-medium leading-relaxed">
                    Tu pedido ha sido recibido con éxito y ya estamos trabajando en él.
                </p>

                <div className="mt-12 w-full max-w-sm space-y-3">
                    <Button 
                        onClick={onViewOrders}
                        className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        Ver mis pedidos
                    </Button>
                    
                    <Button 
                        variant="ghost"
                        onClick={onBackToHome}
                        className="w-full h-14 rounded-2xl font-bold text-muted-foreground hover:text-foreground active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Volver al inicio
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <footer className="p-8 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                    Gracias por confiar en nosotros • Powered by Kioskito
                </p>
            </footer>
        </div>
    )
}
