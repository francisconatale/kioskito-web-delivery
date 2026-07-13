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
        <nav className="fixed bottom-6 left-0 right-0 px-6 z-50 lg:hidden pointer-events-none flex justify-center animate-in slide-in-from-bottom-4 duration-500">
            {/* The Solid Vibrant Pill */}
            <div className="bg-blue-600 rounded-full flex items-center justify-around pointer-events-auto relative w-full max-w-sm h-16 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)]">
                
                {/* The "Gooey" Bump */}
                <div 
                    className="absolute -top-[18px] w-14 h-14 bg-blue-600 rounded-full transition-all duration-500 ease-out z-0 flex items-center justify-center"
                    style={{ 
                        left: `calc(${(100 / tabs.length) * activeIndex}% + ${(100 / tabs.length) / 2}% - 28px)` 
                    }}
                >
                    {/* Inner glow ring */}
                    <div className="w-11 h-11 rounded-full bg-white/20 shadow-inner" />
                    
                    {/* SVG Curve Connectors for the smooth gooey effect */}
                    <svg width="24" height="24" viewBox="0 0 24 24" className="absolute top-[14px] -left-[23px] fill-blue-600">
                        <path d="M 24 0 C 24 12 12 24 0 24 L 24 24 Z" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" className="absolute top-[14px] -right-[23px] fill-blue-600">
                        <path d="M 0 0 C 0 12 12 24 24 24 L 0 24 Z" />
                    </svg>
                </div>

                {/* Icons */}
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className="flex-1 flex flex-col items-center justify-center h-full relative z-10 transition-all duration-300 tap-highlight-transparent"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <Icon className={`w-6 h-6 transition-all duration-500 ease-out ${
                                isActive 
                                    ? "text-white -translate-y-[18px]" 
                                    : "text-white/60 hover:text-white"
                            }`} />
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
