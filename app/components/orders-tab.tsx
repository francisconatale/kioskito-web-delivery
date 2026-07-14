import { NEGOCIO_ID } from '@/lib/config';
import { ClipboardList, Clock, CheckCircle, RotateCw, ArrowLeft, MapPin, Phone, MessageSquare, Package, ChevronLeft, ChevronRight, Pencil, XCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react"
import { useOrders, Order } from "../../hooks/use-orders"
import { useCancelOrder } from "../../hooks/use-cancel-order"
import { useEditOrder, EditOrderItem } from "../../hooks/use-edit-order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useProducts } from "../../hooks/use-products"
import { useActivePromotions } from "../../hooks/use-active-promotions"
import { Search } from "lucide-react"

const ESTADO_BADGE: Record<Order["estado"], { bg: string; text: string; label: string }> = {
    PENDIENTE: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600", label: "Pendiente" },
    EN_PREPARACION: { bg: "bg-primary/10 border-primary/20", text: "text-primary", label: "En Preparación" },
    EN_CAMINO: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-600", label: "En Camino" },
    ENTREGADO: { bg: "bg-success-500/10 border-success-500/20", text: "text-success-500", label: "Completado" },
    CANCELADO: { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", label: "Cancelado" },
}

const CAN_EDIT_STATES: Order["estado"][] = ["PENDIENTE", "EN_PREPARACION"]
const CAN_CANCEL_STATES: Order["estado"][] = ["PENDIENTE", "EN_PREPARACION"]

function EstadoBadge({ estado }: { estado: Order["estado"] }) {
    const config = ESTADO_BADGE[estado]
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
            config.bg,
            config.text
        )}>
            {estado === "ENTREGADO" && <CheckCircle className="h-3 w-3" />}
            {estado === "CANCELADO" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            {(estado === "PENDIENTE" || estado === "EN_PREPARACION" || estado === "EN_CAMINO") && (
                <Clock className="h-3 w-3" />
            )}
            {config.label}
        </span>
    )
}

interface EditOrderViewProps {
    order: Order
    onBack: () => void
    onSaved: () => void
}

interface DisplayItem {
    productoId: number;
    cantidad: number;
    productoNombre: string;
    precioUnitario: number;
}

