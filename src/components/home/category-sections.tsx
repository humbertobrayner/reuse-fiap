"use client"

import { ItemCarousel } from "@/src/components/shared/item-carousel"
import { CarouselSkeleton } from "@/src/components/shared/loading-skeleton"
import { useCategories } from "@/src/hooks/use-categories"
import { useProducts, useToggleFavorite } from "@/src/hooks/use-products"

export function CategorySections() {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const toggleFavoriteMutation = useToggleFavorite()

  const handleToggleFavorite = async (productId: string) => {
    await toggleFavoriteMutation.mutateAsync(productId)
  }

  if (categoriesLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <CarouselSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!categories?.length) {
    return null
  }

  // Show first 3 categories on home page
  const featuredCategories = categories.slice(0, 3)

  return (
    <div className="space-y-8">
      {featuredCategories.map((category) => (
        <CategorySection key={category.id} category={category} onToggleFavorite={handleToggleFavorite} />
      ))}
    </div>
  )
}

interface CategorySectionProps {
  category: { id: string; name: string; slug: string }
  onToggleFavorite: (productId: string) => Promise<void>
}

function CategorySection({ category, onToggleFavorite }: CategorySectionProps) {
  const { data, isLoading } = useProducts({
    category: category.slug,
    pageSize: 8,
  })

  if (isLoading) {
    return <CarouselSkeleton />
  }

  if (!data?.products?.length) {
    return null
  }

  return <ItemCarousel title={category.name} products={data.products} onToggleFavorite={onToggleFavorite} />
}
