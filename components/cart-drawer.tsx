"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { menuItems, type FoodItem } from "./menu-section"
import { CheckoutForm } from "./checkout-form"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: Record<number, number>
  onAddToCart: (id: number) => void
  onRemoveFromCart: (id: number) => void
  onClearCart: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false)

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => {
      const item = menuItems.find((i) => i.id === Number(id)) as FoodItem
      return { ...item, quantity }
    })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = total >= 1000 ? 0 : 199

  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/50 z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-card z-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {showCheckout ? (
            <CheckoutForm
              cart={cart}
              onBack={() => setShowCheckout(false)}
              onOrderComplete={() => {
                onClearCart()
                setShowCheckout(false)
                onClose()
              }}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Кошик</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">Кошик порожній</p>
                    <p className="text-muted-foreground">Додайте щось смачненьке!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-secondary rounded-xl">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                          <p className="text-primary font-bold">{item.price} ₴</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 bg-transparent"
                              onClick={() => onRemoveFromCart(item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onAddToCart(item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{item.price * item.quantity} ₴</p>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={onClearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Очистити кошик
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Підсумок</span>
                      <span>{total} ₴</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Доставка</span>
                      <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                        {deliveryFee === 0 ? "Безкоштовно" : `${deliveryFee} ₴`}
                      </span>
                    </div>
                    {total < 1000 && (
                      <p className="text-xs text-muted-foreground">
                        Додайте ще на {1000 - total} ₴ для безкоштовної доставки
                      </p>
                    )}
                    <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                      <span>Разом</span>
                      <span>{total + deliveryFee} ₴</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                    Оформити замовлення
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
