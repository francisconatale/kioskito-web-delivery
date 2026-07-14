import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface EditOrderItem {
    productoId: number;
    cantidad: number;
}

export interface EditOrderPayload {
    negocioId: number;
    items: EditOrderItem[];
    metodoPago: string;
    direccionEntrega: string;
    telefonoContacto?: string;
    observaciones?: string;
    costoDelivery?: number;
}

export function useEditOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editOrder = async (orderId: number, payload: EditOrderPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.put(`/delivery/pedidos/${orderId}`, payload);
            return response.data;
        } catch (err: any) {
            console.error("Error editing order:", err);
            setError(err.message || "Error al editar el pedido.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        editOrder,
        loading,
        error,
        clearError: () => setError(null),
    };
}
