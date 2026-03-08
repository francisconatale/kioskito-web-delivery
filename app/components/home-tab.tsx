import { useState } from "react"
import { Search, MapPin, ChevronDown, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
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
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-[#106efd] to-[#40cfde] px-4 pt-4 pb-6 rounded-b-[2rem] lg:rounded-b-[3rem] shadow-sm">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto">
                    <div>
                        <p className="text-white/70 text-xs font-medium">Tu ubicación</p>
                        <button className="flex items-center gap-1 text-white font-bold text-sm hover:text-white/90 transition-colors">
                            <MapPin className="h-4 w-4" />
                            Buenos Aires, AR
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle variant="header" />
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-5 max-w-5xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Buscar comida, bebidas o postres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-white/95 dark:bg-card/95 border-0 h-12 rounded-2xl shadow-lg ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/50 text-base"
                    />
                </div>

                {/* Promo banner */}
                <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex items-center justify-between max-w-5xl mx-auto hover:bg-white/30 transition-colors cursor-pointer group">
                    <div className="flex-1">
                        <h2 className="text-white font-extrabold text-2xl leading-tight">
                            Sabor Fresco,<br />a un Tap!
                        </h2>
                        <p className="text-white/90 text-sm mt-2 font-medium">
                            Delivery rápido y saludable
                        </p>
                        <Button
                            size="sm"
                            className="mt-4 bg-white text-[#106efd] hover:bg-white/90 hover:scale-105 transition-transform rounded-full text-sm h-9 px-5 font-bold shadow-sm"
                        >
                            Ver Promociones
                        </Button>
                    </div>
                    <div className="w-28 h-28 relative transform group-hover:scale-110 transition-transform duration-300">
                        <Image
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&h=200&auto=format&fit=crop"
                            alt="Healthy food"
                            fill
                            className="object-cover rounded-2xl shadow-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                {/* Categories */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-foreground">Categorías</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm whitespace-nowrap font-semibold transition-all transform hover:scale-[1.02] snap-start ${selectedCategory === cat.id
                                    ? "bg-[#106efd] text-white shadow-md"
                                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-foreground">
                            {searchQuery ? "Resultados de búsqueda" : "Recomendados para ti"}
                        </h3>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-3xl border border-border/50 border-dashed">
                            <p className="text-muted-foreground font-medium">No se encontraron productos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 group rounded-2xl bg-card">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        <div className="relative h-32 md:h-40 w-full overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h4 className="font-bold text-base text-foreground line-clamp-1">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-grow">{product.description}</p>

                                            <div className="flex items-center justify-between mt-4">
                                                <span className="font-black text-lg text-[#106efd]">${product.price.toFixed(2)}</span>
                                                <Button
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl bg-[#40cfde] hover:bg-[#106efd] text-white shadow-sm transition-colors"
                                                    onClick={() => onAddToCart(product)}
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
