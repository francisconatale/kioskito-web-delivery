import { useState, useCallback, useEffect } from "react";
import { apiClient, isOfflineError } from "@/lib/api-client";

export interface OrderItem {
    id: number;
    productoId: number;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface Order {
    id: number;
    uuid: string;
    negocioId: number;
    clienteId: number;
    clienteNombre: string;
    clienteTelefono: string;
    estado: "PENDIENTE" | "EN_PREPARACION" | "EN_CAMINO" | "ENTREGADO" | "CANCELADO";
    direccionEntrega: string;
    telefonoContacto: string;
    costoDelivery: number;
    montoTotal: number;
    observaciones: string;
    fechaCreacion: string;
    fechaEntrega?: string;
    detalles: OrderItem[];
}

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = typeof window !== 'undefined' ? sessionStorage.getItem("auth_token") : null;
            if (!token) {
                setOrders([]);
                setLoading(false);
                return;
            }

            const response = await apiClient.get<Order[]>("/delivery/pedidos/mis-pedidos");
            setOrders(response.data || []);
        } catch (err: any) {
            console.error("Error fetching orders:", err);
            if (isOfflineError(err)) {
                setError("Sin conexión a internet. Revisá tu conexión y volvé a intentar.");
            } else if (err.status === 401 || err.status === 403) {
                setError("Debes iniciar sesión para ver tus pedidos.");
            } else {
                setError("Hubo un problema al cargar tus pedidos. Por favor, intentá de nuevo más tarde.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, error, refetch: fetchOrders };
}
