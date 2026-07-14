import { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useActivePromotions } from "@/hooks/use-active-promotions";
import { useAuth } from "@/hooks/use-auth";
import { useAddress } from "@/hooks/use-address";
import { addressService } from "@/lib/address-service";
import { apiClient } from "@/lib/api-client";

export function useHomeTab() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
    const [addingPromoId, setAddingPromoId] = useState<number | null>(null);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);
    const [addedProductId, setAddedProductId] = useState<number | null>(null);
    
    // Address Modal State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    const { user } = useAuth();
    const { activeAddress, setActiveAddress } = useAddress();
    const { promotions, loading: loadingPromos } = useActivePromotions();
    const { categories } = useCategories();

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== submittedSearchQuery) {
                if (searchQuery) {
                    setSelectedPromo(null);
                }
                setSubmittedSearchQuery(searchQuery);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, submittedSearchQuery]);

    const { products, loading, loadingMore, hasMore, loadMore } = useProducts({
        searchQuery: submittedSearchQuery,
        category: selectedCategory,
        size: 15
    });

    const handlePromoClick = async (promo: any) => {
        if (addingPromoId !== null) return;
        setAddingPromoId(promo.id);

        try {
            const allProductsForPromo: Product[] = [];
            let hasCategories = false;

            if (promo.productos && promo.productos.length > 0) {
                promo.productos.forEach((p: any) => {
                    if (p.product) allProductsForPromo.push(p.product);
                });
            } else if (promo.productoIds && promo.productoIds.length > 0) {
                const fetchedProducts = await Promise.all(
                    promo.productoIds.map(async (id: number) => {
                        try {
                            const { data } = await apiClient.get<any>(`/productos-delivery/${id}`);
                            return data;
                        } catch (err) {
                            console.error(`Error fetching product ${id}:`, err);
                            return null;
                        }
                    })
                );
                
                fetchedProducts.forEach((p: any) => {
                    if (p) allProductsForPromo.push(p);
                });
            }

            setSelectedPromo({
                ...promo,
                displayProducts: allProductsForPromo,
                isFixedPromoOnly: !hasCategories && allProductsForPromo.length > 0
            });

            setSearchQuery("");
            setSubmittedSearchQuery("");
            setSelectedCategory("all");

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Error al cargar promoción:", err);
        } finally {
            setAddingPromoId(null);
        }
    };

    const handleSearch = () => {
        setSelectedPromo(null);
        setSubmittedSearchQuery(searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSubmittedSearchQuery("");
        setSelectedPromo(null);
    };

    const fetchAddresses = async () => {
        if (!user) return;
        setLoadingAddresses(true);
        try {
            const fetched = await addressService.getAddresses();
            setAddresses(fetched);
        } catch (err) {
            console.error("Error fetching addresses", err);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleOpenAddressModal = () => {
        setIsAddressModalOpen(true);
        fetchAddresses();
    };

    const handleAddAddress = async () => {
        if (!newAddress.trim()) return;
        try {
            const added = await addressService.addAddress(newAddress);
            setNewAddress("");
            fetchAddresses();
            setActiveAddress(added.direccion);
        } catch(err) {
            console.error("Error adding address", err);
        }
    };

    const handleSelectAddress = async (addr: any) => {
        setActiveAddress(addr.direccion);
        setIsAddressModalOpen(false);
    };

    const getPromoForProduct = (productId: number) => {
        return promotions.find(promo =>
            promo.productos?.some((p: any) => p.product?.id === productId) ||
            promo.productoIds?.includes(productId)
        );
    };

    const displayAddress = activeAddress !== undefined ? activeAddress : user?.direccion;
    const displayedProducts = selectedPromo ? (selectedPromo.displayProducts || []) : products;

    return {
        state: {
            user,
            displayAddress,
            searchQuery,
            submittedSearchQuery,
            selectedCategory,
            selectedPromo,
            promotions,
            loadingPromos,
            categories,
            products: displayedProducts,
            loadingProducts: loading,
            loadingMore,
            hasMore,
            addingPromoId,
            addedProductId,
            
            // Address State
            isAddressModalOpen,
            addresses,
            loadingAddresses,
            newAddress,
            activeAddress
        },
        actions: {
            setSearchQuery,
            handleSearch,
            clearSearch,
            setSelectedCategory,
            handlePromoClick,
            setSelectedPromo,
            setAddedProductId,
            loadMore,
            getPromoForProduct,
            
            // Address Actions
            setIsAddressModalOpen,
            handleOpenAddressModal,
            handleAddAddress,
            handleSelectAddress,
            setNewAddress
        }
    };
}
