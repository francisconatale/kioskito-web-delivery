import { Loader2 } from "lucide-react"

interface PromoListProps {
    promotions: any[];
    addingPromoId: number | null;
    onPromoClick: (promo: any) => void;
}

export function PromoList({ promotions, addingPromoId, onPromoClick }: PromoListProps) {
    if (promotions.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
                <h2 className="font-display font-bold text-xl text-neutral-900">Promociones</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible pb-4 -mx-5 px-5 lg:mx-0 lg:px-0 scrollbar-hide">
                {promotions.map((promo) => {
                    const isAdding = addingPromoId === promo.id;
                    return (
                        <div 
                            key={promo.id} 
                            onClick={() => onPromoClick(promo)}
                            className="shrink-0 w-48 lg:w-auto rounded-2xl p-4 bg-gradient-to-tr from-primary-500 to-primary-700 text-white shadow-md relative cursor-pointer hover:shadow-lg transition-all"
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
    );
}
