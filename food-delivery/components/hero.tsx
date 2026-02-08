import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Truck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Вкусная еда
                <span className="text-primary"> с доставкой</span> к вашей двери
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Свежие блюда от лучших поваров города. Быстрая доставка за 30 минут или пицца бесплатно!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="#menu">
                  Перейти к меню
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline">
                Узнать больше
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">30 минут</p>
                  <p className="text-sm text-muted-foreground">Среднее время доставки</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Бесплатно</p>
                  <p className="text-sm text-muted-foreground">При заказе от 1000₴</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-full bg-primary/10 absolute -right-20 -top-20 w-96 h-96 blur-3xl" />
            <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center text-6xl">
                  🍕
                </div>
                <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center text-6xl">
                  🍔
                </div>
                <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center text-6xl">
                  🍣
                </div>
                <div className="aspect-square rounded-2xl bg-secondary flex items-center justify-center text-6xl">
                  🥗
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
