"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MenuSection } from "@/components/menu-section"
import { CartDrawer } from "@/components/cart-drawer"
import { Footer } from "@/components/footer"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [cart, setCart] = useState<Record<number, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newQty = (prev[id] || 0) - 1
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newQty }
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <MenuSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={(id) => {
          const token = localStorage.getItem('jwt')
          if (!token) {
            // redirect to login page or handle unauthorized access
            return
          }
          removeFromCart(id)
        }}
      />
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
      />
    </main>
  )
}
