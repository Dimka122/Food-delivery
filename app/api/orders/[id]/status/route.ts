import { NextRequest, NextResponse } from "next/server"

// Определение статусов заказов
const ORDER_STATUSES = {
  pending: { label: "Ожидает", color: "bg-gray-500", next: ["confirmed", "cancelled"] },
  confirmed: { label: "Подтвержден", color: "bg-blue-500", next: ["preparing", "cancelled"] },
  preparing: { label: "Готовится", color: "bg-yellow-500", next: ["ready", "cancelled"] },
  ready: { label: "Готов", color: "bg-purple-500", next: ["delivering", "cancelled"] },
  delivering: { label: "Доставляется", color: "bg-orange-500", next: ["delivered"] },
  delivered: { label: "Доставлен", color: "bg-green-500", next: [] },
  cancelled: { label: "Отменен", color: "bg-red-500", next: [] },
} as const

declare global {
  var __orders__: any[] | undefined
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await request.json()
    
    if (!global.__orders__) {
      global.__orders__ = []
    }
    
    const orderIndex = global.__orders__.findIndex(order => order.id === id)
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    const currentOrder = global.__orders__[orderIndex]
    const currentStatus = currentOrder.status as keyof typeof ORDER_STATUSES
    const newStatus = status as keyof typeof ORDER_STATUSES
    
    // Проверяем валидность перехода статуса
    const validNextStatuses = ORDER_STATUSES[currentStatus]?.next || []
    if (!validNextStatuses.includes(newStatus)) {
      return NextResponse.json({ 
        error: `Cannot change status from ${ORDER_STATUSES[currentStatus].label} to ${ORDER_STATUSES[newStatus].label}` 
      }, { status: 400 })
    }
    
    // Обновляем статус и время
    global.__orders__[orderIndex] = {
      ...currentOrder,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }
    
    return NextResponse.json(global.__orders__[orderIndex])
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}