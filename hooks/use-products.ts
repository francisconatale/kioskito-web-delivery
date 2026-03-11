import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Product } from "@/lib/data";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get<any>("/productos", {
                    params: { page: 0, size: 500, activado: true }
                });

                const items = Array.isArray(data) ? data : (data?.data || data?.content || []);
                setProducts(items);
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError(err.message || "Error al cargar productos");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error
    };
}
