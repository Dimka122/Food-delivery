"use client"

import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">ВкусДоставка</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Меню
            </a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              О нас
            </a>
            <a href="#delivery" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Доставка
            </a>
            <a href="#contacts" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Контакты
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative bg-transparent"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#menu" className="text-foreground/80 hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                Меню
              </a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                О нас
              </a>
              <a href="#delivery" className="text-foreground/80 hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                Доставка
              </a>
              <a href="#contacts" className="text-foreground/80 hover:text-primary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                Контакты
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
