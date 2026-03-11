import { useState } from "react"
import { Search, MapPin, Plus } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { CATEGORIES, Product } from "@/lib/data"
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"

interface HomeTabProps {
    onAddToCart: (product: Product) => void
}

export function HomeTab({ onAddToCart }: HomeTabProps) {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { products, loading, error } = useProducts()
    const { categories } = useCategories()

    const filteredProducts = products.filter((product) => {
        const productCategory = product.categoria?.toUpperCase() || ""
        const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory
        const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="pb-32 lg:pb-8 selection:bg-primary/20">
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0">
                <div className="max-w-3xl mx-auto px-4 lg:px-6">
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground/90 lg:hidden">
                                Kioskito <span className="text-primary font-normal italic">Delivery</span>
                            </h1>
                            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-full">
                                <MapPin className="h-3 w-3" />
                                <span>Buenos Aires, AR</span>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="¿Qué estás buscando hoy?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-card/50 border-border/50 text-base rounded-xl transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                {/* Categories */}
                <div className="mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                                selectedCategory === "all"
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
                                className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                                    selectedCategory === cat.nombre.toUpperCase()
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                        : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                                }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground text-sm font-medium animate-pulse">Buscando lo mejor para vos...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
                        <p className="text-destructive text-sm font-medium">{error}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-muted-foreground text-sm font-medium">No encontramos productos que coincidan.</p>
                        <button onClick={() => {setSearchQuery(""); setSelectedCategory("all")}} className="text-primary text-sm font-semibold mt-2 hover:underline">Ver todo el catálogo</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProducts.map((product) => (
                            <div 
                                key={product.id} 
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
