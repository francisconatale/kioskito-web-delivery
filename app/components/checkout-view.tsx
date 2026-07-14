import { useState, useEffect } from "react"
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartItem } from "@/lib/data"
import { usePromotions } from "../hooks/use-promotions"
import { CheckoutFormData } from "@/hooks/use-checkout"
import { useAuth } from "@/hooks/use-auth"
import { useAddress } from "@/hooks/use-address"
import { addressService, Address } from "@/lib/address-service"
import { AddressSelection } from "./address-selection"
import { useHorarios } from "@/hooks/use-horarios"

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
    const { activeAddress, setActiveAddress } = useAddress()
    const { originalTotal, promotionalTotal, appliedPromotions, loading: loadingPromos } = usePromotions(cart)
    const { isAbierto, loading: isHorariosLoading } = useHorarios(1)
    
    const [step, setStep] = useState(1)
    
    const [formData, setFormData] = useState<CheckoutFormData>({
        nombreCliente: authUser?.nombre || "",
        dniCliente: authUser?.dni || "",
        telefonoContacto: authUser?.telefono || "",
        direccionEntrega: activeAddress || authUser?.direccion || "",
        observaciones: "",
        metodoPago: ""
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

    // Resolve which address should be the default, reacting to authUser and addresses changes
    useEffect(() => {
        if (authState === "authenticated") {
            setFormData(prev => {
                // Determine the correct address to use. Global activeAddress takes precedence on load.
                // If it's not set, fallback to previous state, auth user address, principal address, or first available.
                let defaultDir = activeAddress 
                    || prev.direccionEntrega 
                    || authUser?.direccion 
                    || addresses.find(a => a.esPrincipal)?.direccion 
                    || (addresses.length > 0 ? addresses[0].direccion : "");

                // If still empty and no addresses, user needs a new one
                if (!defaultDir && addresses.length === 0) {
                    setIsUsingNewAddress(true);
                } else if (defaultDir && activeAddress && prev.direccionEntrega !== activeAddress) {
                    // Only update the "isUsingNewAddress" state if we are explicitly injecting a new active address
                    setIsUsingNewAddress(false);
                }

                return {
                    ...prev,
                    nombreCliente: prev.nombreCliente || authUser?.nombre || "",
                    dniCliente: prev.dniCliente || authUser?.dni || "",
                    telefonoContacto: prev.telefonoContacto || authUser?.telefono || "",
                    direccionEntrega: defaultDir,
                };
            })
        }
    }, [authUser, authState, addresses, activeAddress])

    const isStep2Valid = formData.nombreCliente.trim() !== "" && formData.direccionEntrega.trim() !== ""
    const isFormValid = isStep2Valid && formData.metodoPago !== ""

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-32 lg:pb-8 selection:bg-primary/20 animate-in fade-in duration-300">
                <header className="sticky top-0 z-20 glass border-x-0 border-t-0 p-1">
                    <div className="max-w-2xl mx-auto px-4 lg:px-6">
                        <div className="flex items-center gap-3 h-16">
                            <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-lg font-bold tracking-tight">Checkout</h1>
                        </div>
                    </div>
                </header>
                <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8">
                    <div className="text-center py-24 bg-card rounded-3xl border border-border/50 shadow-sm">
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-6">Tu carrito está vacío</p>
                        <Button variant="outline" className="rounded-xl px-8 h-12 font-semibold" onClick={onBack}>
                            Volver al menú
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen text-foreground font-sans pb-32 lg:pb-12 animate-in fade-in duration-300">
            <header className="border-b border-border/50 p-4 flex items-center justify-center relative sticky top-0 glass z-20">
                <button 
                    onClick={onBack}
                    className="absolute left-4 p-2 rounded-full hover:bg-muted transition-colors text-primary"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-semibold text-sm tracking-widest uppercase text-muted-foreground">Checkout Seguro</h1>
            </header>

            <div className="max-w-2xl mx-auto p-4 lg:py-12 space-y-6">
                
                {/* Step 1: Revisá tu pedido */}
                <div className={`border ${step === 1 ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/50'} rounded-2xl overflow-hidden transition-all bg-card`}>
                    <button 
                        onClick={() => setStep(1)} 
                        className="w-full flex justify-between items-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                    >
                        <h2 className="font-bold text-lg flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">1</span>
                            Revisá tu pedido
                        </h2>
                        {step > 1 && <Check className="text-primary h-5 w-5" />}
                    </button>
                    
                    {step === 1 && (
                        <div className="p-6 space-y-4 animate-in slide-in-from-top-2">
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-border/50 pb-4">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">${item.price.toFixed(2)} c/u</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/30">
                                                <button
                                                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-background hover:text-destructive transition-all"
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                >
                                                    {item.quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                                </button>
                                                <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                                                <button
                                                    className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm"
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-sm w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal Productos</span>
                                    <span>${originalTotal.toFixed(2)}</span>
                                </div>
                                {appliedPromotions.map((promo, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-success-600 dark:text-success-500 font-medium">
                                        <span>{promo.nombre}</span>
                                        <span>-${promo.descuento.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold text-xl pt-2 border-t border-border/50">
                                    <span>Total</span>
                                    <span>${promotionalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <Button 
                                className="w-full h-12 mt-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                                onClick={() => setStep(2)}
                            >
                                Continuar
                            </Button>
                        </div>
                    )}
                </div>

                {/* Step 2: Datos de entrega */}
                <div className={`border ${step === 2 ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/50'} rounded-2xl overflow-hidden transition-all bg-card`}>
                    <button 
                        onClick={() => setStep(2)} 
                        className="w-full flex justify-between items-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                        disabled={step < 2}
                    >
                        <h2 className={`font-bold text-lg flex items-center gap-3 ${step < 2 ? 'text-muted-foreground' : ''}`}>
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">2</span>
                            Datos de entrega
                        </h2>
                        {step > 2 && <Check className="text-primary h-5 w-5" />}
                    </button>
                    
                    {step === 2 && (
                        <div className="p-6 space-y-5 animate-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre Completo *</label>
                                <Input 
                                    placeholder="Nombre *" 
                                    value={formData.nombreCliente} 
                                    onChange={(e) => setFormData({...formData, nombreCliente: e.target.value})} 
                                    className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                />
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
                                                setActiveAddress(dir)
                                            }}
                                            onUseNew={() => {
                                                setIsUsingNewAddress(true)
                                                setFormData({ ...formData, direccionEntrega: "" })
                                                setActiveAddress(undefined)
                                            }}
                                        />
                                        
                                        {isUsingNewAddress && (
                                            <div className="animate-in slide-in-from-top-2 duration-300">
                                                <Input 
                                                    placeholder="Ingresá la dirección de entrega *" 
                                                    value={formData.direccionEntrega} 
                                                    onChange={(e) => setFormData({...formData, direccionEntrega: e.target.value})} 
                                                    className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
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
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Teléfono</label>
                                    <Input 
                                        placeholder="Teléfono" 
                                        value={formData.telefonoContacto} 
                                        onChange={(e) => setFormData({...formData, telefonoContacto: e.target.value})} 
                                        className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">DNI</label>
                                    <Input 
                                        placeholder="DNI" 
                                        value={formData.dniCliente} 
                                        onChange={(e) => setFormData({...formData, dniCliente: e.target.value})} 
                                        className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                                    />
                                </div>
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

                            <Button 
                                className="w-full h-12 mt-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                                onClick={() => setStep(3)}
                                disabled={!isStep2Valid}
                            >
                                Continuar
                            </Button>
                        </div>
                    )}
                </div>

                {/* Step 3: Pago y Confirmación */}
                <div className={`border ${step === 3 ? 'border-primary shadow-lg shadow-primary/5' : 'border-border/50'} rounded-2xl overflow-hidden transition-all bg-card`}>
                    <button 
                        className="w-full flex justify-between items-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                        disabled={step < 3}
                        onClick={() => setStep(3)}
                    >
                        <h2 className={`font-bold text-lg flex items-center gap-3 ${step < 3 ? 'text-muted-foreground' : ''}`}>
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">3</span>
                            Pago y Confirmación
                        </h2>
                    </button>
                    
                    {step === 3 && (
                        <div className="p-6 space-y-4 animate-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Método de Pago *</label>
                                <select 
                                    value={formData.metodoPago} 
                                    onChange={(e) => setFormData({...formData, metodoPago: e.target.value})} 
                                    className="flex h-12 w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                                >
                                    <option value="" disabled>Seleccioná un método de pago</option>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="DEBITO">Débito</option>
                                    <option value="CREDITO">Crédito</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="FIADO">Fiado</option>
                                    <option value="MIXTO">Mixto</option>
                                </select>
                            </div>

                            {error && (
                                <div className="p-4 bg-destructive/5 text-destructive rounded-xl text-[10px] font-semibold uppercase tracking-wider border border-destructive/20 text-center animate-shake mt-4">
                                    {error}
                                </div>
                            )}

                            {!isAbierto && !isHorariosLoading && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[12px] font-semibold text-center mt-4">
                                    El delivery se encuentra cerrado en este momento.
                                </div>
                            )}

                            <Button 
                                className="w-full h-14 mt-6 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 active:shadow-none hover:scale-[1.01] transition-transform"
                                onClick={() => onConfirm(formData)}
                                disabled={!isFormValid || isSubmitting || loadingPromos || !isAbierto}
                            >
                                {isSubmitting || loadingPromos ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        {loadingPromos ? "Calculando promociones..." : "Procesando pedido..."}
                                    </div>
                                ) : (
                                    `Confirmar pedido - $${promotionalTotal.toFixed(2)}`
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
