import { Home, ShoppingBag, User } from "lucide-react"

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
    cartCount: number
}

export function BottomNav({ activeTab, onTabChange, cartCount }: BottomNavProps) {
    const tabs = [
        { id: "inicio", label: "Inicio", icon: Home },
        { id: "pedido", label: "Pedido", icon: ShoppingBag },
        { id: "cuenta", label: "Cuenta", icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-6 pb-safe z-50 lg:hidden">
            <div className="flex justify-around items-center h-20 max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-20 
                ${isActive ? "text-[#106efd]" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <div className="relative">
                                <div className={`absolute inset-0 bg-[#106efd]/10 rounded-xl transition-all duration-300 transform ${isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"} -m-3`} />
                                <Icon className={`h-6 w-6 relative z-10 transition-transform duration-300 ${isActive ? "transform -translate-y-1" : ""}`} />
                                {tab.id === "pedido" && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 h-[18px] min-w-[18px] px-1 rounded-full bg-[#40cfde] text-white text-[10px] flex items-center justify-center font-black shadow-sm z-20">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[11px] mt-1 font-bold transition-all duration-300 ${isActive ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-1 absolute"}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
