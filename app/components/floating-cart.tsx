import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/lib/data"

interface FloatingCartProps {
    cart: CartItem[]
    total: number
    onCheckout: () => void
}

export function FloatingCart({ cart, total, onCheckout }: FloatingCartProps) {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    if (cart.length === 0) return null

    return (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 z-40">
            <div className="bg-card border border-border rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{itemCount} items</span>
                    </div>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <Button 
                    className="w-full h-10"
                    onClick={onCheckout}
                >
                    Ir a pagar
                </Button>
            </div>
        </div>
    )
}
