"use client"

import { useState, useEffect } from "react"
import { Categories } from "./categories"
import { FoodCard, type FoodItem } from "./food-card"

interface MenuSectionProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  cart: Record<number, number>
  onAddToCart: (id: number) => void
  onRemoveFromCart: (id: number) => void
}

export function MenuSection({
  activeCategory,
  onCategoryChange,
  cart,
  onAddToCart,
  onRemoveFromCart,
}: MenuSectionProps) {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  return (
    <section id="menu" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Наше меню
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Выберите из широкого ассортимента свежих и вкусных блюд
          </p>
        </div>

        <div className="mb-10">
          <Categories activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка меню...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                quantity={cart[item.id] || 0}
                onAdd={() => onAddToCart(item.id)}
                onRemove={() => onRemoveFromCart(item.id)}
              />
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">В этой категории пока нет товаров</p>
          </div>
        )}
      </div>
    </section>
  )
}
