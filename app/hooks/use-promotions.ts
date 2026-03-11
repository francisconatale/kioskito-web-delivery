import { useState, useEffect } from "react"
import { CartItem } from "@/lib/data"
import { apiClient } from "@/lib/api-client"

export interface AppliedPromotion {
    nombre: string
    descuento: number
}

export interface PromotionState {
    originalTotal: number
    promotionalTotal: number
    savings: number
    appliedPromotions: AppliedPromotion[]
    loading: boolean
    error: string | null
}

export function usePromotions(cart: CartItem[]) {
    const [state, setState] = useState<PromotionState>({
        originalTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        promotionalTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        savings: 0,
        appliedPromotions: [],
        loading: false,
        error: null
    })

    useEffect(() => {
        const simulatePromotions = async () => {
            if (cart.length === 0) {
                setState({
                    originalTotal: 0,
                    promotionalTotal: 0,
                    savings: 0,
                    appliedPromotions: [],
                    loading: false,
                    error: null
                })
                return
            }

            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                // Map UI cart to backend SimularPromocionesRequest format
                const items = cart.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity,
                    precioUnitario: item.price
                }))

                const { data } = await apiClient.post<any>("/promociones/simular", { items }, {
                    params: { negocioId: 1 }
                })

                if (data) {
                    // Group promotions by name to avoid duplicate lines for the same promo (e.g. combos)
                    const groupedPromos = (data.detalles || [])
                        .filter((d: any) => d.descuento > 0)
                        .reduce((acc: Record<string, number>, curr: any) => {
                            const name = curr.nombrePromocion || "Descuento aplicado"
                            acc[name] = (acc[name] || 0) + curr.descuento
                            return acc
                        }, {})

                    setState({
                        originalTotal: data.totalOriginal || 0,
                        promotionalTotal: data.totalFinal || 0,
                        savings: data.totalDescuento || 0,
                        appliedPromotions: Object.entries(groupedPromos).map(([nombre, descuento]) => ({
                            nombre,
                            descuento: descuento as number
                        })),
                        loading: false,
                        error: null
                    })
                }
            } catch (err: any) {
                console.error("Error simulating promotions:", err)
                setState(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: "No se pudieron calcular las promociones" 
                }))
            }
        }

        // Debounce calculation to avoid excessive API calls
        const timer = setTimeout(() => {
            simulatePromotions()
        }, 500)

        return () => clearTimeout(timer)
    }, [cart])

    return state
}
