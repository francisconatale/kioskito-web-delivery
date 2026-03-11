import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export type Categoria = {
    id: number;
    nombre: string;
};

export function useCategories() {
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get<any>("/categoria", {
                    params: { negocioId: 1 }
                });
                
                const items = Array.isArray(data) ? data : (data?.data || data?.content || []);
                setCategories(items);
            } catch (err: any) {
                console.error("Error fetching categories:", err);
                setError(err.message || "Error al cargar categorías");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error
    };
}
