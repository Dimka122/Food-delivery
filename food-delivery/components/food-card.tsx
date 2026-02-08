"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Star } from "lucide-react"

export interface FoodItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  isPopular?: boolean
}

interface FoodCardProps {
  item: FoodItem
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

export function FoodCard({ item, quantity, onAdd, onRemove }: FoodCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
          {item.image}
        </div>
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
            Хит продаж
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{item.price} ₴</span>
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-9 w-9 bg-transparent" onClick={onRemove}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <Button size="icon" className="h-9 w-9" onClick={onAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              В корзину
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
