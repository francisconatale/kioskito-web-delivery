import { useState, useRef, useCallback, useEffect } from "react"
import { Search, MapPin, Plus, Loader2, X, ShoppingCart, Check } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CATEGORIES, Product } from "@/lib/data"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { useActivePromotions } from "@/hooks/use-active-promotions"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import { addressService } from "@/lib/address-service"

interface HomeTabProps {
    onAddToCart: (product: Product) => void
    onAddMultipleToCart?: (items: { product: Product, quantity: number }[]) => void
    cartCount?: number
    onCheckout?: () => void
}

export function HomeTab({ onAddToCart, onAddMultipleToCart, cartCount = 0, onCheckout }: HomeTabProps) {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState("") 
    const [addingPromoId, setAddingPromoId] = useState<number | null>(null)
    const [selectedPromo, setSelectedPromo] = useState<any>(null)
    const [addedProductId, setAddedProductId] = useState<number | null>(null)
    const [activeAddress, setActiveAddress] = useState<string | undefined>(undefined)

    const { user } = useAuth()
    const { promotions, loading: loadingPromos } = useActivePromotions()

    useEffect(() => {
        if (user) {
            addressService.getAddresses().then(addresses => {
                if (addresses && addresses.length > 0) {
                    setActiveAddress(addresses[0].direccion)
                } else {
                    setActiveAddress("") 
                }
            }).catch(console.error)
        }
    }, [user])

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

    const handleAddToCartClick = (product: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        onAddToCart(product);
        setAddedProductId(product.id);
        setTimeout(() => {
            setAddedProductId(null);
        }, 800);
    }

    const displayAddress = activeAddress !== undefined ? activeAddress : user?.direccion;

    return (
        <div className="pb-32 lg:pb-8 selection:bg-blue-500/30 bg-slate-950 min-h-screen font-sans relative overflow-x-hidden text-white">
            {/* Global Ambient Glow for the entire page */}
            <div className="absolute top-80 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-40 -left-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-b-[2.5rem] pt-6 pb-8 px-5 shadow-[0_10px_40px_rgba(37,99,235,0.2)] mb-8 relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 -left-10 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl"></div>
                </div>
                
                <div className="max-w-md mx-auto relative z-10">
                    {/* User Address at the top if logged in */}
                    {user && displayAddress && (
                        <div className="flex items-center text-white/90 text-sm mb-4 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20">
                            <MapPin className="w-4 h-4 mr-1.5 text-blue-200" />
                            <span className="truncate max-w-[200px]">{displayAddress}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                        {/* Saludo Personalizado */}
                        <div>
                            <h1 className="font-display text-3xl font-bold text-white mb-1 leading-none tracking-tight drop-shadow-md">
                                Hola,<br/><span className="text-cyan-100">{user ? user.nombre.split(' ')[0] : 'Invitado'}</span>
                            </h1>
                            <p className="text-white/80 font-medium text-sm">Es hora de un buen pedido.</p>
                        </div>
                        
                        {/* Cart */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onCheckout}
                                className="bg-white/10 backdrop-blur-xl p-2.5 rounded-2xl shadow-lg cursor-pointer shrink-0 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all mt-1 relative"
                            >
                                <div className="w-7 h-7 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-white drop-shadow-md" />
                                </div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-600">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-black/20 backdrop-blur-xl p-3 rounded-2xl shadow-inner w-full flex items-center border border-white/10 focus-within:bg-white/20 focus-within:border-white/30 transition-all group">
                        <Search className="text-white/70 group-focus-within:text-white w-5 h-5 ml-1 shrink-0 transition-colors" />
                        <input 
                            className="bg-transparent border-none outline-none text-sm ml-3 w-full text-white placeholder:text-white/50 transition-colors" 
                            placeholder="Buscar..." 
                            value={searchQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchQuery(val);
                                if (val === "") setSubmittedSearchQuery("");
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {searchQuery && <X className="w-4 h-4 text-white/50 hover:text-white cursor-pointer mr-1 transition-colors" onClick={clearSearch} />}
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-5 relative z-10">
                {/* Promociones Exclusivas */}
                {!loadingPromos && promotions.length > 0 && searchQuery === "" && selectedCategory === "all" && (
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="font-display font-bold text-xl text-white">Promociones</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                            {promotions.map((promo) => {
                                const isAdding = addingPromoId === promo.id;
                                return (
                                    <div 
                                        key={promo.id} 
                                        onClick={() => handlePromoClick(promo)}
                                        className="shrink-0 w-48 rounded-3xl p-5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.3)] border border-blue-400/30 relative cursor-pointer hover:shadow-[0_8px_40px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-white/5 rounded-3xl pointer-events-none" />
                                        <div className="flex justify-between items-start mb-3 relative z-10">
                                            <span className="bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                                {promo.tipo === 'DESCUENTO_PORCENTAJE' ? `${promo.valor}% OFF` : 'PROMO'}
                                            </span>
                                            {isAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                                        </div>
                                        <h3 className="font-bold text-sm leading-snug line-clamp-2 relative z-10 drop-shadow-sm">{promo.nombre}</h3>
                                        {promo.precioPromocional !== undefined && (
                                            <p className="font-black mt-2 text-lg text-cyan-100 relative z-10">${Number(promo.precioPromocional).toFixed(2)}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Categorías */}
                {searchQuery === "" && !selectedPromo && (
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="font-display font-bold text-xl text-white">Categorías</h2>
                            {selectedCategory !== "all" && (
                                <span onClick={() => setSelectedCategory("all")} className="text-blue-400 font-bold text-xs cursor-pointer hover:text-blue-300 transition-colors">Ver todas</span>
                            )}
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat.id.toString();
                                return (
                                    <div 
                                        key={cat.id} 
                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                        className={`shrink-0 w-[104px] h-[104px] rounded-[1.5rem] p-3 flex flex-col justify-end cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                                            isSelected 
                                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50' 
                                                : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'group-hover:opacity-100'}`} />
                                        <span className="font-bold text-[13px] leading-tight relative z-10">{cat.nombre}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Selected Promo Banner */}
                {selectedPromo && (
                    <div className="mb-6 bg-blue-900/30 backdrop-blur-xl rounded-2xl p-4 flex justify-between items-center border border-blue-500/30 shadow-lg">
                        <div className="min-w-0 flex-1 pr-4">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 block">Viendo promo</span>
                            <h3 className="font-bold text-white text-sm truncate">{selectedPromo.nombre}</h3>
                        </div>
                        <div className="flex gap-2 shrink-0 items-center">
                            {onAddMultipleToCart && selectedPromo.isFixedPromoOnly && (
                                <button onClick={() => { onAddMultipleToCart(selectedPromo.productos); setSelectedPromo(null); }} className="bg-blue-600 hover:bg-blue-500 transition-colors text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md">
                                    Llevar Todo
                                </button>
                            )}
                            <button onClick={() => setSelectedPromo(null)} className="bg-white/10 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/20 transition-all">
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Productos */}
                <div className="mt-6">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="font-display font-bold text-xl text-white">
                            {searchQuery ? 'Resultados de búsqueda' : selectedPromo ? 'Productos de la promo' : 'Para ti'}
                        </h2>
                    </div>
                    
                    {loading && !selectedPromo ? (
                        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : displayedProducts.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                            <span className="text-slate-400 text-sm font-medium">No encontramos productos.</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {displayedProducts.map((product: any) => {
                                const isAdded = addedProductId === product.id;
                                return (
                                    <div 
                                        key={product.id} 
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-3.5 rounded-[1.5rem] flex items-center shadow-lg relative group cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden" 
                                        onClick={() => handleAddToCartClick(product)}
                                    >
                                        {/* Optional subtle highlight gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-slate-800/80 overflow-hidden shrink-0 flex items-center justify-center relative border border-white/5 shadow-inner">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.nombre} fill className="object-cover" />
                                            ) : (
                                                <span className="text-xl font-black text-slate-600">{product.nombre.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1 min-w-0 relative z-10">
                                            <h3 className="font-bold text-sm text-white truncate drop-shadow-sm">{product.nombre}</h3>
                                            <span className="text-[11px] text-slate-400 block truncate mb-1.5">{product.descripcion}</span>
                                            <span className="text-blue-400 font-black text-sm drop-shadow-sm">${product.precioVenta?.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            className={`h-10 w-10 rounded-[1.25rem] flex items-center justify-center ml-3 flex-shrink-0 transition-all duration-300 relative z-10 ${
                                                isAdded 
                                                    ? 'bg-green-500 text-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-green-400' 
                                                    : 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white shadow-sm'
                                            }`} 
                                            onClick={(e) => handleAddToCartClick(product, e)}
                                        >
                                            {isAdded ? <Check className="w-5 h-5 drop-shadow-sm" /> : <Plus className="w-5 h-5" />}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    
                    {!selectedPromo && hasMore && (
                        <div className="py-8 flex justify-center">
                            <button onClick={loadMore} disabled={loadingMore} className="bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold px-5 py-2.5 rounded-2xl text-sm shadow-lg flex items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all">
                                {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Ver más
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
