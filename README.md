# 🍕 Food Delivery — Служба доставки еды

Полнофункциональное веб-приложение для службы доставки еды: клиентская часть для оформления заказов и административная панель для управления рестораном.

---

## 📋 Содержание

- [Обзор проекта](#обзор-проекта)
- [Архитектура](#архитектура)
- [Возможности](#возможности)
- [Технологии](#технологии)
- [Установка](#установка)
- [Настройка](#настройка)
- [API Endpoints](#api-endpoints)
- [Взаимодействие компонентов](#взаимодействие-компонентов)
- [Развертывание](#развертывание)

---

## Обзор проекта

```
┌─────────────────────────────────────────────────────────────┐
│                    FOOD DELIVERY                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐         ┌─────────────────────────┐   │
│   │   КЛИЕНТ        │         │      АДМИН-ПАНЕЛЬ       │   │
│   │                 │         │                         │   │
│   │  • Меню         │         │  • Дашборд              │   │
│   │  • Корзина       │◄───────►│  • Управление товарами  │   │
│   │  • Оформление   │   API   │  • Управление заказами  │   │
│   │  • Доставка      │         │  • Аналитика           │   │
│   └─────────────────┘         └─────────────────────────┘   │
│              │                           │                   │
│              ▼                           ▼                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    УВЕДОМЛЕНИЯ                      │   │
│   │                                                     │   │
│   │   📱 Telegram Bot  │  📧 Email (Resend)             │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Архитектура

```
app/
├── page.tsx                    # Главная страница (клиент)
├── layout.tsx                  # Общий layout
├── admin/                      # Админ-панель
│   ├── layout.tsx             # Layout админки (sidebar)
│   ├── page.tsx               # Дашборд
│   ├── products/              # Управление товарами
│   ├── orders/                # Управление заказами
│   ├── categories/            # Категории
│   ├── analytics/             # Аналитика
│   └── settings/              # Настройки
│
├── api/                        # API endpoints
│   ├── products/              # CRUD товаров
│   ├── categories/            # CRUD категорий
│   ├── orders/                # CRUD заказов
│   ├── orders/[id]/status/    # Изменение статуса
│   ├── analytics/             # Данные для графиков
│   └── send-order/            # Отправка уведомлений
│
components/                     # UI компоненты
├── header.tsx                  # Шапка сайта
├── hero.tsx                    # Hero-секция
├── categories.tsx              # Фильтр категорий
├── menu-section.tsx            # Меню с товарами
├── food-card.tsx               # Карточка товара
├── cart-drawer.tsx             # Корзина (выдвижная)
├── checkout-form.tsx           # Форма оформления
└── footer.tsx                  # Подвал
│
lib/                            # Библиотеки
├── menu-data.ts               # Данные товаров
├── categories-data.ts          # Данные категорий
├── orders-data.ts             # Глобальное хранилище заказов
└── telegram.ts                # Интеграция с Telegram
```

---

## Возможности

### 🛒 Клиентская часть

| Функция | Описание |
|---------|----------|
| 🍕 **Меню** | Отображение товаров по категориям |
| 🔍 **Фильтр** | Фильтрация по категориям |
| 🛒 **Корзина** | Добавление/удаление товаров, подсчёт суммы |
| 📝 **Оформление** | Форма с данными клиента |
| 📍 **Адрес** | Город, улица, дом, квартира, подъезд, этаж |
| 💳 **Оплата** | Наличные или карта |
| 📝 **Комментарий** | Пожелания к заказу |
| 📱 **Telegram** | Уведомление менеджера о заказе |

### 📊 Админ-панель

| Раздел | Функции |
|--------|---------|
| **Дашборд** | Статистика, последние заказы, графики |
| **Товары** | Добавление, редактирование, удаление, категории, цены, эмодзи |
| **Заказы** | Просмотр, изменение статусов, детали клиента |
| **Категории** | Создание, редактирование, эмодзи-иконки |
| **Аналитика** | Продажи, топ товары, клиенты, графики |
| **Настройки** | Информация о ресторане, доставка, оплата |

---

## Технологии

| Категория | Технология |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| UI | Radix UI, shadcn/ui |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form, Zod |
| Notifications | Sonner |
| Email | Resend |
| Messenger | Telegram Bot API |

---

## Установка

### 1. Клонирование

```bash
git clone https://github.com/Dimka122/Food-delivery.git
cd Food-delivery
```

### 2. Зависимости

```bash
npm install
```

### 3. Переменные окружения

Создай файл `.env.local` в корне проекта:

```env
# Telegram (обязательно)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# Email (опционально)
RESEND_API_KEY=re_xxxxx
ORDER_EMAIL=your@email.com

# JWT (опционально)
JWT_SECRET=your-secret-key
```

### 4. Запуск

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

---

## Настройка

### 📱 Telegram Bot

1. Открой [@BotFather](https://t.me/BotFather)
2. Отправь `/newbot`
3. Следуй инструкциям, получишь токен

### 🔢 Chat ID

1. Открой [@userinfobot](https://t.me/userinfobot)
2. Отправь любое сообщение
3. Получишь свой ID (число)

### ✅ Проверка

Сделай тестовый заказ — уведомление придёт в Telegram.

---

## API Endpoints

### Товары

```
GET    /api/products           # Все товары
GET    /api/products?category=pizza
POST   /api/products           # Создать
PUT    /api/products           # Обновить
DELETE /api/products?id=1      # Удалить
```

### Категории

```
GET    /api/categories         # Все категории
POST   /api/categories         # Создать
PUT    /api/categories         # Обновить
DELETE /api/categories?id=1    # Удалить
```

### Заказы

```
GET    /api/orders             # Все заказы
POST   /api/orders             # Создать
PATCH  /api/orders/[id]/status # Изменить статус
```

### Аналитика

```
GET    /api/analytics?period=7d
```

---

## Взаимодействие компонентов

### Поток заказа

```
КЛИЕНТ                          API                      АДМИН
  │                              │                         │
  │  1. Заполняет форму          │                         │
  │  ─────────────────────────►  │                         │
  │                              │                         │
  │                              │  2. Сохраняет заказ     │
  │                              │     в хранилище        │
  │                              │                         │
  │                              │  3. Отправляет в        │
  │                              │     Telegram            │
  │                              │                         │
  │  4. Показывает "Спасибо!"    │                         │
  │  ◄─────────────────────────  │                         │
  │                              │                         │
  │                              │    5. Загружает         │
  │                              │       список заказов    │
  │                              │  ◄──────────────────────│
  │                              │                         │
  │                              │    6. Изменяет статус   │
  │                              │  ◄──────────────────────│
  │                              │                         │
```

### Синхронизация данных

```
┌─────────────────┐                    ┌─────────────────┐
│  АДМИН-ПАНЕЛЬ   │                    │  ГЛОБАЛЬНОЕ     │
│                 │    Запись          │  ХРАНИЛИЩЕ      │
│  • Товары       │ ─────────────────► │  (lib/*-data.ts)│
│  • Категории    │                    │                 │
│  • Заказы       │ ◄───────────────── │  Чтение         │
└─────────────────┘                    └─────────────────┘
                                              │
                                              │ Чтение
                                              ▼
                                     ┌─────────────────┐
                                     │  КЛИЕНТСКАЯ     │
                                     │  ЧАСТЬ          │
                                     │                 │
                                     │  • Меню         │
                                     │  • Категории    │
                                     │  • Оформление   │
                                     └─────────────────┘
```

---

## Развертывание

### Vercel (рекомендуется)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t food-delivery .
docker run -p 3000:3000 food-delivery
```

### Переменные на Vercel

Добавь в настройках проекта:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESEND_API_KEY` (опционально)
- `ORDER_EMAIL` (опционально)

---

## Статусы заказов

| Статус | Описание |
|--------|----------|
| `pending` | Ожидает |
| `confirmed` | Подтверждён |
| `preparing` | Готовится |
| `ready` | Готов |
| `delivering` | Доставляется |
| `delivered` | Доставлен |
| `cancelled` | Отменён |

---

## Структуры данных

### Товар

```typescript
interface FoodItem {
  id: number
  name: string
  description: string
  price: number
  image: string       // эмодзи или URL
  category: string
  rating: number
  isPopular?: boolean
  isAvailable?: boolean
}
```

### Заказ

```typescript
interface Order {
  id: string
  customerName: string
  customerPhone: string
  address: string
  items: { name: string; price: number; quantity: number }[]
  total: number
  deliveryFee: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  paymentMethod: 'cash' | 'card'
  comment?: string
  createdAt: string
  updatedAt: string
}
```

---

## Будущие улучшения

- [ ] Авторизация в админ-панели
- [ ] База данных (PostgreSQL/MongoDB)
- [ ] Push-уведомления
- [ ] WebSocket для real-time
- [ ] Приложение для курьеров
- [ ] Платёжные системы
- [ ] Мультиязычность

---

**Создано с ❤️ для Food Delivery**
