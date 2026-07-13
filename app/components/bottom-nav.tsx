import { Home, ClipboardList, User } from "lucide-react"

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: "inicio", icon: Home },
        { id: "pedidos", icon: ClipboardList },
        { id: "cuenta", icon: User },
    ]

    const activeIndex = tabs.findIndex(t => t.id === activeTab)

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none flex justify-center">
            <div className="bg-background border-t border-border/50 pb-safe pt-2 flex items-center justify-around pointer-events-auto relative w-full h-16 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                
                {/* Top Animated Indicator Line */}
                <div 
                    className="absolute top-0 h-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-300 w-10 rounded-b-full shadow-[0_2px_8px_rgba(37,99,235,0.5)]" 
                    style={{ left: `calc(${(100 / tabs.length) * activeIndex}% + ${(100 / tabs.length) / 2}% - 20px)` }} 
                />
                
                {/* Icons */}
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex-1 flex flex-col items-center justify-center h-full relative z-10 transition-colors tap-highlight-transparent ${isActive ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
