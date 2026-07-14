import { Loader2, Plus, Check } from "lucide-react"
import Image from "next/image"

interface ProductListProps {
    products: any[];
    searchQuery: string;
    submittedSearchQuery: string;
    selectedPromo: any;
    loading: boolean;
    hasMore: boolean;
    loadingMore: boolean;
    addedProductId: number | null;
    getPromoForProduct: (id: number) => any;
    onAddToCart: (product: any, e?: React.MouseEvent) => void;
    onLoadMore: () => void;
}

export function ProductList({
    products,
    searchQuery,
    submittedSearchQuery,
    selectedPromo,
    loading,
    hasMore,
    loadingMore,
    addedProductId,
    getPromoForProduct,
    onAddToCart,
    onLoadMore
}: ProductListProps) {
    return (
        <div className="mt-4">
            <div className="flex justify-between items-end mb-3">
                <h2 className="font-display font-bold text-xl text-neutral-900">
                    {searchQuery ? 'Resultados de búsqueda' : selectedPromo ? 'Productos de la promo' : 'Para ti'}
                </h2>
            </div>
            
            {(loading || searchQuery !== submittedSearchQuery) && !selectedPromo ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-primary-700 animate-spin" /></div>
            ) : products.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-sm">No encontramos productos.</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map((product: any) => {
                        const promo = getPromoForProduct(product.id);
                        return (
                            <div key={product.id} className="bg-white p-2.5 rounded-2xl flex items-center shadow-sm relative group cursor-pointer hover:shadow-md transition-shadow" onClick={(e) => onAddToCart(product, e as unknown as React.MouseEvent)}>
                                <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                                    {product.image ? (
                                        <Image src={product.image} alt={product.nombre} fill className="object-cover" />
                                    ) : (
                                        <span className="text-lg font-bold text-neutral-300">{product.nombre.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-neutral-900 truncate">{product.nombre}</h3>
                                    <span className="text-[10px] text-neutral-500 block truncate mb-1">{product.descripcion}</span>
                                    {promo ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral-400 line-through text-xs">${product.precioVenta?.toFixed(2)}</span>
                                            <span className="text-red-600 font-bold text-sm">${promo.precioPromocional?.toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-primary-700 font-bold text-sm">${product.precioVenta?.toFixed(2)}</span>
                                    )}
                                </div>
                                <button 
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0 transition-colors ${addedProductId === product.id ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-100'}`} 
                                    onClick={(e) => onAddToCart(product, e)}
                                >
                                    {addedProductId === product.id ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {!selectedPromo && hasMore && (
                <div className="py-6 flex justify-center">
                    <button onClick={onLoadMore} disabled={loadingMore} className="bg-white border border-neutral-200 text-primary-700 font-bold px-4 py-2 rounded-xl text-sm shadow-sm flex items-center gap-2 hover:bg-neutral-50">
                        {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Ver más
                    </button>
                </div>
            )}
        </div>
    );
}
