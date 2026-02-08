"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Store,
  Clock,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Palette,
  Bell,
  Shield,
  Database,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface RestaurantSettings {
  name: string
  description: string
  phone: string
  email: string
  address: string
  logo: string
  workHours: {
    weekdays: string
    weekends: string
  }
  delivery: {
    fee: number
    freeFrom: number
    timeMin: number
    timeMax: number
    enabled: boolean
  }
  payments: {
    cash: boolean
    card: boolean
    online: boolean
  }
  notifications: {
    newOrders: boolean
    lowStock: boolean
    systemErrors: boolean
    email: boolean
    sms: boolean
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    darkMode: boolean
  }
}

const initialSettings: RestaurantSettings = {
  name: "ВкусДоставка",
  description: "Доставка вкусной еды быстро и качественно",
  phone: "+380 (99) 123-45-67",
  email: "info@vkycdoctavka.com",
  address: "г. Киев, ул. Хрещатик, 15",
  logo: "🍕",
  workHours: {
    weekdays: "10:00 - 23:00",
    weekends: "11:00 - 24:00",
  },
  delivery: {
    fee: 50,
    freeFrom: 500,
    timeMin: 25,
    timeMax: 60,
    enabled: true,
  },
  payments: {
    cash: true,
    card: true,
    online: true,
  },
  notifications: {
    newOrders: true,
    lowStock: true,
    systemErrors: true,
    email: true,
    sms: false,
  },
  appearance: {
    primaryColor: "#c45c35",
    secondaryColor: "#f7931e",
    darkMode: false,
  },
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    
    // Симуляция сохранения
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    toast({
      title: "Успех",
      description: "Настройки успешно сохранены",
    })
  }

  const handleReset = () => {
    if (confirm("Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?")) {
      setSettings(initialSettings)
      toast({
        title: "Успех",
        description: "Настройки сброшены",
      })
    }
  }

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let current: any = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-2">
            Конфигурация ресторана и системы доставки
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            Сохранить
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="restaurant">Ресторан</TabsTrigger>
          <TabsTrigger value="delivery">Доставка</TabsTrigger>
          <TabsTrigger value="payments">Оплата</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
        </TabsList>

        {/* Restaurant Settings */}
        <TabsContent value="restaurant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Основная информация
              </CardTitle>
              <CardDescription>
                Основные данные о вашем ресторане
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Название ресторана</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSettings('name', e.target.value)}
                    placeholder="ВкусДоставка"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Логотип (эмодзи)</Label>
                  <Input
                    id="logo"
                    value={settings.logo}
                    onChange={(e) => updateSettings('logo', e.target.value)}
                    placeholder="🍕"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => updateSettings('description', e.target.value)}
                  placeholder="Доставка вкусной еды быстро и качественно"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSettings('phone', e.target.value)}
                    placeholder="+380 (99) 123-45-67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings('email', e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSettings('address', e.target.value)}
                  placeholder="г. Киев, ул. Хрещатик, 15"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Часы работы
              </CardTitle>
              <CardDescription>
                Время работы ресторана по дням недели
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weekdays">Будние дни</Label>
                  <Input
                    id="weekdays"
                    value={settings.workHours.weekdays}
                    onChange={(e) => updateSettings('workHours.weekdays', e.target.value)}
                    placeholder="10:00 - 23:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekends">Выходные</Label>
                  <Input
                    id="weekends"
                    value={settings.workHours.weekends}
                    onChange={(e) => updateSettings('workHours.weekends', e.target.value)}
                    placeholder="11:00 - 24:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Настройки доставки
              </CardTitle>
              <CardDescription>
                Конфигурация доставки и её параметры
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="delivery-enabled"
                  checked={settings.delivery.enabled}
                  onCheckedChange={(checked) => updateSettings('delivery.enabled', checked)}
                />
                <Label htmlFor="delivery-enabled">Доставка включена</Label>
              </div>

              {settings.delivery.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-fee">Стоимость доставки (₴)</Label>
                      <Input
                        id="delivery-fee"
                        type="number"
                        value={settings.delivery.fee}
                        onChange={(e) => updateSettings('delivery.fee', Number(e.target.value))}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="free-from">Бесплатная доставка от (₴)</Label>
                      <Input
                        id="free-from"
                        type="number"
                        value={settings.delivery.freeFrom}
                        onChange={(e) => updateSettings('delivery.freeFrom', Number(e.target.value))}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="time-min">Минимальное время (мин)</Label>
                      <Input
                        id="time-min"
                        type="number"
                        value={settings.delivery.timeMin}
                        onChange={(e) => updateSettings('delivery.timeMin', Number(e.target.value))}
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time-max">Максимальное время (мин)</Label>
                      <Input
                        id="time-max"
                        type="number"
                        value={settings.delivery.timeMax}
                        onChange={(e) => updateSettings('delivery.timeMax', Number(e.target.value))}
                        placeholder="60"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Способы оплаты
              </CardTitle>
              <CardDescription>
                Настройка доступных способов оплаты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cash">Наличными</Label>
                    <p className="text-sm text-gray-500">Оплата наличными при получении</p>
                  </div>
                  <Switch
                    id="cash"
                    checked={settings.payments.cash}
                    onCheckedChange={(checked) => updateSettings('payments.cash', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="card">Картой курьеру</Label>
                    <p className="text-sm text-gray-500">Оплата банковской картой курьеру</p>
                  </div>
                  <Switch
                    id="card"
                    checked={settings.payments.card}
                    onCheckedChange={(checked) => updateSettings('payments.card', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="online">Онлайн оплата</Label>
                    <p className="text-sm text-gray-500">Оплата картой онлайн на сайте</p>
                  </div>
                  <Switch
                    id="online"
                    checked={settings.payments.online}
                    onCheckedChange={(checked) => updateSettings('payments.online', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Уведомления
              </CardTitle>
              <CardDescription>
                Настройка уведомлений и алертов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-orders">Новые заказы</Label>
                    <p className="text-sm text-gray-500">Уведомления о новых заказах</p>
                  </div>
                  <Switch
                    id="new-orders"
                    checked={settings.notifications.newOrders}
                    onCheckedChange={(checked) => updateSettings('notifications.newOrders', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-stock">Низкий остаток</Label>
                    <p className="text-sm text-gray-500">Уведомления о заканчивающихся товарах</p>
                  </div>
                  <Switch
                    id="low-stock"
                    checked={settings.notifications.lowStock}
                    onCheckedChange={(checked) => updateSettings('notifications.lowStock', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-errors">Системные ошибки</Label>
                    <p className="text-sm text-gray-500">Уведомления об ошибках системы</p>
                  </div>
                  <Switch
                    id="system-errors"
                    checked={settings.notifications.systemErrors}
                    onCheckedChange={(checked) => updateSettings('notifications.systemErrors', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Каналы уведомлений</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email</Label>
                    <p className="text-sm text-gray-500">Уведомления на электронную почту</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSettings('notifications.email', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS</Label>
                    <p className="text-sm text-gray-500">SMS уведомления на телефон</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateSettings('notifications.sms', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Внешний вид
              </CardTitle>
              <CardDescription>
                Настройка цветовой схемы и темы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Основной цвет</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primary-color"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings('appearance.primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) => updateSettings('appearance.primaryColor', e.target.value)}
                      placeholder="#c45c35"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Дополнительный цвет</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings('appearance.secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.appearance.secondaryColor}
                      onChange={(e) => updateSettings('appearance.secondaryColor', e.target.value)}
                      placeholder="#f7931e"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Темная тема</Label>
                  <p className="text-sm text-gray-500">Использовать темную цветовую схему</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.appearance.darkMode}
                  onCheckedChange={(checked) => updateSettings('appearance.darkMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Управление данными
              </CardTitle>
              <CardDescription>
                Экспорт и импорт данных системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт данных
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Импорт данных
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}