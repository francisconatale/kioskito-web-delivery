import { useState } from "react"
import { Search, MapPin, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
        <div className="pb-24 lg:pb-8 w-full">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Buenos Aires, AR</span>
                        </div>
                        <div className="lg:hidden">
                            <h1 className="text-lg font-semibold">Kioskito</h1>
                        </div>
                        <div className="w-24" />
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 lg:px-6">
                {/* Hero Section */}
                <section className="py-8 lg:py-12">
                    <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
                        Comida fresca,
                        <br />
                        <span className="text-muted-foreground">a tu puerta.</span>
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-md">
                        Delivery rapido y saludable. Explora nuestro menu y ordena en segundos.
                    </p>
                </section>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar comida, bebidas o postres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                {/* Categories */}
                <div className="mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${
                                    selectedCategory === cat.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <section>
                    <h3 className="text-lg font-medium mb-4">
                        {searchQuery ? "Resultados" : "Recomendados"}
                    </h3>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                            <p className="text-muted-foreground text-sm">No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProducts.map((product) => (
                                <article 
                                    key={product.id} 
                                    className="group flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                                >
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 px-3 text-xs"
                                                onClick={() => onAddToCart(product)}
                                            >
                                                <Plus className="h-3.5 w-3.5 mr-1" />
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
