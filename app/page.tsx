"use client"

import { useState } from "react"
import { useAppState } from "./hooks/use-app-state"
import { AuthScreen } from "./components/auth-screen"
import { HomeTab } from "./components/home-tab"
import { OrdersTab } from "./components/orders-tab"
import { AccountTab } from "./components/account-tab"
import { BottomNav } from "./components/bottom-nav"
import { DesktopSidebar } from "./components/desktop-sidebar"
import { FloatingCart } from "./components/floating-cart"
import { CheckoutView } from "./components/checkout-view"
import { useCheckout, CheckoutFormData } from "@/hooks/use-checkout"

export default function App() {
  const {
    authState,
    setAuthState,
    activeTab,
    setActiveTab,
    cart,
    handleAddToCart,
    handleUpdateQuantity,
    handleCheckout
  } = useAppState()

  const [showCheckout, setShowCheckout] = useState(false)
  const { submitOrder, loading: isSubmitting, error: submitError } = useCheckout()

  if (authState === "login") {
    return <AuthScreen onLogin={() => setAuthState("authenticated")} onGuest={() => setAuthState("guest")} />
  }

  const isGuest = authState === "guest"
  const handleLogout = () => {
    setAuthState("login")
    setActiveTab("inicio")
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleConfirmOrder = async (formData: CheckoutFormData) => {
    try {
      await submitOrder(cart, formData)
      handleCheckout()
      setShowCheckout(false)
    } catch (err) {
      console.error("Order processing failed:", err)
    }
  }

  if (showCheckout) {
    return (
      <CheckoutView
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onConfirm={handleConfirmOrder}
        onBack={() => setShowCheckout(false)}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isGuest={isGuest}
      />

      <main className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        {activeTab === "inicio" && <HomeTab onAddToCart={handleAddToCart} />}
        {activeTab === "pedidos" && <OrdersTab />}
        {activeTab === "cuenta" && <AccountTab isGuest={isGuest} onLogout={handleLogout} />}
      </main>

      {activeTab === "inicio" && (
        <FloatingCart 
          cart={cart} 
          total={total} 
          onCheckout={() => setShowCheckout(true)} 
        />
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}
