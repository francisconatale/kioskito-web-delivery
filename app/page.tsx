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
    <div className="min-h-screen relative bg-background flex w-full flex-col lg:flex-row max-w-[1600px] mx-auto overflow-hidden selection:bg-[#106efd]/30">
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isGuest={isGuest}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full relative pb-16 lg:pb-0 scrollbar-hide bg-muted/10">
        {/* Vistas principales */}
        <div className="w-full flex-1">
          {activeTab === "inicio" && <HomeTab onAddToCart={handleAddToCart} />}
          {activeTab === "cuenta" && <AccountTab isGuest={isGuest} onLogout={handleLogout} />}

          {/* Vista Móvil del Carrito */}
          <div className="lg:hidden h-full w-full">
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

      <aside className="w-[400px] bg-card border-l border-border h-screen sticky top-0 hidden lg:flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-20">
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
