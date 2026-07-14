import { X } from "lucide-react"

interface ActivePromoBannerProps {
    selectedPromo: any;
    onClearPromo: () => void;
    onAddMultipleToCart?: (items: any[]) => void;
}

export function ActivePromoBanner({ selectedPromo, onClearPromo, onAddMultipleToCart }: ActivePromoBannerProps) {
    if (!selectedPromo) return null;

    return (
        <div className="mb-6 bg-primary-100 rounded-2xl p-3 flex justify-between items-center border border-primary-200">
            <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] text-primary-700 font-bold uppercase">Viendo promo</span>
                <h3 className="font-bold text-neutral-900 text-sm truncate">{selectedPromo.nombre}</h3>
            </div>
            <div className="flex gap-2 shrink-0">
                {onAddMultipleToCart && selectedPromo.isFixedPromoOnly && (
                    <button 
                        onClick={() => { 
                            onAddMultipleToCart(selectedPromo.productos); 
                            onClearPromo(); 
                        }} 
                        className="bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                    >
                        Llevar Todo
                    </button>
                )}
                <button onClick={onClearPromo} className="bg-white p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600">
                    <X className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
}
