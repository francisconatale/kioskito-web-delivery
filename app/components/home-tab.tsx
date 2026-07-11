import { useState, useRef, useCallback } from "react"
import { Search, MapPin, Plus, Loader2, X } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CATEGORIES, Product } from "@/lib/data"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { useActivePromotions } from "@/hooks/use-active-promotions"
import { apiClient } from "@/lib/api-client"

interface HomeTabProps {
    onAddToCart: (product: Product) => void
    onAddMultipleToCart?: (items: { product: Product, quantity: number }[]) => void
}

export function HomeTab({ onAddToCart, onAddMultipleToCart }: HomeTabProps) {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState("") // Only updates API when submitted
    const [addingPromoId, setAddingPromoId] = useState<number | null>(null)
    const [selectedPromo, setSelectedPromo] = useState<any>(null)

    const { promotions, loading: loadingPromos } = useActivePromotions()

    const {
        products,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        error
    } = useProducts({
        searchQuery: submittedSearchQuery,
        category: selectedCategory,
        size: 15
    })

    const handlePromoClick = async (promo: any) => {
        if (addingPromoId !== null) return;
        setAddingPromoId(promo.id);

        try {
            const allProductsForPromo: Product[] = [];
            let hasCategories = false;

            // Use already loaded fixed products
            if (promo.productos && promo.productos.length > 0) {
                promo.productos.forEach((p: any) => {
                    if (p.product) allProductsForPromo.push(p.product);
                });
            }

            const rulesWithCategories = promo.reglas.filter((r: any) => r.categoriaNombre || r.categoriaId);
            if (rulesWithCategories.length > 0) {
                hasCategories = true;
                for (const rule of rulesWithCategories) {
                    const { data } = await apiClient.get<any>('/productos', {
                        params: {
                            categoriaId: rule.categoriaId,
                            categoria: rule.categoriaNombre?.toUpperCase(),
                            negocioId: 1,
                            size: 100
                        }
                    });

                    const items: Product[] = Array.isArray(data) ? data : (data?.data || data?.content || []);
                    items.forEach(item => {
                        if (!allProductsForPromo.find(p => p.id === item.id)) {
                            allProductsForPromo.push(item);
                        }
                    });
                }
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
    }

    const { categories } = useCategories()
    const displayedProducts = selectedPromo
        ? (selectedPromo.displayProducts || [])
        : products;

    const handleSearch = () => {
        setSubmittedSearchQuery(searchQuery)
    }

    const clearSearch = () => {
        setSearchQuery("")
        setSubmittedSearchQuery("")
        setSelectedCategory("all")
    }

    return (
        <div className="pb-32 lg:pb-8 selection:bg-primary/20 bg-primary-50 min-h-screen font-sans">
            <div className="max-w-md mx-auto px-5 pt-4">
                {/* Header Compacto */}
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm flex-1 mr-4 flex items-center border border-transparent focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search className="text-primary-700 w-5 h-5 ml-1 shrink-0" />
                        <input 
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-neutral-900 placeholder:text-neutral-400" 
                            placeholder="Buscar..." 
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (val === "") setSubmittedSearchQuery("");
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {searchQuery && <X className="w-4 h-4 text-neutral-400 cursor-pointer mr-1" onClick={clearSearch} />}
                    </div>
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm cursor-pointer shrink-0">
                        <div className="w-5 h-5 bg-primary-700 rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">U</span>
                        </div>
                    </div>
                </div>

                {/* Saludo Personalizado */}
                <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2 leading-none tracking-tight">
                    Hola,<br/><span className="text-primary-700">Invitado</span>
                </h1>
                <p className="text-neutral-600 mb-6 font-medium text-sm">Es hora de un buen pedido.</p>

                {/* Promociones Exclusivas */}
                {!loadingPromos && promotions.length > 0 && searchQuery === "" && selectedCategory === "all" && (
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <h2 className="font-display font-bold text-xl text-neutral-900">Promociones</h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                            {promotions.map((promo) => {
                                const isAdding = addingPromoId === promo.id;
                                return (
                                    <div 
                                        key={promo.id} 
                                        onClick={() => handlePromoClick(promo)}
                                        className="shrink-0 w-48 rounded-2xl p-4 bg-gradient-to-tr from-primary-500 to-primary-700 text-white shadow-md relative cursor-pointer hover:shadow-lg transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                                {promo.tipo === 'DESCUENTO_PORCENTAJE' ? `${promo.valor}% OFF` : 'PROMO'}
                                            </span>
                                            {isAdding && <Loader2 className="w-3 h-3 animate-spin" />}
                                        </div>
                                        <h3 className="font-bold text-sm leading-tight line-clamp-2">{promo.nombre}</h3>
                                        {promo.precioPromocional !== undefined && (
                                            <p className="font-bold mt-1 text-sm">${Number(promo.precioPromocional).toFixed(2)}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Categorías */}
                {searchQuery === "" && !selectedPromo && (
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <h2 className="font-display font-bold text-xl text-neutral-900">Categorías</h2>
                            {selectedCategory !== "all" && (
                                <span onClick={() => setSelectedCategory("all")} className="text-primary-700 font-bold text-xs cursor-pointer">Ver todas</span>
                            )}
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat.id.toString();
                                return (
                                    <div 
                                        key={cat.id} 
                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                        className={`shrink-0 w-28 h-28 rounded-2xl p-3 flex flex-col justify-end cursor-pointer transition-all ${isSelected ? 'bg-primary-700 text-white shadow-lg shadow-primary-700/30' : 'bg-white text-neutral-900 shadow-sm hover:shadow-md'}`}
                                    >
                                        <span className="font-bold text-base leading-tight">{cat.nombre}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Selected Promo Banner */}
                {selectedPromo && (
                    <div className="mb-6 bg-primary-100 rounded-2xl p-3 flex justify-between items-center border border-primary-200">
                        <div className="min-w-0 flex-1 pr-2">
                            <span className="text-[10px] text-primary-700 font-bold uppercase">Viendo promo</span>
                            <h3 className="font-bold text-neutral-900 text-sm truncate">{selectedPromo.nombre}</h3>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {onAddMultipleToCart && selectedPromo.isFixedPromoOnly && (
                                <button onClick={() => { onAddMultipleToCart(selectedPromo.productos); setSelectedPromo(null); }} className="bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Llevar Todo</button>
                            )}
                            <button onClick={() => setSelectedPromo(null)} className="bg-white p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4"/></button>
                        </div>
                    </div>
                )}

                {/* Productos */}
                <div className="mt-4">
                    <div className="flex justify-between items-end mb-3">
                        <h2 className="font-display font-bold text-xl text-neutral-900">
                            {searchQuery ? 'Resultados de búsqueda' : selectedPromo ? 'Productos de la promo' : 'Para ti'}
                        </h2>
                    </div>
                    
                    {loading && !selectedPromo ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-primary-700 animate-spin" /></div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="text-center py-10 text-neutral-500 text-sm">No encontramos productos.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {displayedProducts.map((product: any) => (
                                <div key={product.id} className="bg-white p-2.5 rounded-2xl flex items-center shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow" onClick={() => onAddToCart(product)}>
                                    <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                                        {product.image ? (
                                            <Image src={product.image} alt={product.nombre} fill className="object-cover" />
                                        ) : (
                                            <span className="text-xl">📦</span>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <h3 className="font-bold text-sm text-neutral-900 truncate">{product.nombre}</h3>
                                        <span className="text-[10px] text-neutral-500 block truncate mb-1">{product.descripcion}</span>
                                        <span className="text-primary-700 font-bold text-sm">${product.precioVenta?.toFixed(2)}</span>
                                    </div>
                                    <button className="h-8 w-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center ml-2 flex-shrink-0 transition-colors hover:bg-primary-100" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!selectedPromo && hasMore && (
                        <div className="py-6 flex justify-center">
                            <button onClick={loadMore} disabled={loadingMore} className="bg-white border border-neutral-200 text-primary-700 font-bold px-4 py-2 rounded-xl text-sm shadow-sm flex items-center gap-2 hover:bg-neutral-50">
                                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Ver más
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
