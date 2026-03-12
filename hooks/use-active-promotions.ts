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

                // Enrich promotions with product details and price calculations
                const enrichedPromos = await Promise.all(data.map(async (promo) => {
                    let precioOriginal = 0;
                    const loadedProducts: { product: Product, quantity: number }[] = [];
                    let hasAllProducts = true;
                    const itemsSimulacion: any[] = [];

                    for (const regla of promo.reglas) {
                        if (regla.productoId && regla.cantidadRequerida) {
                            try {
                                const prodRes = await apiClient.get<Product>(`/productos/${regla.productoId}`);
                                if (prodRes.data) {
                                    loadedProducts.push({ product: prodRes.data, quantity: regla.cantidadRequerida });
                                    precioOriginal += Number(prodRes.data.precioVenta) * regla.cantidadRequerida;
                                    
                                    itemsSimulacion.push({
                                        productoId: regla.productoId,
                                        cantidad: regla.cantidadRequerida,
                                        precioUnitario: prodRes.data.precioVenta
                                    });
                                } else {
                                    hasAllProducts = false;
                                }
                            } catch (e) {
                                hasAllProducts = false;
                            }
                        } else {
                            // If rules depend on categories, we can't show an exact price for the bundle
                            hasAllProducts = false; 
                        }
                    }

                    let precioPromocional = precioOriginal;
                    
                    if (hasAllProducts && loadedProducts.length > 0 && itemsSimulacion.length > 0) {
                        try {
                            const simulacionRes = await apiClient.post<any>('/promociones/simular', {
                                items: itemsSimulacion
                            }, { params: { negocioId: 1 } });
                            
                            if (simulacionRes.data && simulacionRes.data.totalFinal !== undefined) {
                                precioPromocional = Number(simulacionRes.data.totalFinal);
                            }
                        } catch (e) {
                            console.error("Error al simular promoción:", e);
                            precioPromocional = precioOriginal; // Fallback to original price
                        }
                    }

                    return {
                        ...promo,
                        precioOriginal: hasAllProducts && loadedProducts.length > 0 ? precioOriginal : undefined,
                        precioPromocional: hasAllProducts && loadedProducts.length > 0 ? precioPromocional : undefined,
                        productos: loadedProducts
                    } as Promocion;
                }));

                if (isMounted) setPromotions(enrichedPromos);
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
