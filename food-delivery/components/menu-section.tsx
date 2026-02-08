"use client"

import { Categories } from "./categories"
import { FoodCard, type FoodItem } from "./food-card"

export const menuItems: FoodItem[] = [
  {
    id: 1,
    name: "Пепперони",
    description: "Классическая пицца с пепперони, моцареллой и томатным соусом",
    price: 599,
    image: "🍕",
    category: "pizza",
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 2,
    name: "Маргарита",
    description: "Томаты, моцарелла, базилик и оливковое масло",
    price: 499,
    image: "🍕",
    category: "pizza",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Четыре сыра",
    description: "Моцарелла, пармезан, горгонзола и эмменталь",
    price: 699,
    image: "🍕",
    category: "pizza",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Классический бургер",
    description: "Сочная говяжья котлета, сыр чеддер, свежие овощи и фирменный соус",
    price: 399,
    image: "🍔",
    category: "burgers",
    rating: 4.8,
    isPopular: true,
  },
  {
    id: 5,
    name: "Чикен бургер",
    description: "Хрустящая куриная котлета, салат айсберг, томаты и соус барбекю",
    price: 349,
    image: "🍔",
    category: "burgers",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Двойной бургер",
    description: "Две котлеты, двойной сыр, бекон и специальный соус",
    price: 549,
    image: "🍔",
    category: "burgers",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Филадельфия",
    description: "Лосось, сливочный сыр, огурец и авокадо - 8 шт",
    price: 649,
    image: "🍣",
    category: "sushi",
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 8,
    name: "Калифорния",
    description: "Крабовое мясо, авокадо, огурец и икра тобико - 8 шт",
    price: 599,
    image: "🍣",
    category: "sushi",
    rating: 4.7,
  },
  {
    id: 9,
    name: "Дракон",
    description: "Угорь, огурец, авокадо и унаги соус - 8 шт",
    price: 749,
    image: "🍣",
    category: "sushi",
    rating: 4.8,
  },
  {
    id: 10,
    name: "Цезарь",
    description: "Куриное филе, салат романо, пармезан, крутоны и соус цезарь",
    price: 399,
    image: "🥗",
    category: "salads",
    rating: 4.6,
  },
  {
    id: 11,
    name: "Греческий",
    description: "Огурцы, томаты, маслины, фета и оливковое масло",
    price: 349,
    image: "🥗",
    category: "salads",
    rating: 4.5,
  },
  {
    id: 12,
    name: "Тирамису",
    description: "Классический итальянский десерт с маскарпоне и кофе",
    price: 299,
    image: "🍰",
    category: "desserts",
    rating: 4.9,
    isPopular: true,
  },
  {
    id: 13,
    name: "Чизкейк",
    description: "Нежный чизкейк с ягодным соусом",
    price: 279,
    image: "🍰",
    category: "desserts",
    rating: 4.7,
  },
  {
    id: 14,
    name: "Кола",
    description: "Освежающий напиток 0.5л",
    price: 99,
    image: "🥤",
    category: "drinks",
    rating: 4.5,
  },
  {
    id: 15,
    name: "Свежевыжатый сок",
    description: "Апельсиновый или яблочный сок 0.3л",
    price: 199,
    image: "🥤",
    category: "drinks",
    rating: 4.8,
  },
]

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
      </div>
    </section>
  )
}
