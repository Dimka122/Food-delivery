"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  Star,
} from "lucide-react"

// Mock данные для аналитики
const salesData = [
  { date: "01.01", orders: 45, revenue: 6750, customers: 42 },
  { date: "02.01", orders: 52, revenue: 7800, customers: 48 },
  { date: "03.01", orders: 38, revenue: 5700, customers: 35 },
  { date: "04.01", orders: 61, revenue: 9150, customers: 58 },
  { date: "05.01", orders: 49, revenue: 7350, customers: 46 },
  { date: "06.01", orders: 67, revenue: 10050, customers: 63 },
  { date: "07.01", orders: 55, revenue: 8250, customers: 52 },
  { date: "08.01", orders: 72, revenue: 10800, customers: 68 },
  { date: "09.01", orders: 58, revenue: 8700, customers: 55 },
  { date: "10.01", orders: 63, revenue: 9450, customers: 60 },
  { date: "11.01", orders: 48, revenue: 7200, customers: 45 },
  { date: "12.01", orders: 71, revenue: 10650, customers: 67 },
  { date: "13.01", orders: 59, revenue: 8850, customers: 56 },
  { date: "14.01", orders: 66, revenue: 9900, customers: 62 },
]

const categoryData = [
  { name: "Пицца", value: 35, revenue: 43850, color: "#ff6b35" },
  { name: "Бургеры", value: 25, revenue: 31300, color: "#f7931e" },
  { name: "Суши", value: 20, revenue: 25040, color: "#c45c35" },
  { name: "Салаты", value: 10, revenue: 12520, color: "#90be6d" },
  { name: "Десерты", value: 7, revenue: 8764, color: "#f94144" },
  { name: "Напитки", value: 3, revenue: 3756, color: "#577590" },
]

const hourlyData = [
  { hour: "10:00", orders: 5, revenue: 750 },
  { hour: "11:00", orders: 8, revenue: 1200 },
  { hour: "12:00", orders: 15, revenue: 2250 },
  { hour: "13:00", orders: 22, revenue: 3300 },
  { hour: "14:00", orders: 18, revenue: 2700 },
  { hour: "15:00", orders: 12, revenue: 1800 },
  { hour: "16:00", orders: 14, revenue: 2100 },
  { hour: "17:00", orders: 19, revenue: 2850 },
  { hour: "18:00", orders: 25, revenue: 3750 },
  { hour: "19:00", orders: 32, revenue: 4800 },
  { hour: "20:00", orders: 28, revenue: 4200 },
  { hour: "21:00", orders: 20, revenue: 3000 },
  { hour: "22:00", orders: 15, revenue: 2250 },
]

const topProducts = [
  { name: "Пепперони", orders: 89, revenue: 53311, rating: 4.9 },
  { name: "Филадельфия", orders: 76, revenue: 49324, rating: 4.9 },
  { name: "Классический бургер", orders: 65, revenue: 25935, rating: 4.8 },
  { name: "Двойной бургер", orders: 58, revenue: 31822, rating: 4.9 },
  { name: "Цезарь", orders: 52, revenue: 20748, rating: 4.6 },
  { name: "Маргарита", orders: 45, revenue: 22455, rating: 4.7 },
]

const customerData = [
  { month: "Янв", new: 45, returning: 67, total: 112 },
  { month: "Фев", new: 52, returning: 78, total: 130 },
  { month: "Мар", new: 38, returning: 85, total: 123 },
  { month: "Апр", new: 61, returning: 92, total: 153 },
  { month: "Май", new: 49, returning: 88, total: 137 },
  { month: "Июн", new: 67, returning: 105, total: 172 },
]

const monthlyStats = [
  { label: "Доход за месяц", value: "₴124,580", change: "+15.3%", icon: DollarSign, positive: true },
  { label: "Заказов за месяц", value: "1,284", change: "+12.5%", icon: ShoppingCart, positive: true },
  { label: "Новых клиентов", value: "312", change: "+8.2%", icon: Users, positive: true },
  { label: "Средний чек", value: "₴97", change: "+2.1%", icon: Star, positive: true },
]

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Аналитика</h1>
        <p className="text-gray-600 mt-2">
          Подробная статистика и аналитика ресторана
        </p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monthlyStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.positive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">за месяц</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Продажи по дням</CardTitle>
                <CardDescription>Количество заказов и доход за последние 14 дней</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#c45c35"
                      fill="#c45c35"
                      fillOpacity={0.3}
                      name="Доход (₴)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Продажи по часам</CardTitle>
                <CardDescription>Распределение заказов в течение дня</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#f7931e" name="Заказы" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Orders vs Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Заказы vs Клиенты</CardTitle>
              <CardDescription>Соотношение заказов и уникальных клиентов</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#c45c35"
                    strokeWidth={2}
                    name="Заказы"
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#f7931e"
                    strokeWidth={2}
                    name="Клиенты"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Распределение по категориям</CardTitle>
                <CardDescription>Популярность категорий в заказах</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Revenue */}
            <Card>
              <CardHeader>
                <CardTitle>Доход по категориям</CardTitle>
                <CardDescription>Доходность каждой категории</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} ₴`, "Доход"]} />
                    <Bar dataKey="revenue" fill="#c45c35" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Детальная статистика по категориям</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          {category.value}% от всех заказов
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{category.revenue.toLocaleString()} ₴</p>
                      <p className="text-sm text-gray-500">доход</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Топ товары</CardTitle>
              <CardDescription>Самые популярные товары по количеству заказов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.orders} заказов</p>
                      <p className="text-sm text-gray-500">
                        {product.revenue.toLocaleString()} ₴
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Товары по рейтингу</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#f7931e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Доходность товаров</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} ₴`, "Доход"]} />
                    <Bar dataKey="revenue" fill="#c45c35" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Динамика клиентов</CardTitle>
              <CardDescription>Новые и возвращающиеся клиенты по месяцам</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stackId="1"
                    stroke="#c45c35"
                    fill="#c45c35"
                    fillOpacity={0.6}
                    name="Новые"
                  />
                  <Area
                    type="monotone"
                    dataKey="returning"
                    stackId="1"
                    stroke="#f7931e"
                    fill="#f7931e"
                    fillOpacity={0.6}
                    name="Возвращающиеся"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего клиентов</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +12% за последний месяц
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Новые клиенты</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">312</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% за последний месяц
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Возвращающиеся</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">972</div>
                <p className="text-xs text-muted-foreground">
                  76% от всех клиентов
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}