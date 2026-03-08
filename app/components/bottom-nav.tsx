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
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-4 pb-safe z-50 lg:hidden">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                                isActive 
                                    ? "text-foreground" 
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-[11px] font-medium">
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
