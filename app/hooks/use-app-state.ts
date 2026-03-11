import { useState } from "react"
import { CartItem, Product } from "@/lib/data"

export function useAppState() {
    const [activeTab, setActiveTab] = useState("inicio")
    const [cart, setCart] = useState<CartItem[]>([])

    const handleAddToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { id: product.id, name: product.nombre, price: product.precioVenta, quantity: 1 }]
        })
    }

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + delta
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
                    }
                    return item
                })
                .filter((item): item is CartItem => item !== null)
        })
    }

    const handleCheckout = () => {
        // El CheckoutView ya maneja el aviso de exito, aqui solo limpiamos el carrito
        setCart([])
        setActiveTab("inicio")
    }

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return {
        activeTab,
        setActiveTab,
        cart,
        cartCount,
        handleAddToCart,
        handleUpdateQuantity,
        handleCheckout
    }
}


