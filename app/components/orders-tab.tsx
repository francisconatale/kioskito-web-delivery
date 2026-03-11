import { ClipboardList, Clock, CheckCircle, RotateCw, ArrowLeft, MapPin, Phone, MessageSquare, Package } from "lucide-react"
import { useOrders, Order } from "../../hooks/use-orders"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function OrdersTab() {
    const { orders, loading, error, refetch } = useOrders()
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

    const selectedOrder = orders.find(o => o.id === selectedOrderId)

    if (selectedOrder) {
        return (
            <div className="pb-24 lg:pb-8">
                <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="max-w-2xl mx-auto px-4 lg:px-6">
                        <div className="flex items-center gap-3 h-14">
                            <button 
                                onClick={() => setSelectedOrderId(null)}
                                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="font-semibold">Detalle del Pedido</h1>
                        </div>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pedido #{selectedOrder.id}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(selectedOrder.fechaCreacion).toLocaleString()}
                                    </p>
                                </div>
                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    {selectedOrder.estado.replace("_", " ")}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Dirección de entrega</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.direccionEntrega}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Contacto</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.telefonoContacto}</p>
                                </div>
                            </div>
                            {selectedOrder.observaciones && (
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Observaciones</p>
                                        <p className="text-sm text-muted-foreground italic">"{selectedOrder.observaciones}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-card rounded-xl border border-border">
                        <div className="p-4 border-b border-border flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <h2 className="font-semibold text-sm">Productos</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {selectedOrder.detalles.map((item) => (
                                <div key={item.id} className="p-4 flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productoNombre}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.cantidad} x ${item.precioUnitario.toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-muted/30 rounded-b-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Productos</span>
                                <span>${(selectedOrder.montoTotal - selectedOrder.costoDelivery).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Envío</span>
                                <span>${selectedOrder.costoDelivery.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t border-border/50">
                                <span>Total</span>
                                <span className="text-primary">${selectedOrder.montoTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-24 lg:pb-8">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-3 h-14">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        <h1 className="font-semibold">Mis Pedidos</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
                {loading ? (
                    <div className="text-center py-16">
                        <RotateCw className="h-6 w-6 text-muted-foreground animate-spin mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">Cargando tus pedidos...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                            <ClipboardList className="h-6 w-6 text-destructive" />
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{error}</p>
                        <Button variant="outline" onClick={refetch}>Intentar de nuevo</Button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <ClipboardList className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">No tienes pedidos todavía.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <button 
                                key={order.id}
                                onClick={() => setSelectedOrderId(order.id)}
                                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all active:scale-[0.98] group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(order.fechaCreacion).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {order.estado === "ENTREGADO" ? (
                                            <>
                                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                <span className="text-green-600 font-medium">Completado</span>
                                            </>
                                        ) : order.estado === "CANCELADO" ? (
                                            <>
                                                <span className="text-destructive h-2 w-2 rounded-full bg-destructive mr-1 inline-block" />
                                                <span className="text-destructive font-medium">Cancelado</span>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                                <Clock className="h-3 w-3" />
                                                <span className="font-medium">
                                                    {order.estado.replace("_", " ")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-1 mb-4">
                                    {order.detalles.slice(0, 2).map((item) => (
                                        <p key={item.id} className="text-sm text-foreground/80 flex justify-between">
                                            <span>{item.cantidad}x {item.productoNombre}</span>
                                        </p>
                                    ))}
                                    {order.detalles.length > 2 && (
                                        <p className="text-xs text-muted-foreground">
                                            + {order.detalles.length - 2} productos más...
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-border flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground truncate max-w-[60%] flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {order.direccionEntrega}
                                    </span>
                                    <span className="font-bold text-primary">${order.montoTotal.toFixed(2)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
