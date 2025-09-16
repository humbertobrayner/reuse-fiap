"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/src/components/layout/main-layout"
import { ImageCarousel } from "@/src/components/products/image-carousel"
import { ItemCarousel } from "@/src/components/shared/item-carousel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/src/components/shared/empty-state"
import { useProduct, useProducts, useToggleFavorite } from "@/src/hooks/use-products"
import { Heart, MapPin, Star, MessageCircle, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string

  const { data: product, isLoading, error } = useProduct(productId)
  const { data: relatedProducts } = useProducts({
    category: product?.category,
    pageSize: 8,
  })

  const toggleFavoriteMutation = useToggleFavorite()
  const [isFavorited, setIsFavorited] = useState(false)

  const handleToggleFavorite = async () => {
    try {
      setIsFavorited(!isFavorited)
      await toggleFavoriteMutation.mutateAsync(productId)
    } catch (error) {
      setIsFavorited(isFavorited)
    }
  }

  const handleBuyNow = () => {
    toast({
      title: "Em breve!",
      description: "A funcionalidade de compra estará disponível em breve.",
    })
  }

  const handleMakeOffer = () => {
    // Navigate to chat with initial message
    router.push(`/chat?product=${productId}&action=offer`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-32" />

          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container px-4 py-6">
          <EmptyState
            icon={ArrowLeft}
            title="Produto não encontrado"
            description="O produto que você está procurando não existe ou foi removido."
            action={{
              label: "Voltar ao catálogo",
              onClick: () => router.push("/produtos"),
            }}
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-6 space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <ImageCarousel images={product.images} alt={product.title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-balance">{product.title}</h1>
                <Button variant="ghost" size="sm" onClick={handleToggleFavorite} className="h-8 w-8 p-0">
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground",
                    )}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant={product.condition === "novo" ? "default" : "secondary"}>
                  {product.condition === "novo" ? "Novo" : "Usado"}
                </Badge>
                {product.acceptsTrade && <Badge variant="outline">Aceita troca</Badge>}
              </div>

              {product.price ? (
                <div className="text-3xl font-bold text-primary mb-4">{formatPrice(product.price)}</div>
              ) : (
                <div className="text-lg text-muted-foreground mb-4">Apenas troca</div>
              )}

              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{product.location}</span>
              </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.seller.name}</h3>
                      {product.seller.rating && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.seller.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {product.price && (
                <Button onClick={handleBuyNow} className="w-full" size="lg">
                  Comprar agora
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleMakeOffer}
                className="w-full flex items-center gap-2 bg-transparent"
                size="lg"
              >
                <MessageCircle className="h-4 w-4" />
                {product.acceptsTrade ? "Fazer proposta/troca" : "Fazer proposta"}
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap text-pretty">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.products?.length && (
          <div>
            <ItemCarousel
              title="Produtos relacionados"
              products={relatedProducts.products.filter((p) => p.id !== productId)}
              onToggleFavorite={async (id) => await toggleFavoriteMutation.mutateAsync(id)}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
