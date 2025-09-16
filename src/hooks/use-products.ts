"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productsApi } from "@/src/lib/api/endpoints"

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
  description?: string
  seller?: {
    id: string
    name: string
    rating?: number
  }
}

interface ProductsParams {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  page?: number
  pageSize?: number
  sort?: string
}

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      productsApi.list(params) as Promise<{
        products: Product[]
        total: number
        page: number
        pageSize: number
        totalPages: number
      }>,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.get(id) as Promise<Product>,
    enabled: !!id,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => productsApi.toggleFavorite(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] })
      await queryClient.cancelQueries({ queryKey: ["product", productId] })

      // Snapshot previous values
      const previousProducts = queryClient.getQueriesData({ queryKey: ["products"] })
      const previousProduct = queryClient.getQueryData(["product", productId])

      // Optimistically update
      queryClient.setQueriesData({ queryKey: ["products"] }, (old: any) => {
        if (!old?.products) return old
        return {
          ...old,
          products: old.products.map((product: Product) =>
            product.id === productId ? { ...product, isFavorited: !product.isFavorited } : product,
          ),
        }
      })

      queryClient.setQueryData(["product", productId], (old: Product | undefined) => {
        if (!old) return old
        return { ...old, isFavorited: !old.isFavorited }
      })

      return { previousProducts, previousProduct }
    },
    onError: (err, productId, context) => {
      // Revert optimistic updates on error
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(["product", productId], context.previousProduct)
      }
    },
    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useSearchProducts(query: string, filters?: any) {
  return useQuery({
    queryKey: ["search-products", query, filters],
    queryFn: () => productsApi.list({ q: query, ...filters }),
    enabled: query.length >= 2,
  })
}
