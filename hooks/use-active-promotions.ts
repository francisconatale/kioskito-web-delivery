import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Product } from "@/lib/data";

export interface PromocionRegla {
    id: number;
    tipoRegla: string;
    categoriaId?: number;
    categoriaNombre?: string;
    productoId?: number;
    productoNombre?: string;
    cantidadMinima?: number;
    cantidadRequerida?: number;
    grupo?: number;
}

export interface Promocion {
    id: number;
    uuid: string;
    codigo: string;
    nombre: string;
    tipo: string;
    valor: number;
    cantidadCompra?: number;
    cantidadPaga?: number;
    reglas: PromocionRegla[];
    precioOriginal?: number;
    precioPromocional?: number;
    productos?: { product: Product, quantity: number }[];
}

export function useActivePromotions() {
    const [promotions, setPromotions] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPromotions = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get<Promocion[]>("/promociones/vigentes", {
                    params: { negocioId: 1 }
                });

                if (!data) {
                    if (isMounted) setPromotions([]);
                    return;
                }

                // Backend now provides enriched data (precioOriginal, precioPromocional, esEstimado, productos)
                if (isMounted) setPromotions(data);
            } catch (err: any) {
                console.error("Error fetching active promotions:", err);
                if (isMounted) setError(err.message || "Error al cargar promociones");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPromotions();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        promotions,
        loading,
        error
    };
}
