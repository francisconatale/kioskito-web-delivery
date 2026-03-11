import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CartItem } from "@/lib/data";

export interface CheckoutFormData {
    nombreCliente: string;
    dniCliente: string;
    telefonoContacto: string;
    direccionEntrega: string;
    observaciones: string;
}

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitOrder = async (cart: CartItem[], formData: CheckoutFormData) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                negocioId: 1, // Default para el multi-tenant
                nombreCliente: formData.nombreCliente,
                dniCliente: formData.dniCliente,
                telefonoContacto: formData.telefonoContacto,
                direccionEntrega: formData.direccionEntrega,
                observaciones: formData.observaciones,
                costoDelivery: 0, // Según el caso
                items: cart.map(item => ({
                    productoId: item.id,
                    cantidad: item.quantity
                }))
            };

            const response = await apiClient.post("/delivery/pedidos", payload);
            return response;
        } catch (err: any) {
            console.error("Error creating order:", err);
            setError(err.message || "Error al procesar el pedido.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        submitOrder,
        loading,
        error
    };
}
