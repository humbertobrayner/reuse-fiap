"use client"

import { ItemCarousel } from "@/src/components/shared/item-carousel"
import { CarouselSkeleton } from "@/src/components/shared/loading-skeleton"
import { EmptyState } from "@/src/components/shared/empty-state"
import { useProducts, useToggleFavorite } from "@/src/hooks/use-products"
import { Package } from "lucide-react"

export function FeaturedSection() {
  const { data, isLoading, error } = useProducts({
    sort: "featured",
    pageSize: 12,
  })
  const toggleFavoriteMutation = useToggleFavorite()

  const handleToggleFavorite = async (productId: string) => {
    await toggleFavoriteMutation.mutateAsync(productId)
  }

  if (isLoading) {
    return <CarouselSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        icon={Package}
        title="Erro ao carregar produtos"
        description="Não foi possível carregar os produtos recomendados. Tente novamente."
        action={{
          label: "Tentar novamente",
          onClick: () => window.location.reload(),
        }}
      />
    )
  }

  if (!data?.products?.length) {
    return (
      <EmptyState
        icon={Package}
        title="Nenhum produto encontrado"
        description="Ainda não há produtos recomendados disponíveis."
      />
    )
  }

  return (
    <ItemCarousel title="Recomendados para você" products={data.products} onToggleFavorite={handleToggleFavorite} />
  )
}
