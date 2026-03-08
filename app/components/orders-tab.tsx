import { ClipboardList, Clock, CheckCircle } from "lucide-react"

interface Order {
    id: string
    date: string
    status: "pending" | "completed"
    items: { name: string; quantity: number }[]
    total: number
}

// Pedidos de ejemplo (en produccion vendrian de la base de datos)
const MOCK_ORDERS: Order[] = [
    {
        id: "1",
        date: "Hace 2 dias",
        status: "completed",
        items: [
            { name: "Ensalada Caesar", quantity: 1 },
            { name: "Agua Mineral", quantity: 2 }
        ],
        total: 18.50
    },
    {
        id: "2", 
        date: "Hace 1 semana",
        status: "completed",
        items: [
            { name: "Bowl de Quinoa", quantity: 1 },
            { name: "Smoothie Verde", quantity: 1 }
        ],
        total: 22.00
    }
]

export function OrdersTab() {
    const orders = MOCK_ORDERS

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
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <ClipboardList className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">No tienes pedidos todavia</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div 
                                key={order.id}
                                className="p-4 rounded-lg border border-border bg-card"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {order.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {order.status === "completed" ? (
                                            <>
                                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                <span className="text-green-600">Completado</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                <span className="text-amber-600">En proceso</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="space-y-1 mb-3">
                                    {order.items.map((item, idx) => (
                                        <p key={idx} className="text-sm">
                                            {item.quantity}x {item.name}
                                        </p>
                                    ))}
                                </div>

                                <div className="pt-3 border-t border-border flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total</span>
                                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
