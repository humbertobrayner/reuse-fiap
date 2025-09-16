"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainLayout } from "@/src/components/layout/main-layout"
import { FiltersSidebar } from "@/src/components/products/filters-sidebar"
import { FiltersModal } from "@/src/components/products/filters-modal"
import { useProducts, useToggleFavorite } from "@/src/hooks/use-products"
import { ItemCard } from "@/src/components/shared/item-card"

interface FiltersState {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  acceptsTrade?: boolean
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FiltersState>({})
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: FiltersState = {
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      condition: searchParams.get("condition") || undefined,
      acceptsTrade: searchParams.get("acceptsTrade") === "true" ? true : undefined,
    }
    setFilters(urlFilters)
  }, [searchParams])

  const { data, isLoading, error } = useProducts({
    ...filters,
    page,
    pageSize: 20,
  })

  const toggleFavoriteMutation = useToggleFavorite()

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change

    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value))
      }
    })

    const newUrl = `/produtos${params.toString() ? `?${params.toString()}` : ""}`
    window.history.pushState({}, "", newUrl)
  }

  const handleClearFilters = () => {
    setFilters({})
    setPage(1)
    window.history.pushState({}, "", "/produtos")
  }

  const handleLoadMore = () => {
    if (data?.totalPages && page < data.totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handleToggleFavorite = async (productId: string) => {
    await toggleFavoriteMutation.mutateAsync(productId)
  }

  const handleFavoriteToggle = (productId: string) => {
    // Implement favorite toggle logic here
  }

  const mockProducts = [
    {
      id: "1",
      title: "Smartphone Reuse A12",
      descriptionShort: "64GB, câmera dupla, ótimo estado.",
      price: 799.9,
      acceptsTrade: true,
      condition: "usado" as const,
      category: "Tecnologia > Smartphones",
      location: "São Paulo, SP",
      images: ["/modern-smartphone.png"],
      seller: { name: "Mariana", rating: 4.7 },
    },
    {
      id: "2",
      title: "Cafeteira Inox",
      descriptionShort: "Filtro permanente, pouco uso.",
      price: 149.0,
      acceptsTrade: false,
      condition: "usado" as const,
      category: "Para Casa > Cozinha",
      location: "Curitiba, PR",
      images: ["/open-notebook-desk.png"],
      seller: { name: "João", rating: 4.2 },
    },
    // Add more mock products with new structure
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 3}`,
      title: `Produto ${i + 3} - Descrição interessante`,
      descriptionShort: "Descrição breve do produto para demonstração.",
      price: Math.random() > 0.3 ? Math.floor(Math.random() * 2000) + 100 : null,
      acceptsTrade: Math.random() > 0.5,
      condition: Math.random() > 0.5 ? ("novo" as const) : ("usado" as const),
      category: ["Tecnologia", "Vestuário", "Para Casa", "Automotivo"][Math.floor(Math.random() * 4)],
      location: "São Paulo, SP",
      images: ["/generic-product-display.png"],
      seller: { name: "Vendedor", rating: 4.0 + Math.random() },
    })),
  ]

  return (
    <MainLayout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
            {data && (
              <p className="text-muted-foreground">
                {data.total} produto{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Mobile Filters Button */}
          <div className="md:hidden">
            <FiltersModal filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div
              className={`grid gap-4 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {data?.products
                ? data.products.map((product) => (
                    <ItemCard key={product.id} product={product} onFavoriteToggle={handleToggleFavorite} />
                  ))
                : mockProducts.map((product) => (
                    <ItemCard key={product.id} product={product} onFavoriteToggle={handleFavoriteToggle} />
                  ))}
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  )
}
