"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MainLayout } from "@/src/components/layout/main-layout"
import { SearchBar } from "@/src/components/search/search-bar"
import { SearchFilters } from "@/src/components/search/search-filters"
import { ProductGrid } from "@/src/components/products/product-grid"
import { FiltersModal } from "@/src/components/products/filters-modal"
import { FiltersSidebar } from "@/src/components/products/filters-sidebar"
import { EmptyState } from "@/src/components/shared/empty-state"
import { useProducts, useToggleFavorite } from "@/src/hooks/use-products"
import { Search } from "lucide-react"

interface FiltersState {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  acceptsTrade?: boolean
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FiltersState>({})
  const [page, setPage] = useState(1)
  const isInitializing = useRef(true)

  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    const urlFilters: FiltersState = {
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      condition: searchParams.get("condition") || undefined,
      acceptsTrade: searchParams.get("acceptsTrade") === "true" ? true : undefined,
    }

    if (isInitializing.current) {
      setQuery(urlQuery)
      setFilters(urlFilters)
      isInitializing.current = false
    }
  }, [searchParams])

  const { data, isLoading, error } = useProducts({
    q: query,
    ...filters,
    page,
    pageSize: 20,
  })

  const toggleFavoriteMutation = useToggleFavorite()

  const updateURL = useCallback(
    (searchQuery: string, searchFilters: FiltersState) => {
      if (isInitializing.current) return

      const params = new URLSearchParams()

      if (searchQuery) {
        params.set("q", searchQuery)
      }

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value))
        }
      })

      const newUrl = `/buscar${params.toString() ? `?${params.toString()}` : ""}`
      router.replace(newUrl)
    },
    [router],
  )

  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      setPage(1)
      updateURL(newQuery, filters)
    },
    [filters, updateURL],
  )

  const handleFiltersChange = useCallback(
    (newFilters: FiltersState) => {
      setFilters(newFilters)
      setPage(1)
      updateURL(query, newFilters)
    },
    [query, updateURL],
  )

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setPage(1)
    updateURL(query, {})
  }, [query, updateURL])

  const handleLoadMore = () => {
    if (data?.totalPages && page < data.totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handleToggleFavorite = async (productId: string) => {
    await toggleFavoriteMutation.mutateAsync(productId)
  }

  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> = []

    if (filters.category) {
      activeFilters.push({ key: "category", label: "Categoria", value: filters.category })
    }
    if (filters.minPrice) {
      activeFilters.push({ key: "minPrice", label: "Preço mín", value: `R$ ${filters.minPrice}` })
    }
    if (filters.maxPrice) {
      activeFilters.push({ key: "maxPrice", label: "Preço máx", value: `R$ ${filters.maxPrice}` })
    }
    if (filters.condition) {
      activeFilters.push({ key: "condition", label: "Condição", value: filters.condition })
    }
    if (filters.acceptsTrade) {
      activeFilters.push({ key: "acceptsTrade", label: "Aceita troca", value: "Sim" })
    }

    return activeFilters
  }

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key as keyof FiltersState]
    handleFiltersChange(newFilters)
  }

  return (
    <MainLayout>
      <div className="container px-4 py-6">
        <div className="space-y-4 mb-6">
          <div className="max-w-2xl mx-auto">
            <SearchBar initialQuery={query} onSearch={handleSearch} placeholder="Buscar produtos..." />
          </div>

          <div className="flex items-center justify-between">
            <div>
              {query && <h1 className="text-xl font-semibold">Resultados para "{query}"</h1>}
              {data && (
                <p className="text-muted-foreground">
                  {data.total} produto{data.total !== 1 ? "s" : ""} encontrado{data.total !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="md:hidden">
              <FiltersModal
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          <SearchFilters
            filters={getActiveFilters()}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        </div>

        {!query ? (
          <EmptyState
            icon={Search}
            title="Digite algo para buscar"
            description="Use a barra de busca acima para encontrar produtos incríveis no Reuse."
          />
        ) : (
          <div className="flex gap-6">
            <aside className="hidden md:block w-80 flex-shrink-0">
              <FiltersSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            <main className="flex-1">
              <ProductGrid
                products={data?.products || []}
                isLoading={isLoading}
                error={error}
                hasNextPage={data ? page < data.totalPages : false}
                onLoadMore={handleLoadMore}
                onToggleFavorite={handleToggleFavorite}
              />
            </main>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
