import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/lib/data"

interface FloatingCartProps {
    cart: CartItem[]
    total: number
    onCheckout: () => void
    loading?: boolean
}

export function FloatingCart({ cart, total, onCheckout, loading }: FloatingCartProps) {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (cart.length === 0) return null

    return (
        <div className="fixed bottom-24 lg:bottom-10 left-4 right-4 lg:left-auto lg:right-10 lg:w-80 z-40 animate-in slide-in-from-bottom-8 duration-500">
            <div className="glass border-border/40 rounded-[2rem] shadow-2xl shadow-primary/20 overflow-hidden group">
                <div className="bg-card/50 p-6 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Tu Selección</span>
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-semibold text-foreground/80">{itemCount} productos</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">Total a Pagar</span>
                            <div className="text-xl font-bold tracking-tight text-primary min-w-[80px]">
                                {loading ? (
                                    <div className="h-6 w-full bg-primary/10 animate-pulse rounded-lg" />
                                ) : (
                                    `$${total.toFixed(2)}`
                                )}
                            </div>
                        </div>
                    </div>
                    <Button 
                        className="w-full h-12 rounded-2xl font-bold text-base tracking-tight shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
                        onClick={onCheckout}
                    >
                        Confirmar Pedido
                    </Button>
                </div>
            </div>
        </div>
    )
}
