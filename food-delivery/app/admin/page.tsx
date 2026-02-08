"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"

interface DashboardData {
  stats: {
    totalOrders: string
    totalProducts: string
    totalCustomers: string
    totalRevenue: string
  }
  sales: Array<{
    date: string
    orders: number
    revenue: number
    customers: number
  }>
  categories: Array<{
    category: string
    name: string
    orders: number
    revenue: number
    items: number
  }>
  recentOrders: Array<{
    id: string
    customerName: string
    customerPhone: string
    items: Array<{ name: string; quantity: number }>
    total: number
    status: string
    createdAt: string
  }>
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
    rating: number
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Получаем аналитические данные
        const analyticsResponse = await fetch('/api/analytics?period=7d')
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const analytics = await analyticsResponse.json()
        
        // Получаем последние заказы
        const ordersResponse = await fetch('/api/orders?limit=5')
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders')
        }
        const orders = await ordersResponse.json()
        
        // Форматируем данные для дашборда
        const formattedData: DashboardData = {
          stats: {
            totalOrders: analytics.totalOrders?.toLocaleString() || '0',
            totalProducts: analytics.categories?.reduce((sum: number, cat: any) => sum + cat.items, 0).toLocaleString() || '0',
            totalCustomers: analytics.customers?.total?.toLocaleString() || '0',
            totalRevenue: (analytics.totalRevenue || 0).toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 }).replace('₴', '₴'),
          },
          sales: analytics.sales || [],
          categories: analytics.categories?.map((cat: any) => ({
            ...cat,
            value: analytics.totalOrders > 0 ? Math.round((cat.orders / analytics.totalOrders) * 100) : 0
          })) || [],
          recentOrders: orders,
          topProducts: analytics.topProducts?.slice(0, 5) || [],
        }
        
        setData(formattedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "secondary" as const },
      confirmed: { label: "Подтвержден", variant: "default" as const },
      preparing: { label: "Готовится", variant: "default" as const },
      ready: { label: "Готов", variant: "default" as const },
      delivering: { label: "Доставляется", variant: "default" as const },
      delivered: { label: "Доставлен", variant: "outline" as const },
      cancelled: { label: "Отменен", variant: "destructive" as const },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      confirmed: AlertCircle,
      preparing: AlertCircle,
      ready: CheckCircle,
      delivering: AlertCircle,
      delivered: CheckCircle,
      cancelled: AlertCircle,
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="h-4 w-4" />
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки данных</h3>
          <p className="text-gray-600">{error || 'Не удалось загрузить данные'}</p>
        </div>
      </div>
    )
  }

  const categoryColors = ["#ff6b35", "#f7931e", "#c45c35", "#90be6d", "#f94144", "#577590"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-600 mt-2">
          Обзор вашего ресторана и последние заказы
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Всего заказов
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalOrders}</div>
            <p className="text-xs text-green-600 mt-1">
              за последние 7 дней
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Товаров в меню
            </CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              активных позиций
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Клиентов
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalCustomers}</div>
            <p className="text-xs text-green-600 mt-1">
              уникальных
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Доход за 7 дней
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data.stats.totalRevenue}</div>
            <p className="text-xs text-green-600 mt-1">
              общий доход
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Заказы по дням</CardTitle>
            <CardDescription>Количество заказов и доход за неделю</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#c45c35" name="Заказы" />
                <Bar dataKey="revenue" fill="#f7931e" name="Доход (₴)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
            <CardDescription>Популярность категорий в заказах</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="orders"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Заказы, требующие внимания</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-500">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">#{order.id.slice(-6)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && '...'}
                        </p>
                        <p className="text-xs text-gray-400">{formatTime(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.total} ₴</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Нет заказов</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Популярные блюда</CardTitle>
            <CardDescription>Топ товары по количеству заказов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.length > 0 ? (
                data.topProducts.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span>{item.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{item.orders} заказов</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{item.orders} заказов</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Нет данных о заказах</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}