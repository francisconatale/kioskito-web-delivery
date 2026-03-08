import { CartItem } from "@/lib/data"

export function calculatePromotions(cart: CartItem[]) {
    const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    let savings = 0
    const appliedPromotions: { nombre: string; descuento: number }[] = []

    // Promo 1: 2x1 en Bowl de Salmón (id: 4)
    const bowlSalmon = cart.find(item => item.id === 4)
    if (bowlSalmon && bowlSalmon.quantity >= 2) {
        const freeCount = Math.floor(bowlSalmon.quantity / 2)
        const discount = freeCount * bowlSalmon.price
        savings += discount
        appliedPromotions.push({ nombre: "2x1 en Bowl de Salmón", descuento: discount })
    }

    // Promo 2: Combo (Bowl de Proteína id: 1 + Smoothie Verde id: 2) -> $15 total (normal is 12.99 + 6.99 = 19.98, discount = 4.98)
    const bowlProteina = cart.find(item => item.id === 1)
    const smoothie = cart.find(item => item.id === 2)
    if (bowlProteina && smoothie && bowlProteina.quantity > 0 && smoothie.quantity > 0) {
        const combos = Math.min(bowlProteina.quantity, smoothie.quantity)
        const discount = combos * 4.98
        savings += discount
        appliedPromotions.push({ nombre: "Combo Proteína + Smoothie", descuento: discount })
    }

    const promotionalTotal = Math.max(0, originalTotal - savings)

    return {
        originalTotal,
        savings,
        promotionalTotal,
        appliedPromotions
    }
}

export function usePromotions(cart: CartItem[]) {
    // En este caso es sincrono, pero devolvemos como hook por si a futuro mockeamos un timer
    return calculatePromotions(cart)
}
