import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface OrderData {
  name: string
  phone: string
  city: string
  street: string
  building: string
  apartment: string
  entrance: string
  floor: string
  comment: string
  paymentMethod: "cash" | "card"
  items: OrderItem[]
  total: number
  deliveryFee: number
}

export async function POST(request: Request) {
  try {
    const order: OrderData = await request.json()

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price * item.quantity} ₴</td>
        </tr>
      `
      )
      .join("")

    const addressParts = [
      order.city,
      `вул. ${order.street}`,
      `буд. ${order.building}`,
      order.apartment && `кв. ${order.apartment}`,
      order.entrance && `під'їзд ${order.entrance}`,
      order.floor && `поверх ${order.floor}`,
    ].filter(Boolean)

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #c45c35 0%, #e07b4f 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #fff; padding: 30px; border: 1px solid #eee; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 16px; font-weight: 600; color: #c45c35; margin-bottom: 10px; border-bottom: 2px solid #c45c35; padding-bottom: 5px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .info-label { color: #666; width: 120px; }
          .info-value { font-weight: 500; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8f8f8; padding: 12px; text-align: left; font-weight: 600; }
          .total-row { font-size: 18px; font-weight: bold; color: #c45c35; }
          .footer { background: #f8f8f8; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍕 Нове замовлення!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">ВкусДоставка</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">👤 Контактні дані</div>
              <p><strong>Ім'я:</strong> ${order.name}</p>
              <p><strong>Телефон:</strong> ${order.phone}</p>
            </div>
            
            <div class="section">
              <div class="section-title">📍 Адреса доставки</div>
              <p>${addressParts.join(", ")}</p>
              ${order.comment ? `<p><strong>Коментар:</strong> ${order.comment}</p>` : ""}
            </div>
            
            <div class="section">
              <div class="section-title">💳 Спосіб оплати</div>
              <p>${order.paymentMethod === "card" ? "Картка (онлайн)" : "Готівка при отриманні"}</p>
            </div>
            
            <div class="section">
              <div class="section-title">🛒 Замовлення</div>
              <table>
                <thead>
                  <tr>
                    <th>Страва</th>
                    <th style="text-align: center;">К-сть</th>
                    <th style="text-align: right;">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee;">
                <p style="display: flex; justify-content: space-between;">
                  <span>Підсумок:</span>
                  <span>${order.total} ₴</span>
                </p>
                <p style="display: flex; justify-content: space-between;">
                  <span>Доставка:</span>
                  <span>${order.deliveryFee === 0 ? "Безкоштовно" : `${order.deliveryFee} ₴`}</span>
                </p>
                <p class="total-row" style="display: flex; justify-content: space-between; font-size: 20px; margin-top: 10px;">
                  <span>РАЗОМ:</span>
                  <span>${order.total + order.deliveryFee} ₴</span>
                </p>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Дякуємо за замовлення!</p>
            <p>ВкусДоставка • +380 (99) 123-45-67</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email notification if Resend is configured
    if (resend && process.env.ORDER_EMAIL) {
      try {
        const { data, error } = await resend.emails.send({
          from: "ВкусДоставка <onboarding@resend.dev>",
          to: [process.env.ORDER_EMAIL],
          subject: `Нове замовлення #${Date.now().toString().slice(-6)} від ${order.name}`,
          html: htmlContent,
        })

        if (error) {
          console.error("Resend error:", error)
          // Continue without failing the order if email fails
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError)
        // Continue without failing the order if email fails
      }
    } else {
      console.log("Email notification skipped - Resend not configured")
      console.log("Order details:", order)
    }

    // Сохраняем заказ в систему для админки
    try {
      const orderForStorage = {
        name: order.name,
        phone: order.phone,
        city: order.city,
        street: order.street,
        building: order.building,
        apartment: order.apartment,
        entrance: order.entrance,
        floor: order.floor,
        comment: order.comment,
        paymentMethod: order.paymentMethod,
        items: order.items,
        total: order.total,
        deliveryFee: order.deliveryFee,
      }

      // Отправляем заказ в наш API для сохранения
      const saveResponse = await fetch(`${new URL(request.url).origin}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForStorage),
      })

      if (!saveResponse.ok) {
        console.error("Failed to save order to admin system")
        // Не прерываем выполнение, если не удалось сохранить в админку
      }
    } catch (saveError) {
      console.error("Error saving order to admin system:", saveError)
      // Не прерываем выполнение, если не удалось сохранить в админку
    }

    return Response.json({ success: true, message: "Order received successfully" })
  } catch (error) {
    console.error("Error sending order:", error)
    return Response.json({ error: "Failed to send order" }, { status: 500 })
  }
}
