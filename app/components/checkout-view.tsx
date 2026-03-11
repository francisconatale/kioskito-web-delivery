import { useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartItem } from "@/lib/data"
import { usePromotions } from "../hooks/use-promotions"
import { CheckoutFormData } from "@/hooks/use-checkout"

interface CheckoutViewProps {
    cart: CartItem[]
    onUpdateQuantity: (id: number, delta: number) => void
    onConfirm: (data: CheckoutFormData) => void
    onBack: () => void
    isSubmitting: boolean
    error: string | null
}

export function CheckoutView({ 
    cart, 
    onUpdateQuantity, 
    onConfirm, 
    onBack,
    isSubmitting,
    error
}: CheckoutViewProps) {
    const { originalTotal, promotionalTotal, appliedPromotions } = usePromotions(cart)
    
    const [formData, setFormData] = useState<CheckoutFormData>({
        nombreCliente: "",
        dniCliente: "",
        telefonoContacto: "",
        direccionEntrega: "",
        observaciones: ""
    })

    const isFormValid = formData.nombreCliente.trim() !== "" && formData.direccionEntrega.trim() !== ""

    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 h-14">
                        <button 
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="font-semibold">Confirmar pedido</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-sm">Tu carrito esta vacio</p>
                        <Button variant="outline" className="mt-4" onClick={onBack}>
                            Volver al menu
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            {cart.map((item) => (
                                <div 
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            ${item.price.toFixed(2)} c/u
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                        >
                                            {item.quantity === 1 ? (
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            ) : (
                                                <Minus className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <div className="w-20 text-right">
                                        <span className="font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-6">
                            <h3 className="font-semibold px-1">Datos de entrega</h3>
                            <Input placeholder="Nombre *" value={formData.nombreCliente} onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})} required />
                            <Input placeholder="DNI" value={formData.dniCliente} onChange={(e) => setFormData({...formData, dniCliente: e.target.value})} />
                            <Input placeholder="Teléfono" value={formData.telefonoContacto} onChange={(e) => setFormData({...formData, telefonoContacto: e.target.value})} />
                            <Input placeholder="Dirección de entrega *" value={formData.direccionEntrega} onChange={(e) => setFormData({...formData, direccionEntrega: e.target.value})} required />
                            <Input placeholder="Observaciones (ej. timbre, sin cebolla...)" value={formData.observaciones} onChange={(e) => setFormData({...formData, observaciones: e.target.value})} />
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${originalTotal.toFixed(2)}</span>
                            </div>

                            {appliedPromotions.map((promo, idx) => (
                                <div 
                                    key={idx}
                                    className="flex justify-between text-sm text-green-600"
                                >
                                    <span>{promo.nombre}</span>
                                    <span>-${promo.descuento.toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="h-px bg-border" />

                            <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="text-lg font-semibold">
                                    ${promotionalTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 mt-6"
                            onClick={() => onConfirm(formData)}
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? "Procesando..." : "Confirmar y pagar"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
