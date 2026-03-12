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
        <div className="pb-32 lg:pb-8 selection:bg-primary/20">
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0">
                <div className="max-w-3xl mx-auto px-4 lg:px-6">
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/90 lg:hidden">
                                Caffres
                            </h1>
                            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-full">
                                <MapPin className="h-3 w-3" />
                                <span>Miguel Cane 4598, San Miguel, Buenos Aires</span>
                            </div>
                        </div>

                        <div className="relative group flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="¿Qué estás buscando hoy?"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearchQuery(val);
                                        if (val === "") {
                                            setSubmittedSearchQuery(""); // Auto-clear if empty
                                        }
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="px-4 pr-10 h-11 bg-card/50 border-border/50 text-base rounded-xl transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleSearch}
                                className="h-11 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-all"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                {/* Promotions Banner */}
                {searchQuery === "" && selectedCategory === "all" && (
                    <div className="mb-10 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-6 sm:p-8 shadow-2xl shadow-primary/20 group">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight text-white mb-1">Promociones Exclusivas</h3>
                                    <p className="text-primary-foreground/80 text-sm font-medium">Aprovechá estos descuentos increíbles</p>
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 snap-x">
                                {loadingPromos ? (
                                    <div className="flex justify-center items-center w-full h-[130px] sm:h-[150px]">
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    </div>
                                ) : promotions.length === 0 ? (
                                    <div className="flex justify-center flex-col items-center w-full h-[130px] sm:h-[150px] text-white/50">
                                        <p className="text-sm font-medium">No hay promociones activas</p>
                                    </div>
                                ) : (
                                    promotions.map((promo, i) => {
                                        const backgrounds = [
                                            "bg-gradient-to-tr from-orange-400 to-amber-300",
                                            "bg-gradient-to-tr from-rose-400 to-red-500",
                                            "bg-gradient-to-tr from-indigo-500 to-purple-500",
                                            "bg-gradient-to-tr from-emerald-400 to-teal-500"
                                        ]
                                        const bgClass = backgrounds[i % backgrounds.length]
                                        const isAdding = addingPromoId === promo.id

                                        return (
                                            <div
                                                key={promo.id || i}
                                                onClick={() => handlePromoClick(promo)}
                                                className={`relative w-[220px] h-[130px] sm:w-[260px] sm:h-[150px] rounded-2xl overflow-hidden flex-shrink-0 snap-center shadow-lg transform transition-all cursor-pointer group/card ${isAdding ? 'scale-95 opacity-80' : 'hover:-translate-y-1'}`}
                                            >
                                                <div className={`absolute inset-0 ${bgClass} opacity-90 group-hover/card:opacity-100 transition-opacity`}></div>
                                                <div className="absolute inset-0 bg-black/10"></div>
                                                <div className="relative h-full p-4 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-white bg-black/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                            {promo.tipo === 'DESCUENTO_PORCENTAJE' ? `${promo.valor}% OFF` :
                                                                promo.tipo === 'COMBO' ? 'Combo Especial' :
                                                                    promo.tipo === '2X1' ? 'Llevá 2 pagá 1' : 'Promoción'}
                                                        </span>
                                                        {isAdding && (
                                                            <div className="bg-black/30 backdrop-blur-sm p-1.5 rounded-full">
                                                                <Loader2 className="h-4 w-4 text-white animate-spin" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">{promo.nombre}</h4>

                                                        {promo.precioOriginal !== undefined && promo.precioPromocional !== undefined ? (
                                                            <div className="flex flex-col gap-1 mt-2 self-start">
                                                                 {/* Price estimation indicator removed per user request */}
                                                                <div className="flex items-center gap-2 bg-black/20 inline-flex px-2 py-1 rounded-lg backdrop-blur-sm">
                                                                    <span className="text-white/60 text-xs line-through font-medium">
                                                                        ${Number(promo.precioOriginal).toFixed(2)}
                                                                    </span>
                                                                    <span className="text-white font-bold text-base">
                                                                        ${Number(promo.precioPromocional).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 mt-2 bg-black/20 self-start inline-flex px-2 py-1 rounded-lg backdrop-blur-sm">
                                                                <span className="text-white font-bold text-sm">
                                                                    {promo.reglas.find((r: any) => r.categoriaNombre)?.categoriaNombre
                                                                        ? `Aplica a ${promo.reglas.find((r: any) => r.categoriaNombre)?.categoriaNombre}`
                                                                        : "Ver Productos"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === "all"
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.nombre.toUpperCase())}
                                className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === cat.nombre.toUpperCase()
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                                    }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedPromo && (
                    <div className="mb-6 flex items-center justify-between bg-primary/10 px-4 py-3 rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
                            <div className="flex-1 min-w-0 pr-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Estás viendo</span>
                                <h3 className="text-lg font-black leading-tight mt-0.5 text-foreground truncate block">{selectedPromo.nombre}</h3>
                                {selectedPromo.precioPromocional !== undefined && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-primary font-black text-sm">${Number(selectedPromo.precioPromocional).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {onAddMultipleToCart && selectedPromo.isFixedPromoOnly && (
                                <button
                                    onClick={() => {
                                        onAddMultipleToCart(selectedPromo.productos);
                                        setSelectedPromo(null);
                                    }}
                                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md shadow-primary/20 whitespace-nowrap active:scale-95 transition-all"
                                >
                                    Llevar Todo
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedPromo(null)}
                                className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-card rounded-full text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 active:scale-90 transition-all shadow-sm"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {loading && !selectedPromo ? (
                    <div className="text-center py-20">
                        <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm font-medium animate-pulse">Buscando lo mejor para vos...</p>
                    </div>
                ) : error && !selectedPromo ? (
                    <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
                        <p className="text-destructive text-sm font-medium">{error}</p>
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-muted-foreground text-sm font-medium">No encontramos productos que coincidan.</p>
                        <button onClick={clearSearch} className="text-primary text-sm font-semibold mt-2 hover:underline">Ver todo el catálogo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {displayedProducts.map((product: any, index: number) => {
                            return (
                                <div
                                    key={`${product.id}-${index}`}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-transparent bg-card hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 active:scale-[0.99]"
                                >
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted/30 border border-border/10 flex items-center justify-center transition-transform group-hover:scale-105">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.nombre}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl filter grayscale-[0.2] group-hover:grayscale-0 transition-all">📦</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">{product.categoria || "General"}</span>
                                            <h4 className="text-base font-bold text-foreground/90 group-hover:text-primary transition-colors truncate">
                                                {product.nombre}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed h-8">
                                            {product.descripcion || "Sin descripción disponible"}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-foreground">
                                                    ${product.precioVenta?.toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => onAddToCart(product)}
                                                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 transition-all shadow-md shadow-primary/10 active:shadow-none font-medium text-sm"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Agregar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Load More Button */}
                        {!selectedPromo && hasMore && (
                            <div className="flex justify-center py-6">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all flex items-center gap-2"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Cargando...
                                        </>
                                    ) : (
                                        'Ver más productos'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>


        </div>
    )
}
