import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export function useCancelOrder() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelOrder = async (orderId: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.delete(`/delivery/pedidos/${orderId}`);
            return true;
        } catch (err: any) {
            console.error("Error canceling order:", err);
            setError(err.message || "Error al cancelar el pedido.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        cancelOrder,
        loading,
        error,
        clearError: () => setError(null),
    };
}
