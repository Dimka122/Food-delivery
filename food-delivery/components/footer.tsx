import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacts" className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">ВкусДоставка</h3>
            <p className="text-background/70">
              Доставляем вкусную еду с любовью с 2020 года. Каждое блюдо готовится из свежих ингредиентов.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="h-5 w-5" />
                <span>+380 (99) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <Mail className="h-5 w-5" />
                <span>info@vkusdelivery.ua</span>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="h-5 w-5" />
                <span>Київ, вул. Хрещатик, 1</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Время работы</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/70">
                <Clock className="h-5 w-5" />
                <div>
                  <p>Пн-Пт: 10:00 - 23:00</p>
                  <p>Сб-Вс: 11:00 - 00:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4" id="delivery">
            <h4 className="font-bold text-lg">Доставка</h4>
            <ul className="space-y-2 text-background/70">
              <li>Бесплатно от 1000₴</li>
              <li>До 199₴ при меньшей сумме</li>
              <li>Среднее время: 30 мин</li>
              <li>Зона доставки: 10 км</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50">
          <p>© 2026 ВкусДоставка. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
