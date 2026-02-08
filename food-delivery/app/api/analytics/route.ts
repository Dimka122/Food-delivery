import { NextRequest, NextResponse } from "next/server"
import { menuItems } from "@/components/menu-section"

declare global {
  var __orders__: any[] | undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d" // 7d, 30d, 90d
    
    if (!global.__orders__) {
      global.__orders__ = []
    }
    
    const orders = global.__orders__
    
    // Фильтрация по периоду
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= startDate
    )
    
    // Подготовка данных для графиков
    const salesData = generateSalesData(filteredOrders, days)
    const categoryStats = generateCategoryStats(filteredOrders)
    const topProducts = generateTopProducts(filteredOrders)
    const customerStats = generateCustomerStats(filteredOrders)
    const orderStats = generateOrderStats(filteredOrders)
    
    return NextResponse.json({
      sales: salesData,
      categories: categoryStats,
      topProducts,
      customers: customerStats,
      orders: orderStats,
      period,
      totalOrders: filteredOrders.length,
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

function generateSalesData(orders: any[], days: number) {
  const data = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })
    
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate.toDateString() === date.toDateString()
    })
    
    const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
    const customers = new Set(dayOrders.map(order => order.customerPhone)).size
    
    data.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue,
      customers,
    })
  }
  
  return data
}

function generateCategoryStats(orders: any[]) {
  const categoryMap = new Map()
  
  // Инициализация категорий из menuItems
  menuItems.forEach(item => {
    categoryMap.set(item.category, { orders: 0, revenue: 0, items: 0 })
  })
  
  // Подсчет по заказам
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      // Находим категорию товара
      const menuItem = menuItems.find(menuItem => menuItem.name === item.name)
      if (menuItem) {
        const category = categoryMap.get(menuItem.category)
        if (category) {
          category.orders += 1
          category.revenue += item.price * item.quantity
          category.items += item.quantity
        }
      }
    })
  })
  
  // Преобразование в массив с названиями категорий
  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    name: getCategoryName(category),
    ...stats,
  }))
}

function generateTopProducts(orders: any[]) {
  const productMap = new Map()
  
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      if (!productMap.has(item.name)) {
        productMap.set(item.name, { orders: 0, revenue: 0, quantity: 0 })
      }
      const product = productMap.get(item.name)
      product.orders += 1
      product.revenue += item.price * item.quantity
      product.quantity += item.quantity
    })
  })
  
  return Array.from(productMap.entries())
    .map(([name, stats]) => ({
      name,
      ...stats,
      rating: 4.5 + Math.random() * 0.4, // Мок рейтинг для демонстрации
    }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10)
}

function generateCustomerStats(orders: any[]) {
  const customerMap = new Map()
  
  orders.forEach(order => {
    const phone = order.customerPhone
    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        name: order.customerName,
        orders: 0,
        totalSpent: 0,
        lastOrder: order.createdAt,
      })
    }
    
    const customer = customerMap.get(phone)
    customer.orders += 1
    customer.totalSpent += order.total
    
    if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
      customer.lastOrder = order.createdAt
    }
  })
  
  const customers = Array.from(customerMap.values())
  
  return {
    total: customers.length,
    newCustomers: customers.filter(c => c.orders === 1).length,
    returningCustomers: customers.filter(c => c.orders > 1).length,
    averageOrders: customers.length > 0 ? 
      customers.reduce((sum, c) => sum + c.orders, 0) / customers.length : 0,
    topCustomers: customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10),
  }
}

function generateOrderStats(orders: any[]) {
  const statusMap = new Map()
  
  orders.forEach(order => {
    const status = order.status
    if (!statusMap.has(status)) {
      statusMap.set(status, 0)
    }
    statusMap.set(status, statusMap.get(status) + 1)
  })
  
  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
    label: getStatusLabel(status),
  }))
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    pizza: "Пицца",
    burgers: "Бургеры", 
    sushi: "Суши",
    salads: "Салаты",
    desserts: "Десерты",
    drinks: "Напитки",
  }
  return names[category] || category
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Ожидает",
    confirmed: "Подтвержден",
    preparing: "Готовится", 
    ready: "Готов",
    delivering: "Доставляется",
    delivered: "Доставлен",
    cancelled: "Отменен",
  }
  return labels[status] || status
}