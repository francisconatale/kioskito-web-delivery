import { useState, useEffect } from "react"
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartItem } from "@/lib/data"
import { usePromotions } from "../hooks/use-promotions"
import { CheckoutFormData } from "@/hooks/use-checkout"
import { useAuth } from "@/hooks/use-auth"
import { addressService, Address } from "@/lib/address-service"
import { AddressSelection } from "./address-selection"

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
    const { user: authUser, authState } = useAuth()
    const { originalTotal, promotionalTotal, appliedPromotions, loading: loadingPromos } = usePromotions(cart)
    
    const [formData, setFormData] = useState<CheckoutFormData>({
        nombreCliente: authUser?.nombre || "",
        dniCliente: authUser?.dni || "",
        telefonoContacto: authUser?.telefono || "",
        direccionEntrega: authUser?.direccion || "",
        observaciones: ""
    })

    const [addresses, setAddresses] = useState<Address[]>([])
    const [loadingAddresses, setLoadingAddresses] = useState(false)
    const [isUsingNewAddress, setIsUsingNewAddress] = useState(false)

    useEffect(() => {
        const fetchAddresses = async () => {
            if (authState === "authenticated") {
                setLoadingAddresses(true)
                try {
                    const data = await addressService.getAddresses()
                    setAddresses(data)
                    // Si tiene direcciones, seleccionar la primera por defecto si no hay nada en formData
                    if (data.length > 0 && !formData.direccionEntrega) {
                        setFormData(prev => ({ ...prev, direccionEntrega: data[0].direccion }))
                    } else if (data.length === 0) {
                        setIsUsingNewAddress(true)
                    }
                } catch (error) {
                    console.error("Error fetching addresses:", error)
                } finally {
                    setLoadingAddresses(false)
                }
            } else {
                setIsUsingNewAddress(true)
            }
        }
        fetchAddresses()
    }, [authState])

    useEffect(() => {
        if (authState === "authenticated" && authUser) {
            setFormData(prev => ({
                ...prev,
                nombreCliente: prev.nombreCliente || authUser.nombre || "",
                dniCliente: prev.dniCliente || authUser.dni || "",
                telefonoContacto: prev.telefonoContacto || authUser.telefono || "",
                direccionEntrega: prev.direccionEntrega || authUser.direccion || "",
            }))
        }
    }, [authUser, authState])

    const isFormValid = formData.nombreCliente.trim() !== "" && formData.direccionEntrega.trim() !== ""

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-8 selection:bg-primary/20 animate-in fade-in duration-300">
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0 p-1">
                <div className="max-w-2xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 h-16">
                        <button 
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">Confirmar pedido</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8">
                {cart.length === 0 ? (
                    <div className="text-center py-24 bg-card rounded-3xl border border-border/50">
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-6">Tu carrito está vacío</p>
                        <Button variant="outline" className="rounded-xl px-8 h-12 font-semibold" onClick={onBack}>
                            Volver al menú
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Cart Summary */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-base px-1 flex items-center gap-2 text-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Revisá tu pedido
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {cart.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card group transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm text-foreground/90">{item.name}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                                                ${item.price.toFixed(2)} c/u
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 bg-muted/30 p-1 rounded-xl border border-border/30">
                                            <button
                                                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-card hover:text-destructive transition-all active:scale-95"
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                            >
                                                {item.quantity === 1 ? (
                                                    <Trash2 className="h-4 w-4" />
                                                ) : (
                                                    <Minus className="h-4 w-4" />
                                                )}
                                            </button>
                                            <span className="w-6 text-center text-sm font-bold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="w-24 text-right">
                                            <span className="font-bold text-foreground text-base">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-base px-1 flex items-center gap-2 text-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Datos de entrega
                            </h3>
                            <div className="grid grid-cols-1 gap-4 bg-card p-6 rounded-3xl border border-border/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre Completo *</label>
                                    <Input 
                                        placeholder="Nombre *" 
                                        value={formData.nombreCliente} 
                                        onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})} 
                                        className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                        required 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">DNI</label>
                                        <Input 
                                            placeholder="DNI" 
                                            value={formData.dniCliente} 
                                            onChange={(e) => setFormData({...formData, dniCliente: e.target.value})} 
                                            className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Teléfono</label>
                                        <Input 
                                            placeholder="Teléfono" 
                                            value={formData.telefonoContacto} 
                                            onChange={(e) => setFormData({...formData, telefonoContacto: e.target.value})} 
                                            className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Dirección de entrega *</label>
                                    
                                    {loadingAddresses ? (
                                        <div className="flex items-center justify-center p-8 bg-background rounded-xl border border-dashed border-border/50">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                                            <span className="text-sm text-muted-foreground">Cargando tus direcciones...</span>
                                        </div>
                                    ) : addresses.length > 0 ? (
                                        <div className="space-y-4">
                                            <AddressSelection 
                                                addresses={addresses}
                                                selectedAddress={formData.direccionEntrega}
                                                isUsingNew={isUsingNewAddress}
                                                onSelect={(dir) => {
                                                    setFormData({ ...formData, direccionEntrega: dir })
                                                    setIsUsingNewAddress(false)
                                                }}
                                                onUseNew={() => {
                                                    setIsUsingNewAddress(true)
                                                    setFormData({ ...formData, direccionEntrega: "" })
                                                }}
                                            />
                                            
                                            {isUsingNewAddress && (
                                                <div className="animate-in slide-in-from-top-2 duration-300">
                                                    <Input 
                                                        placeholder="Ingresá la dirección de entrega *" 
                                                        value={formData.direccionEntrega} 
                                                        onChange={(e) => setFormData({...formData, direccionEntrega: e.target.value})} 
                                                        className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                                        required 
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Input 
                                            placeholder="Dirección de entrega *" 
                                            value={formData.direccionEntrega} 
                                            onChange={(e) => setFormData({...formData, direccionEntrega: e.target.value})} 
                                            className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                            required 
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Observaciones</label>
                                    <Input 
                                        placeholder="Ej: Timbre B, dejar en portería..." 
                                        value={formData.observaciones} 
                                        onChange={(e) => setFormData({...formData, observaciones: e.target.value})} 
                                        className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20 italic text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="rounded-3xl border border-border/50 bg-card overflow-hidden shadow-sm">
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">Subtotal Productos</span>
                                    <span className="text-foreground">${originalTotal.toFixed(2)}</span>
                                </div>

                                {appliedPromotions.map((promo, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex justify-between text-sm font-semibold text-green-600 bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-green-500" />
                                            {promo.nombre}
                                        </span>
                                        <span>-${promo.descuento.toFixed(2)}</span>
                                    </div>
                                ))}

                                <div className="h-px bg-border/50 my-2" />

                                <div className="flex justify-between items-end pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total a pagar</span>
                                        <span className="font-bold text-2xl tracking-tight text-primary mt-1">
                                            ${promotionalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-muted-foreground/60 italic">IVA incluido</div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-[10px] font-semibold uppercase tracking-wider border border-destructive/20 text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 mt-4 rounded-2xl font-bold text-base instrument tracking-tight shadow-xl shadow-primary/10 active:shadow-none hover:scale-[1.01] transition-transform"
                            onClick={() => onConfirm(formData)}
                            disabled={!isFormValid || isSubmitting || loadingPromos}
                        >
                            {isSubmitting || loadingPromos ? (
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    {loadingPromos ? "Calculando promociones..." : "Procesando pedido..."}
                                </div>
                            ) : "Confirmar mi Pedido"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
