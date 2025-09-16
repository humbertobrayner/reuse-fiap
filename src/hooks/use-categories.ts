"use client"

import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "@/src/lib/api/endpoints"

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  productCount?: number
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list() as Promise<Category[]>,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
