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
    const { originalTotal, promotionalTotal, appliedPromotions } = usePromotions(cart)

    return (
        <div className={`flex flex-col h-full ${!isDesktop ? "pb-24" : ""}`}>
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {isDesktop ? "Tu Pedido" : "Mi Pedido"}
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 lg:p-6">
                {cart.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium">Tu carrito esta vacio</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Agrega productos desde el menu
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div 
                                key={item.id} 
                                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                            >
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                    🍽️
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                                    <p className="text-sm font-semibold mt-0.5">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-4 lg:p-6 border-t border-border shrink-0 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${originalTotal.toFixed(2)}</span>
                        </div>

                        {appliedPromotions.length > 0 && (
                            <>
                                {appliedPromotions.map((promo, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex justify-between items-center text-sm text-green-600 dark:text-green-400"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px] font-semibold bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded">
                                                PROMO
                                            </span>
                                            <span className="truncate">{promo.nombre}</span>
                                        </span>
                                        <span>-${promo.descuento.toFixed(2)}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        <div className="h-px bg-border my-2" />

                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-semibold">
                                ${promotionalTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-11"
                        onClick={onCheckout}
                    >
                        Confirmar Pedido
                    </Button>
                </div>
            )}
        </div>
    )
}