function EditOrderView({ order, onBack, onSaved }: EditOrderViewProps) {
    const { editOrder, loading, error } = useEditOrder()

    const [items, setItems] = useState<DisplayItem[]>(
        order.detalles.map(d => ({ 
            productoId: d.productoId, 
            cantidad: d.cantidad,
            productoNombre: d.productoNombre,
            precioUnitario: d.precioUnitario
        }))
    )
    const [metodoPago, setMetodoPago] = useState(order.direccionEntrega ? "EFECTIVO" : "")
    const [direccionEntrega, setDireccionEntrega] = useState(order.direccionEntrega)
    const [telefonoContacto, setTelefonoContacto] = useState(order.telefonoContacto)
    const [observaciones, setObservaciones] = useState(order.observaciones || "")
    
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { products, loading: productsLoading } = useProducts({ searchQuery, size: 20 })
    const { promotions } = useActivePromotions()

    const getPromoForProduct = (productId: number, productPrice: number) => {
        const promo = promotions.find(promo => {
            const isBundle = (promo.productos && (promo.productos.length > 1 || (promo.productos[0] && promo.productos[0].quantity > 1))) || 
                             (promo.productoIds && promo.productoIds.length > 1);
            if (isBundle) return false;
            return promo.productos?.some((p: any) => p.product?.id === productId) ||
                   promo.productoIds?.includes(productId);
        });
        if (!promo) return undefined;

        let calculatedPrice = promo.precioPromocional;
        if (promo.tipo === 'DESCUENTO_PORCENTAJE') {
            calculatedPrice = productPrice * (1 - promo.valor / 100);
        } else if (promo.tipo === 'DESCUENTO_FIJO') {
            calculatedPrice = Math.max(0, productPrice - promo.valor);
        } else if (promo.tipo === 'PRECIO_FIJO') {
            calculatedPrice = promo.valor;
        }

        return { ...promo, precioPromocional: calculatedPrice };
    };

    const updateItemCantidad = (productoId: number, delta: number) => {
        setItems(prev => {
            const existing = prev.find(i => i.productoId === productoId)
            if (existing) {
                const newCantidad = existing.cantidad + delta
                if (newCantidad <= 0) {
                    return prev.filter(i => i.productoId !== productoId)
                }
                return prev.map(i => i.productoId === productoId ? { ...i, cantidad: newCantidad } : i)
            }
            return prev
        })
    }

    const handleSubmit = async () => {
        try {
            await editOrder(order.id, {
                negocioId: NEGOCIO_ID,
                items: items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
                metodoPago,
                direccionEntrega,
                telefonoContacto,
                observaciones,
            })
            onSaved()
        } catch (err) {
            // Error is handled by the hook
        }
    }

    const hasChanges = JSON.stringify(items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad }))) !== JSON.stringify(order.detalles.map(d => ({ productoId: d.productoId, cantidad: d.cantidad })))
        || direccionEntrega !== order.direccionEntrega
        || observaciones !== (order.observaciones || "")

    return (
        <div className="pb-24 lg:pb-8 animate-in fade-in duration-300">
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0 lg:hidden">
                <div className="max-w-2xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 h-16">
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="font-bold text-xl">Editar Pedido #{order.id}</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8 space-y-6">
                {error && (
                    <div className="p-4 bg-destructive/5 text-destructive rounded-xl text-sm font-semibold border border-destructive/20 text-center animate-shake">
                        {error}
                    </div>
                )}

                {/* Items */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm">
                    <div className="p-5 border-b border-border/50 flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <h2 className="font-bold text-base">Productos</h2>
                    </div>
                    <div className="divide-y divide-border/30">
                        {items.map((item) => {
                            const cantidad = item.cantidad
                            return (
                                <div key={item.productoId} className="p-4 flex justify-between items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-foreground/90 truncate">{item.productoNombre}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                            ${item.precioUnitario.toFixed(2)} c/u
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/30">
                                        <button
                                            className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-background hover:text-destructive transition-all"
                                            onClick={() => updateItemCantidad(item.productoId, -1)}
                                        >
                                            {cantidad === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                        </button>
                                        <span className="w-4 text-center text-xs font-bold">{cantidad}</span>
                                        <button
                                            className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm"
                                            onClick={() => updateItemCantidad(item.productoId, 1)}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-sm w-16 text-right">
                                        ${(item.precioUnitario * cantidad).toFixed(2)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-center rounded-b-2xl">
                        <Sheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full gap-2 rounded-xl border-dashed border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all h-12">
                                    <Plus className="h-4 w-4" /> Agregar Producto al Pedido
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl sm:max-w-md mx-auto flex flex-col p-0">
                                <SheetHeader className="p-4 border-b">
                                    <SheetTitle>Buscar producto</SheetTitle>
                                    <div className="relative mt-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Ej: Alfajor, Coca Cola..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-primary/20"
                                        />
                                    </div>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {productsLoading && products.length === 0 ? (
                                        <div className="flex justify-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p className="text-sm font-semibold">No se encontraron productos</p>
                                        </div>
                                    ) : (
                                        products.map((p) => {
                                            const promo = getPromoForProduct(p.id, p.precioVenta)
                                            const finalPrice = promo ? promo.precioPromocional : p.precioVenta
                                            
                                            return (
                                                <div key={p.id} className="flex justify-between items-center p-3.5 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors">
                                                    <div className="min-w-0 pr-3">
                                                        <p className="font-semibold text-sm truncate">{p.nombre}</p>
                                                        {promo ? (
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-muted-foreground line-through">${p.precioVenta.toFixed(2)}</span>
                                                                <span className="text-xs font-bold text-red-600">${finalPrice.toFixed(2)}</span>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-muted-foreground font-medium mt-0.5">${p.precioVenta.toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="rounded-lg shadow-sm shrink-0 px-4"
                                                        onClick={() => {
                                                            const existing = items.find(i => i.productoId === p.id)
                                                            if (existing) {
                                                                updateItemCantidad(p.id, 1)
                                                            } else {
                                                                setItems([...items, {
                                                                    productoId: p.id,
                                                                    productoNombre: p.nombre,
                                                                    precioUnitario: finalPrice,
                                                                    cantidad: 1
                                                                }])
                                                            }
                                                            setIsAddProductOpen(false)
                                                            setSearchQuery("")
                                                        }}
                                                    >
                                                        Agregar
                                                    </Button>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Dirección */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Dirección de entrega</label>
                        <Input
                            value={direccionEntrega}
                            onChange={(e) => setDireccionEntrega(e.target.value)}
                            className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Teléfono</label>
                            <Input
                                value={telefonoContacto}
                                onChange={(e) => setTelefonoContacto(e.target.value)}
                                className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Método de Pago</label>
                            <Select value={metodoPago} onValueChange={setMetodoPago}>
                                <SelectTrigger className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20">
                                    <SelectValue placeholder="Seleccioná..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                                    <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Observaciones</label>
                        <Input
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ej: Timbre B, dejar en portería..."
                            className="h-12 rounded-xl bg-background border-border/50 focus:ring-primary/20 italic text-sm"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-xl font-semibold"
                        onClick={onBack}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 h-12 rounded-xl font-semibold shadow-lg shadow-primary/20"
                        onClick={handleSubmit}
                        disabled={loading || !hasChanges || items.length === 0 || !direccionEntrega.trim() || !metodoPago}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </div>
                        ) : (
                            "Guardar cambios"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function OrdersTab() {
    const { orders, loading, error, refetch, page, totalPages, totalElements, nextPage, prevPage } = useOrders()
    const { cancelOrder, loading: isCanceling } = useCancelOrder()
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [cancelError, setCancelError] = useState<string | null>(null)

    const selectedOrder = orders.find(o => o.id === selectedOrderId)

    const handleCancel = async () => {
        if (!selectedOrder) return
        setCancelError(null)
        try {
            await cancelOrder(selectedOrder.id)
            setShowCancelDialog(false)
            setSelectedOrderId(null)
            refetch()
        } catch (err: any) {
            setCancelError(err.message || "Error al cancelar el pedido.")
        }
    }

    const canEdit = selectedOrder && CAN_EDIT_STATES.includes(selectedOrder.estado)
    const canCancel = selectedOrder && CAN_CANCEL_STATES.includes(selectedOrder.estado)

    if (selectedOrder && isEditing) {
        return (
            <EditOrderView
                order={selectedOrder}
                onBack={() => setIsEditing(false)}
                onSaved={() => {
                    setIsEditing(false)
                    refetch()
                }}
            />
        )
    }

    if (selectedOrder) {
        return (
            <div className="pb-24 lg:pb-8 animate-in fade-in duration-300">
                <header className="sticky top-0 z-20 glass border-x-0 border-t-0 lg:hidden">
                    <div className="max-w-2xl mx-auto px-4 lg:px-6">
                        <div className="flex items-center gap-3 h-16">
                            <button
                                onClick={() => {
                                    setSelectedOrderId(null)
                                    setIsEditing(false)
                                }}
                                className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="font-bold text-xl">Detalle del Pedido</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-border/50 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Pedido #{selectedOrder.id}</p>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {new Date(selectedOrder.fechaCreacion).toLocaleString('es-AR', {
                                            dateStyle: 'long',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                                <EstadoBadge estado={selectedOrder.estado} />
                            </div>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <MapPin className="h-5 w-5 shrink-0" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Dirección de entrega</p>
                                    <p className="text-sm font-semibold text-foreground/90">{selectedOrder.direccionEntrega}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <Phone className="h-5 w-5 shrink-0" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Contacto</p>
                                    <p className="text-sm font-semibold text-foreground/90">{selectedOrder.telefonoContacto}</p>
                                </div>
                            </div>
                            {selectedOrder.observaciones && (
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                        <MessageSquare className="h-5 w-5 shrink-0" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Observaciones</p>
                                        <p className="text-sm text-foreground/80 italic font-medium">"{selectedOrder.observaciones}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm">
                        <div className="p-5 border-b border-border/50 flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <h2 className="font-bold text-base">Productos solicitados</h2>
                        </div>
                        <div className="divide-y divide-border/30">
                            {selectedOrder.detalles.map((item) => (
                                <div key={item.id} className="p-5 flex justify-between items-center text-sm group hover:bg-muted/30 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground/90">{item.productoNombre}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                            {item.cantidad} x ${item.precioUnitario.toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-foreground">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-muted/10 rounded-b-2xl space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Productos</span>
                                <span className="text-foreground">${(selectedOrder.montoTotal - selectedOrder.costoDelivery).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Costo de Envío</span>
                                <span className="text-foreground">${selectedOrder.costoDelivery.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-black text-lg pt-4 border-t border-border/50">
                                <span className="tracking-tight">Total pagado</span>
                                <span className="text-primary">${selectedOrder.montoTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {(canEdit || canCancel) && (
                        <div className="flex gap-3">
                            {canEdit && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-semibold gap-2"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar Pedido
                                </Button>
                            )}
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-semibold gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                                    onClick={() => setShowCancelDialog(true)}
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancelar Pedido
                                </Button>
                            )}
                        </div>
                    )}

                    {selectedOrder.estado === "EN_CAMINO" && (
                        <div className="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 text-center">
                            <p className="text-sm text-orange-600 font-medium">
                                El pedido ya está en camino. No se puede editar ni cancelar.
                            </p>
                        </div>
                    )}

                    {selectedOrder.estado === "ENTREGADO" && (
                        <div className="p-4 bg-success-500/5 rounded-xl border border-success-500/10 text-center">
                            <p className="text-sm text-success-500 font-medium">
                                El pedido fue entregado exitosamente.
                            </p>
                        </div>
                    )}

                    {selectedOrder.estado === "CANCELADO" && (
                        <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 text-center">
                            <p className="text-sm text-destructive font-medium">
                                Este pedido fue cancelado.
                            </p>
                        </div>
                    )}
                </div>

                {/* Cancel Dialog */}
                <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar el pedido #{selectedOrder.id}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. El pedido será eliminado permanentemente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {cancelError && (
                            <div className="p-3 bg-destructive/5 text-destructive rounded-xl text-sm font-semibold border border-destructive/20 text-center">
                                {cancelError}
                            </div>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isCanceling}>Volver</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancel}
                                disabled={isCanceling}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isCanceling ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Cancelando...
                                    </div>
                                ) : (
                                    "Sí, cancelar pedido"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }

    return (
        <div className="pb-24 lg:pb-8 selection:bg-primary/20">
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0 lg:hidden">
                <div className="max-w-2xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 h-16">
                        <ClipboardList className="h-6 w-6 text-primary" />
                        <h1 className="font-bold text-xl">Mis Pedidos</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8">
                {loading ? (
                    <div className="text-center py-24">
                        <RotateCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider animate-pulse">Consultando historial...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
                        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="h-7 w-7 text-destructive" />
                        </div>
                        <p className="text-destructive font-semibold text-sm mb-4 uppercase tracking-wide">{error}</p>
                        <Button variant="outline" onClick={refetch} className="rounded-xl border-destructive/20 hover:bg-destructive/10 font-semibold">Intentar de nuevo</Button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                            <ClipboardList className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground/60 font-semibold text-base">Aún no has realizado pedidos.</p>
                        <p className="text-muted-foreground text-sm mt-1">¡Hacé tu primer pedido y aparecerá acá!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {orders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className="w-full text-left p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 active:scale-[0.98] group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            <Clock className="h-3.5 w-3.5 text-primary/60" />
                                            {new Date(order.fechaCreacion).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                        </div>
                                        <EstadoBadge estado={order.estado} />
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        {order.detalles.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex justify-between items-center group-hover:translate-x-1 transition-transform">
                                                <span className="text-sm font-semibold text-foreground/80">{item.cantidad}x {item.productoNombre}</span>
                                            </div>
                                        ))}
                                        {order.detalles.length > 2 && (
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">
                                                + {order.detalles.length - 2} productos más
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-muted-foreground max-w-[65%]">
                                            <MapPin className="h-3.5 w-3.5 text-primary/40 shrink-0" />
                                            <span className="text-[11px] font-medium truncate">
                                                {order.direccionEntrega}
                                            </span>
                                        </div>
                                        <span className="font-bold text-foreground text-base">
                                            ${order.montoTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevPage}
                                    disabled={page === 0}
                                    className="gap-1.5 rounded-xl"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>
                                <span className="text-sm text-muted-foreground font-medium">
                                    Página {page + 1} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={nextPage}
                                    disabled={page >= totalPages - 1}
                                    className="gap-1.5 rounded-xl"
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
