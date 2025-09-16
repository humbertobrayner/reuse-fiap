"use client"

import { Badge } from "@/components/ui/badge"

interface PriceProps {
  price?: number | null
  acceptsTrade?: boolean
  className?: string
}

export function Price({ price, acceptsTrade, className }: PriceProps) {
  if (price) {
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)

    return <span className={`font-bold text-lg text-primary ${className}`}>{formattedPrice}</span>
  }

  if (acceptsTrade) {
    return (
      <Badge variant="outline" className={className}>
        Aceita troca
      </Badge>
    )
  }

  return null
}
