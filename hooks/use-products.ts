import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Product } from "@/lib/data";

interface UseProductsOptions {
    searchQuery?: string;
    category?: string;
    size?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
    const { searchQuery = "", category = "all", size = 15 } = options;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = useCallback(async (currentPage: number, isNewSearch: boolean = false) => {
        try {
            if (isNewSearch) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const isCategorySearch = category !== "all";
            const isTextSearch = searchQuery.trim() !== "";

            // The main /productos endpoint supports both q and categoria parameters simultaneously
            const endpoint = "/productos";
            const params: any = { page: currentPage, size, negocioId: 1 };

            if (isTextSearch) {
                params.q = searchQuery;
            }
            if (isCategorySearch) {
                params.categoria = category;
            }
            if (!isTextSearch && !isCategorySearch) {
                params.activado = true;
            }

            const { data } = await apiClient.get<any>(endpoint, { params });

            const items: Product[] = Array.isArray(data) ? data : (data?.data || data?.content || []);
            const isLastPage = data?.last !== undefined ? data.last : items.length < size;

            setProducts(prev => isNewSearch ? items : [...prev, ...items]);
            setHasMore(!isLastPage);
        } catch (err: any) {
            console.error("Error fetching products:", err);
            setError(err.message || "Error al cargar productos");
            if (isNewSearch) setProducts([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, category, size]);

    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchProducts(0, true);
    }, [fetchProducts]);

    const loadMore = useCallback(() => {
        if (!loading && !loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage, false);
        }
    }, [loading, loadingMore, hasMore, page, fetchProducts]);

    return {
        products,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore
    };
}
