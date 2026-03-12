"use client"

import { useState } from "react"
import { useAppState } from "./hooks/use-app-state"
import { AuthScreen } from "./components/auth-screen"
import { HomeTab } from "./components/home-tab"
import { OrdersTab } from "./components/orders-tab"
import { AccountTab } from "./components/account-tab"
import { AddressesTab } from "./components/addresses-tab"
import { BottomNav } from "./components/bottom-nav"
import { DesktopSidebar } from "./components/desktop-sidebar"
import { FloatingCart } from "./components/floating-cart"
import { CheckoutView } from "./components/checkout-view"
import { useCheckout, CheckoutFormData } from "@/hooks/use-checkout"
import { useAuth } from "@/hooks/use-auth"
import { usePromotions } from "./hooks/use-promotions"
import { SuccessView } from "./components/success-view"

export default function App() {
  const {
    activeTab,
    setActiveTab,
    cart,
    handleAddToCart,
    handleAddMultipleToCart,
    handleUpdateQuantity,
    handleCheckout
  } = useAppState()
  const { promotionalTotal, loading: loadingPromos } = usePromotions(cart)

  const { authState, setAsGuest, logout, isResolvingAuth } = useAuth()

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { submitOrder, loading: isSubmitting, error: submitError } = useCheckout()

  if (isResolvingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Cargando sesión...</p>
        </div>
      </div>
    )
  }

  if (authState === "login") {
    return <AuthScreen />
  }

  const isGuest = authState === "guest"
  const handleLogout = () => {
    logout()
  }

  const handleConfirmOrder = async (formData: CheckoutFormData) => {
    try {
      await submitOrder(cart, formData)
      handleCheckout()
      setShowCheckout(false)
      setShowSuccess(true)
    } catch (err) {
      console.error("Order processing failed:", err)
    }
  }

  if (showSuccess) {
    return (
      <SuccessView 
        onBackToHome={() => {
          setShowSuccess(false)
          setActiveTab("inicio")
        }}
        onViewOrders={() => {
          setShowSuccess(false)
          setActiveTab("pedidos")
        }}
      />
    )
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
      />

      <main className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        {activeTab === "inicio" && <HomeTab onAddToCart={handleAddToCart} onAddMultipleToCart={handleAddMultipleToCart} />}
        {activeTab === "pedidos" && <OrdersTab />}
        {activeTab === "cuenta" && <AccountTab onTabChange={setActiveTab} />}
        {activeTab === "direcciones" && <AddressesTab onBack={() => setActiveTab("cuenta")} />}
      </main>

      {activeTab === "inicio" && (
        <FloatingCart 
          cart={cart} 
          total={promotionalTotal} 
          onCheckout={() => setShowCheckout(true)} 
          loading={loadingPromos}
        />
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}
