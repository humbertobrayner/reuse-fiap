"use client"

import { ItemCard } from "@/src/components/shared/item-card"
import { ProductGridSkeleton } from "@/src/components/shared/loading-skeleton"
import { EmptyState } from "@/src/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

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

interface ProductGridProps {
  products: Product[]
  isLoading: boolean
  error: any
  hasNextPage?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  onToggleFavorite: (id: string) => Promise<void>
}

export function ProductGrid({
  products,
  isLoading,
  error,
  hasNextPage,
  onLoadMore,
  isLoadingMore,
  onToggleFavorite,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={12} />
  }

  if (error) {
    return (
      <EmptyState
        icon={Package}
        title="Erro ao carregar produtos"
        description="Não foi possível carregar os produtos. Tente novamente."
        action={{
          label: "Tentar novamente",
          onClick: () => window.location.reload(),
        }}
      />
    )
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={Package}
        title="Nenhum produto encontrado"
        description="Não encontramos produtos com os filtros aplicados. Tente ajustar os filtros ou buscar por outros termos."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ItemCard key={product.id} product={product} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Carregando..." : "Carregar mais"}
          </Button>
        </div>
      )}
    </div>
  )
}
