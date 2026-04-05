import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface OrderMessage {
  name: string
  phone: string
  city: string
  street: string
  building: string
  apartment?: string
  entrance?: string
  floor?: string
  comment?: string
  paymentMethod: string
  items: { name: string; price: number; quantity: number }[]
  total: number
  deliveryFee: number
}

export async function sendOrderToTelegram(order: OrderMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local")
    return false
  }

  const itemsText = order.items
    .map(item => `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₴`)
    .join("\n")

  const address = [
    order.city,
    order.street,
    order.building,
    order.apartment && `кв. ${order.apartment}`,
    order.entrance && `під'їзд ${order.entrance}`,
    order.floor && `поверх ${order.floor}`,
  ].filter(Boolean).join(", ")

  const message = `
🍕 *Новый заказ!*

👤 *Клиент:* ${order.name}
📱 *Телефон:* ${order.phone}
📍 *Адрес:* ${address}
💳 *Оплата:* ${order.paymentMethod === "card" ? "Карта онлайн" : "Наличные"}

${order.comment ? `📝 *Комментарий:* ${order.comment}` : ""}

*Товары:*
${itemsText}

💰 *Сумма:* ${order.total}₴
🚚 *Доставка:* ${order.deliveryFee === 0 ? "Бесплатно" : order.deliveryFee + "₴"}
📦 *Итого:* ${order.total + order.deliveryFee}₴
  `.trim()

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("Telegram API error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Telegram send error:", error)
    return false
  }
}
