import { Home, ClipboardList, User } from "lucide-react"

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: "inicio", label: "Inicio", icon: Home },
        { id: "pedidos", label: "Mis Pedidos", icon: ClipboardList },
        { id: "cuenta", label: "Cuenta", icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass border-x-0 border-b-0 px-4 pb-safe z-50 lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 py-1 px-4 rounded-xl transition-all duration-300 ${
                                isActive 
                                    ? "text-primary scale-110" 
                                    : "text-muted-foreground hover:text-foreground active:scale-90"
                            }`}
                        >
                            <Icon className={`h-5 w-5 transition-transform ${isActive ? "fill-primary/10 stroke-[2.5px]" : "stroke-2"}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-70"}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
