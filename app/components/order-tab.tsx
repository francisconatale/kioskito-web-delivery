import { ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/lib/data"
import { usePromotions } from "../hooks/use-promotions"

interface OrderTabProps {
    cart: CartItem[]
    onUpdateQuantity: (id: number, delta: number) => void
    onCheckout: () => void
    isDesktop?: boolean
}

export function OrderTab({
    cart,
    onUpdateQuantity,
    onCheckout,
    isDesktop = false
}: OrderTabProps) {
    const { originalTotal, promotionalTotal, appliedPromotions, loading } = usePromotions(cart)

    return (
        <div className={`flex flex-col h-full bg-background/50 selection:bg-primary/20 animate-in fade-in duration-300 ${!isDesktop ? "pb-32" : ""}`}>
            {/* Header */}
            <div className={`h-16 flex items-center px-6 border-b border-border/50 shrink-0 glass z-10 sticky top-0`}>
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    {isDesktop ? "Tu Pedido" : "Mi Pedido"}
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 lg:p-6 custom-scrollbar">
                {cart.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full opacity-60">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-muted/50 flex items-center justify-center mb-6 rotate-3">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-base font-bold tracking-tight">Tu carrito está vacío</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                            Agregá productos desde el menú
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card group transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                    🍽️
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-sm text-foreground/90 truncate group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="font-bold text-xs mt-1 text-foreground/80">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 bg-muted/30 p-1 rounded-xl border border-border/30">
                                    <button
                                        className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-card transition-all active:scale-90"
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-bold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm active:scale-90"
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-6 border-t border-border/50 glass shrink-0 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground italic">Subtotal</span>
                            <span className="font-semibold">${originalTotal.toFixed(2)}</span>
                        </div>

                        {appliedPromotions.length > 0 && (
                            <div className="space-y-2">
                                {appliedPromotions.map((promo, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex justify-between items-center text-xs font-semibold text-green-600 bg-green-500/5 px-3 py-2 rounded-xl border border-green-500/10"
                                    >
                                        <span className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="truncate">{promo.nombre}</span>
                                        </span>
                                        <span>-${promo.descuento.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-px bg-border/50 my-1" />

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Total Final</span>
                                <span className="text-2xl font-bold tracking-tighter text-primary">
                                    ${promotionalTotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="text-[10px] font-semibold text-muted-foreground/30 italic pb-1">IVA incluido</div>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 rounded-2xl font-bold text-base tracking-tight shadow-xl shadow-primary/10 active:scale-[0.98] transition-all hover:shadow-primary/20"
                        onClick={onCheckout}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Calculando...
                            </div>
                        ) : "Confirmar mi Pedido"}
                    </Button>
                </div>
            )}
        </div>
    )
}
