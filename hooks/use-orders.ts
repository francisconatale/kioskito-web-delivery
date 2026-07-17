import { useState, useCallback, useEffect, useRef } from "react";
import { apiClient, isOfflineError } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

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

interface PaginatedResponse {
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

const PAGE_SIZE = 10;

export function useOrders() {
    const { authState, isResolvingAuth } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const pageRef = useRef(0);

    const fetchOrders = useCallback(async (targetPage?: number) => {
        const p = targetPage ?? pageRef.current;
        try {
            setLoading(true);
            setError(null);

            if (authState !== "authenticated") {
                setOrders([]);
                setLoading(false);
                return;
            }

            const response = await apiClient.get<PaginatedResponse | Order[]>("/delivery/pedidos/mis-pedidos", {
                params: { page: p, size: PAGE_SIZE, sort: "fechaCreacion,desc" },
            });

            const data = response.data;
            if (Array.isArray(data)) {
                setOrders(data);
                setTotalPages(1);
                setTotalElements(data.length);
            } else if (data && "content" in data) {
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
                setPage(data.number || 0);
                pageRef.current = data.number || 0;
            } else {
                setOrders([]);
                setTotalPages(1);
                setTotalElements(0);
            }
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
    }, [authState]);

    useEffect(() => {
        if (!isResolvingAuth) {
            fetchOrders(0);
        }
    }, [isResolvingAuth, authState, fetchOrders]);

    const goToPage = useCallback((targetPage: number) => {
        fetchOrders(targetPage);
    }, [fetchOrders]);

    const nextPage = useCallback(() => {
        if (page < totalPages - 1) {
            fetchOrders(page + 1);
        }
    }, [page, totalPages, fetchOrders]);

    const prevPage = useCallback(() => {
        if (page > 0) {
            fetchOrders(page - 1);
        }
    }, [page, fetchOrders]);

    return {
        orders,
        loading,
        error,
        page,
        totalPages,
        totalElements,
        nextPage,
        prevPage,
        goToPage,
        refetch: () => fetchOrders(),
    };
}
