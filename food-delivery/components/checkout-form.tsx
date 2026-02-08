"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, User, Phone, CreditCard, Clock, CheckCircle2 } from "lucide-react"
import { menuItems, type FoodItem } from "./menu-section"

interface CheckoutFormProps {
  cart: Record<number, number>
  onBack: () => void
  onOrderComplete: () => void
}

interface FormData {
  name: string
  phone: string
  city: string
  street: string
  building: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  paymentMethod: "cash" | "card"
}

export function CheckoutForm({ cart, onBack, onOrderComplete }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    city: "Київ",
    street: "",
    building: "",
    apartment: "",
    entrance: "",
    floor: "",
    comment: "",
    paymentMethod: "card",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => {
      const item = menuItems.find((i) => i.id === Number(id)) as FoodItem
      return { ...item, quantity }
    })

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = total >= 1000 ? 0 : 199

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const orderData = {
        ...formData,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        deliveryFee,
      }

      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Помилка відправки замовлення")
      }

      setIsSuccess(true)

      setTimeout(() => {
        onOrderComplete()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Щось пішло не так")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.phone && formData.street && formData.building

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Замовлення прийнято!</h2>
        <p className="text-muted-foreground mb-4">
          Очікуйте дзвінок оператора для підтвердження
        </p>
        <div className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Орієнтовний час доставки: 45-60 хв</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Оформлення замовлення</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <User className="h-5 w-5 text-primary" />
            <span>Контактні дані</span>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ім&apos;я *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Введіть ваше ім'я"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+380 (99) 123-45-67"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Адреса доставки</span>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Місто</Label>
              <Input
                id="city"
                name="city"
                placeholder="Київ"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Вулиця *</Label>
              <Input
                id="street"
                name="street"
                placeholder="Назва вулиці"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="building">Будинок *</Label>
                <Input
                  id="building"
                  name="building"
                  placeholder="№"
                  value={formData.building}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">Квартира</Label>
                <Input
                  id="apartment"
                  name="apartment"
                  placeholder="№"
                  value={formData.apartment}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="entrance">Під&apos;їзд</Label>
                <Input
                  id="entrance"
                  name="entrance"
                  placeholder="№"
                  value={formData.entrance}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Поверх</Label>
                <Input
                  id="floor"
                  name="floor"
                  placeholder="№"
                  value={formData.floor}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Коментар до замовлення</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Додаткові побажання..."
                value={formData.comment}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Спосіб оплати</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "card" }))}
              className={`p-4 rounded-xl border-2 transition-colors text-left ${
                formData.paymentMethod === "card"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <CreditCard className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium text-foreground">Картка</p>
              <p className="text-sm text-muted-foreground">Онлайн оплата</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "cash" }))}
              className={`p-4 rounded-xl border-2 transition-colors text-left ${
                formData.paymentMethod === "cash"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-2xl mb-2 block">💵</span>
              <p className="font-medium text-foreground">Готівка</p>
              <p className="text-sm text-muted-foreground">При отриманні</p>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 p-4 bg-secondary rounded-xl">
          <h3 className="font-semibold text-foreground">Ваше замовлення</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} x{item.quantity}
              </span>
              <span className="text-foreground">{item.price * item.quantity} ₴</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Підсумок</span>
              <span className="text-foreground">{total} ₴</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "text-foreground"}>
                {deliveryFee === 0 ? "Безкоштовно" : `${deliveryFee} ₴`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Разом</span>
              <span className="text-primary">{total + deliveryFee} ₴</span>
            </div>
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="p-4 border-t border-border space-y-3">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Оформлення..." : `Підтвердити замовлення • ${total + deliveryFee} ₴`}
        </Button>
      </div>
    </div>
  )
}
