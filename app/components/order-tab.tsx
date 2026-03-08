import { ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
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
            {!isDesktop && (
                <div className="bg-gradient-to-br from-[#106efd] to-[#40cfde] px-4 pt-4 pb-6 rounded-b-[2rem] shadow-sm shrink-0">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        <h1 className="text-xl font-bold text-white">Mi Pedido</h1>
                        <ThemeToggle variant="header" />
                    </div>
                </div>
            )}

            {isDesktop && (
                <div className="p-6 pb-2 border-b border-border shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#106efd]" />
                        Tu Pedido
                    </h2>
                </div>
            )}

            <div className={`flex-grow overflow-y-auto ${!isDesktop ? "px-4 mt-5" : "px-6 py-4"}`}>
                {cart.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                        <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <p className="text-foreground font-semibold text-lg">Tu carrito está vacío</p>
                        <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">Agrega deliciosos platillos desde nuestro menú para comenzar</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <Card key={item.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card rounded-2xl overflow-hidden group">
                                <CardContent className="p-4 flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-muted rounded-xl shrink-0 overflow-hidden relative">
                                        {/* Placeholder content if no image is stored in cart */}
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">🍽️</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-foreground text-sm line-clamp-1">{item.name}</h3>
                                        <p className="text-[#106efd] font-black mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-full border border-border/50 shrink-0">
                                        <button
                                            className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm hover:bg-destructive hover:text-white transition-colors"
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-5 text-center font-bold text-foreground text-sm">{item.quantity}</span>
                                        <button
                                            className="h-8 w-8 rounded-full bg-[#106efd] flex items-center justify-center text-white shadow-sm hover:bg-[#40cfde] transition-colors"
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <div className={`shrink-0 ${!isDesktop ? "px-4 mt-6" : "px-6 py-6 bg-muted/20 border-t border-border"}`}>
                    <div className="p-5 bg-card border border-border/50 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-muted-foreground font-medium text-sm">Subtotal</span>
                            <span className="font-semibold text-foreground">${originalTotal.toFixed(2)}</span>
                        </div>

                        {appliedPromotions.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {appliedPromotions.map((promo, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-green-600 dark:text-green-400">
                                        <span className="text-sm font-semibold flex items-center gap-2">
                                            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[9px] px-2 py-0.5 rounded-md uppercase font-black tracking-wider">Promo</span>
                                            <span className="line-clamp-1">{promo.nombre}</span>
                                        </span>
                                        <span className="font-bold">-${promo.descuento.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-px w-full bg-border/80 my-4" />

                        <div className="flex justify-between items-end mb-5">
                            <span className="text-lg font-bold text-foreground">Total Final</span>
                            <div className="text-right">
                                <span className="text-3xl font-black text-[#106efd]">${promotionalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#106efd] to-[#40cfde] hover:from-[#40cfde] hover:to-[#106efd] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                            onClick={onCheckout}
                        >
                            Confirmar Pedido
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
