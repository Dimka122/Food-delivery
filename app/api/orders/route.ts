import { NextRequest, NextResponse } from "next/server"

// Глобальное хранение заказов (в памяти)
// В реальном приложении используйте базу данных
declare global {
  var __orders__: any[] | undefined
}

// Инициализация массива заказов
if (!global.__orders__) {
  global.__orders__ = []
}

// Типы для заказов
type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  address: string
  items: OrderItem[]
  total: number
  deliveryFee: number
  status: OrderStatus
  paymentMethod: "cash" | "card"
  comment?: string
  createdAt: string
  updatedAt: string
}

// Генерация ID заказа
function generateOrderId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase()
}

// Статусы заказов
export const ORDER_STATUSES: Record<OrderStatus, { label: string; color: string; next?: OrderStatus[] }> = {
  pending: { label: "Ожидает", color: "bg-gray-500", next: ["confirmed", "cancelled"] },
  confirmed: { label: "Подтвержден", color: "bg-blue-500", next: ["preparing", "cancelled"] },
  preparing: { label: "Готовится", color: "bg-yellow-500", next: ["ready", "cancelled"] },
  ready: { label: "Готов", color: "bg-purple-500", next: ["delivering", "cancelled"] },
  delivering: { label: "Доставляется", color: "bg-orange-500", next: ["delivered"] },
  delivered: { label: "Доставлен", color: "bg-green-500", next: [] },
  cancelled: { label: "Отменен", color: "bg-red-500", next: [] },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    
    let orders = global.__orders__ || []
    
    // Фильтрация по статусу
    if (status && status !== "all") {
      orders = orders.filter(order => order.status === status)
    }
    
    // Поиск по имени, телефону или ID
    if (search) {
      const searchLower = search.toLowerCase()
      orders = orders.filter(order => 
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerPhone.includes(search) ||
        order.id.toLowerCase().includes(searchLower)
      )
    }
    
    // Сортировка по дате создания (новые первые)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Ограничение количества
    orders = orders.slice(0, limit)
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    const newOrder: Order = {
      id: generateOrderId(),
      customerName: orderData.name,
      customerPhone: orderData.phone,
      address: [
        orderData.city,
        `вул. ${orderData.street}`,
        `буд. ${orderData.building}`,
        orderData.apartment && `кв. ${orderData.apartment}`,
        orderData.entrance && `під'їзд ${orderData.entrance}`,
        orderData.floor && `поверх ${orderData.floor}`,
      ].filter(Boolean).join(", "),
      items: orderData.items,
      total: orderData.total,
      deliveryFee: orderData.deliveryFee,
      status: "pending",
      paymentMethod: orderData.paymentMethod,
      comment: orderData.comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Добавляем заказ в глобальное хранилище
    if (!global.__orders__) {
      global.__orders__ = []
    }
    global.__orders__.unshift(newOrder)
    
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}