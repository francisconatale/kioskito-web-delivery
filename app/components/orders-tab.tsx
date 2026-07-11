import { ClipboardList, Clock, CheckCircle, RotateCw, ArrowLeft, MapPin, Phone, MessageSquare, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useOrders, Order } from "../../hooks/use-orders"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const ESTADO_BADGE: Record<Order["estado"], { bg: string; text: string; label: string }> = {
    PENDIENTE: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600", label: "Pendiente" },
    EN_PREPARACION: { bg: "bg-primary/10 border-primary/20", text: "text-primary", label: "En Preparación" },
    EN_CAMINO: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-600", label: "En Camino" },
    ENTREGADO: { bg: "bg-success-500/10 border-success-500/20", text: "text-success-500", label: "Completado" },
    CANCELADO: { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", label: "Cancelado" },
}

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

export function OrdersTab() {
    const { orders, loading, error, refetch, page, totalPages, totalElements, nextPage, prevPage } = useOrders()
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

    const selectedOrder = orders.find(o => o.id === selectedOrderId)

    if (selectedOrder) {
        return (
            <div className="pb-24 lg:pb-8 animate-in fade-in duration-300">
                <header className="sticky top-0 z-20 glass border-x-0 border-t-0 lg:hidden">
                    <div className="max-w-2xl mx-auto px-4 lg:px-6">
                        <div className="flex items-center gap-3 h-16">
                            <button 
                                onClick={() => setSelectedOrderId(null)}
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
                </div>
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
