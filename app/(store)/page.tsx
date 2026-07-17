"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { HomeTab } from "@/app/components/home-tab"
import { CheckoutView } from "@/app/components/checkout-view"
import { useCheckout, CheckoutFormData } from "@/hooks/use-checkout"
import { SuccessView } from "@/app/components/success-view"
import { useHorarios } from "@/hooks/use-horarios"
import { NEGOCIO_ID } from '@/lib/config'
import { useRouter } from 'next/navigation'

export default function StoreHomePage() {
  const {
    cart,
    cartCount,
    handleAddToCart,
    handleAddMultipleToCart,
    handleUpdateQuantity,
    handleCheckout
  } = useCart()

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { submitOrder, loading: isSubmitting, error: submitError } = useCheckout()
  const { isAbierto } = useHorarios(NEGOCIO_ID);
  const router = useRouter();

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
          router.push("/")
        }}
        onViewOrders={() => {
          setShowSuccess(false)
          router.push("/pedidos")
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
    <>
      {!isAbierto && (
        <div className="sticky top-0 w-full bg-red-500/90 text-white p-3 text-center text-sm font-medium shadow-sm z-50 backdrop-blur-sm">
          Actualmente nos encontramos cerrados. Podés armar tu carrito y hacer tu pedido más tarde.
        </div>
      )}
      <HomeTab 
          onAddToCart={handleAddToCart} 
          onAddMultipleToCart={handleAddMultipleToCart} 
          cartCount={cartCount}
          onCheckout={() => setShowCheckout(true)}
      />
    </>
  )
}
