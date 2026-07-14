import { NEGOCIO_ID } from '@/lib/config';
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
    productoIds?: number[];
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
                const { data } = await apiClient.get<Promocion[]>("/productos-delivery/promociones", {
                    params: { negocioId: NEGOCIO_ID }
                });

                if (!data) {
                    if (isMounted) setPromotions([]);
                    return;
                }

                // Backend now provides enriched data (precioOriginal, precioPromocional, esEstimado, productos)
                const enrichedPromotions = data.map(promo => {
                    let calculatedPrice = promo.precioPromocional;
                    if (promo.precioOriginal !== undefined) {
                        if (promo.tipo === 'DESCUENTO_PORCENTAJE') {
                            calculatedPrice = promo.precioOriginal * (1 - promo.valor / 100);
                        } else if (promo.tipo === 'DESCUENTO_FIJO') {
                            calculatedPrice = Math.max(0, promo.precioOriginal - promo.valor);
                        } else if (promo.tipo === 'PRECIO_FIJO') {
                            calculatedPrice = promo.valor;
                        }
                    }
                    return { ...promo, precioPromocional: calculatedPrice };
                });
                
                if (isMounted) setPromotions(enrichedPromotions);
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
