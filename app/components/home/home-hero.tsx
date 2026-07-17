import { Search, MapPin, ShoppingCart, X } from "lucide-react"

interface HomeHeroProps {
    user: any;
    displayAddress: string | undefined;
    cartCount: number;
    searchQuery: string;
    onOpenAddressModal: () => void;
    onCheckout: () => void;
    onSearchChange: (val: string) => void;
    onSearchSubmit: () => void;
    onSearchClear: () => void;
}

export function HomeHero({
    user,
    displayAddress,
    cartCount,
    searchQuery,
    onOpenAddressModal,
    onCheckout,
    onSearchChange,
    onSearchSubmit,
    onSearchClear
}: HomeHeroProps) {
    return (
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-b-[2.5rem] lg:rounded-b-[3rem] pt-6 pb-8 px-5 lg:px-8 shadow-[0_10px_40px_rgba(37,99,235,0.2)] mb-8 relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute top-20 -left-10 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-md lg:max-w-5xl xl:max-w-6xl mx-auto relative z-10">
                {user && displayAddress && (
                    <div 
                        onClick={onOpenAddressModal}
                        className="flex items-center text-white/90 text-sm mb-4 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 cursor-pointer hover:bg-white/20 transition-colors shadow-sm"
                    >
                        <MapPin className="w-4 h-4 mr-1.5 text-blue-200" />
                        <span className="truncate max-w-[200px]">{displayAddress}</span>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-1 leading-none tracking-tight drop-shadow-md">
                            Hola,<br/><span className="text-cyan-100">{user ? user.nombre.split(' ')[0] : 'Invitado'}</span>
                        </h1>
                        <p className="text-white/80 font-medium text-sm lg:text-base">Es hora de un buen pedido.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="bg-black/20 backdrop-blur-xl p-3 rounded-2xl shadow-inner w-full lg:w-72 flex items-center border border-white/10 focus-within:bg-white/20 focus-within:border-white/30 transition-all group">
                            <Search className="text-white/70 group-focus-within:text-white w-5 h-5 ml-1 shrink-0 transition-colors cursor-pointer" onClick={onSearchSubmit} />
                            <input 
                                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-white placeholder:text-white/50 transition-colors" 
                                placeholder="Buscar..." 
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                            />
                            {searchQuery && <X className="w-4 h-4 text-white/50 hover:text-white cursor-pointer mr-1 transition-colors" onClick={onSearchClear} />}
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="bg-white/10 backdrop-blur-xl p-2.5 rounded-2xl shadow-lg cursor-pointer shrink-0 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all relative"
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

            </div>
        </div>
    );
}
