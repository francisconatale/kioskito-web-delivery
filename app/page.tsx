"use client"

import { useAppState } from "./hooks/use-app-state"
import { AuthScreen } from "./components/auth-screen"
import { HomeTab } from "./components/home-tab"
import { OrderTab } from "./components/order-tab"
import { AccountTab } from "./components/account-tab"
import { BottomNav } from "./components/bottom-nav"
import { DesktopSidebar } from "./components/desktop-sidebar"

export default function App() {
  const {
    authState,
    setAuthState,
    activeTab,
    setActiveTab,
    cart,
    cartCount,
    handleAddToCart,
    handleUpdateQuantity,
    handleCheckout
  } = useAppState()

  if (authState === "login") {
    return <AuthScreen onLogin={() => setAuthState("authenticated")} onGuest={() => setAuthState("guest")} />
  }

  const isGuest = authState === "guest"
  const handleLogout = () => {
    setAuthState("login")
    setActiveTab("inicio")
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isGuest={isGuest}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide">
        <div className="flex-1">
          {activeTab === "inicio" && <HomeTab onAddToCart={handleAddToCart} />}
          {activeTab === "cuenta" && <AccountTab isGuest={isGuest} onLogout={handleLogout} />}

          {/* Mobile Cart View */}
          <div className="lg:hidden">
            {activeTab === "pedido" && (
              <OrderTab
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
                isDesktop={false}
              />
            )}
          </div>
        </div>
      </main>

      {/* Desktop Cart Panel */}
      <aside className="w-80 bg-card border-l border-border h-screen sticky top-0 hidden lg:flex flex-col">
        <OrderTab
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
          isDesktop={true}
        />
      </aside>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartCount}
      />
    </div>
  )
}
