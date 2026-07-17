"use client";
import React, { createContext, useContext, useState } from "react";
import { CartItem, Product } from "@/lib/data";

interface CartContextType {
    cart: CartItem[];
    cartCount: number;
    handleAddToCart: (product: Product) => void;
    handleAddMultipleToCart: (items: { product: Product, quantity: number }[]) => void;
    handleUpdateQuantity: (id: number, delta: number) => void;
    handleCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const handleAddToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { id: product.id, name: product.nombre, price: product.precioVenta, quantity: 1 }]
        })
    }

    const handleAddMultipleToCart = (items: { product: Product, quantity: number }[]) => {
        if (!items) return;
        setCart((prev) => {
            let nextCart = [...prev];
            items.forEach(({ product, quantity }) => {
                const existingIndex = nextCart.findIndex((item) => item.id === product.id);
                if (existingIndex >= 0) {
                    nextCart[existingIndex] = {
                        ...nextCart[existingIndex],
                        quantity: nextCart[existingIndex].quantity + quantity
                    };
                } else {
                    nextCart.push({
                        id: product.id,
                        name: product.nombre,
                        price: product.precioVenta,
                        quantity: quantity
                    });
                }
            });
            return nextCart;
        });
    }

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + delta
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
                    }
                    return item
                })
                .filter((item): item is CartItem => item !== null)
        })
    }

    const handleCheckout = () => {
        setCart([])
    }

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            handleAddToCart,
            handleAddMultipleToCart,
            handleUpdateQuantity,
            handleCheckout
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
