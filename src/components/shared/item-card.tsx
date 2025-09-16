"use client"

import type React from "react"
import { Heart, MapPin, ShieldCheck, Tags, User, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  descriptionShort: string
  price?: number | null
  acceptsTrade: boolean
  condition: "novo" | "usado"
  category: string
  location: string
  images: string[]
  seller: {
    name: string
    rating: number
  }
}

interface ItemCardProps {
  product: Product
  onFavoriteToggle?: (productId: string) => void
}

export function ItemCard({ product, onFavoriteToggle }: ItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    onFavoriteToggle?.(product.id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <article className="rounded-2xl shadow-sm border bg-white overflow-hidden transition hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
      <div className="p-3 md:p-4 grid gap-2">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder/product.jpg"}
            alt={`Imagem do produto: ${product.title}`}
            fill
            className="object-cover"
          />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={handleFavoriteClick}
            aria-label="Adicionar aos favoritos"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 text-balance leading-tight">{product.title}</h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.descriptionShort}</p>

          {/* Price or Trade Badge */}
          <div className="flex items-center justify-between">
            {product.price ? (
              <span className="font-bold text-lg text-primary">{formatPrice(product.price)}</span>
            ) : (
              <Badge variant="outline" className="text-xs">
                Aceita troca
              </Badge>
            )}
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-1">
            {/* Condition Badge */}
            <Badge variant={product.condition === "novo" ? "default" : "secondary"} className="text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" aria-hidden="true" />
              {product.condition === "novo" ? "Novo" : "Usado"}
            </Badge>

            {/* Category Badge */}
            <Badge variant="outline" className="text-xs">
              <Tags className="h-3 w-3 mr-1" aria-hidden="true" />
              {product.category}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{product.location}</span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{product.seller.name}</span>
            <span className="text-yellow-500">★ {product.seller.rating}</span>
          </div>

          {/* Action Button */}
          <Link href={`/produtos/${product.id}`} className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 bg-transparent"
              aria-label="Ir para página de detalhes do produto"
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
