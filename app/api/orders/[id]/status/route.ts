import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/orders-data"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    console.log("=== PATCH /api/orders/[id]/status ===")
    console.log("Looking for order ID:", id)
    
    const orders = getOrders()
    console.log("Total orders in storage:", orders.length)
    console.log("Order IDs:", orders.map(o => o.id))
    
    const orderIndex = orders.findIndex(order => order.id === id)
    
    if (orderIndex === -1) {
      console.log("Order NOT FOUND!")
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    
    console.log("Order found at index:", orderIndex)
    
    const currentOrder = orders[orderIndex]
    
    // Обновляем статус
    orders[orderIndex] = {
      ...currentOrder,
      status: status,
      updatedAt: new Date().toISOString(),
    }
    
    return NextResponse.json(orders[orderIndex])
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}