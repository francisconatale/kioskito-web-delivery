import { useState } from "react"
import { Search, MapPin, Plus } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { CATEGORIES, PRODUCTS, Product } from "@/lib/data"

interface HomeTabProps {
    onAddToCart: (product: Product) => void
}

export function HomeTab({ onAddToCart }: HomeTabProps) {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredProducts = PRODUCTS.filter((product) => {
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                                selectedCategory === cat.id
                                    ? "bg-foreground text-background"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                </div>

                {filteredProducts.length === 0 ? (
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
                                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => onAddToCart(product)}
                                        className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
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
