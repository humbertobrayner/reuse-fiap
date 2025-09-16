"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchApi } from "@/src/lib/api/endpoints"
import { useProducts } from "./use-products"

interface SearchSuggestion {
  id: string
  text: string
  type: "product" | "category" | "query"
  productCount?: number
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: () => searchApi.suggest(query) as Promise<SearchSuggestion[]>,
    enabled: query.length >= 2,
    staleTime: 30000, // 30 seconds
  })
}

export { useProducts as useSearchProducts }

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("search-history")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading search history:", error)
      }
    }
  }, [])

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    const newHistory = [query, ...history.filter((h) => h !== query)].slice(0, 10)
    setHistory(newHistory)
    localStorage.setItem("search-history", JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("search-history")
  }

  return { history, addToHistory, clearHistory }
}
