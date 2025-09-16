"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemCard } from "./item-card"
import { useRef } from "react"

interface Product {
  id: string
  title: string
  price?: number
  acceptsTrade?: boolean
  condition: "novo" | "usado"
  location: string
  images: string[]
  isFavorited?: boolean
  category: string
}

interface ItemCarouselProps {
  title: string
  products: Product[]
  onToggleFavorite?: (id: string) => void
}

export function ItemCarousel({ title, products, onToggleFavorite }: ItemCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280 // Card width + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-balance">{title}</h2>

        <div className="hidden md:flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={() => scroll("left")} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => scroll("right")} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-none w-64">
            <ItemCard product={product} onToggleFavorite={onToggleFavorite} />
          </div>
        ))}
      </div>
    </section>
  )
}
