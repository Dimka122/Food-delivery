"use client"

import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "Все", emoji: "🍽️" },
  { id: "pizza", name: "Пицца", emoji: "🍕" },
  { id: "burgers", name: "Бургеры", emoji: "🍔" },
  { id: "sushi", name: "Суши", emoji: "🍣" },
  { id: "salads", name: "Салаты", emoji: "🥗" },
  { id: "desserts", name: "Десерты", emoji: "🍰" },
  { id: "drinks", name: "Напитки", emoji: "🥤" },
]

interface CategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-card text-foreground hover:bg-secondary border border-border"
          )}
        >
          <span className="text-xl">{category.emoji}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}
