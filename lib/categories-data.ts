export const categories = [
  { id: "all", name: "Все", emoji: "🍽️" },
  { id: "pizza", name: "Пицца", emoji: "🍕" },
  { id: "burgers", name: "Бургеры", emoji: "🍔" },
  { id: "sushi", name: "Суши", emoji: "🍣" },
  { id: "salads", name: "Салаты", emoji: "🥗" },
  { id: "desserts", name: "Десерты", emoji: "🍰" },
  { id: "drinks", name: "Напитки", emoji: "🥤" },
]

export type Category = {
  id: string
  name: string
  emoji: string
}
