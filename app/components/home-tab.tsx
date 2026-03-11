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
        <div className="pb-32 lg:pb-8">
            <header className="border-b border-border sticky top-0 z-10 bg-background">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="lg:hidden font-semibold">Kioskito</div>
                        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Buenos Aires, AR</span>
                        </div>
                        <div className="flex-1 lg:flex-none lg:w-64 ml-4 lg:ml-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 bg-muted/50 border-0 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-4">
                {/* Categories */}
                <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                                selectedCategory === "all"
                                    ? "bg-foreground text-background"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.nombre.toUpperCase())}
                                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                                    selectedCategory === cat.nombre.toUpperCase()
                                        ? "bg-foreground text-background"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">Cargando productos...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive">
                        <p className="text-sm">{error}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">No se encontraron productos.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredProducts.map((product) => (
                            <div 
                                key={product.id} 
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.nombre}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl">📦</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium">{product.nombre}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                        {product.descripcion || "Sin descripción"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">${product.precioVenta?.toFixed(2)}</span>
                                    <button
                                        onClick={() => onAddToCart(product)}
                                        className="h-8 w-8 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground flex items-center justify-center transition-colors shadow-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
