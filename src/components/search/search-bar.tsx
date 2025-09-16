"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchSuggestions } from "./search-suggestions"
import { useDebounce, useSearchHistory } from "@/src/hooks/use-search"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  showSuggestions?: boolean
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({
  initialQuery = "",
  placeholder = "Buscar produtos...",
  showSuggestions = true,
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { addToHistory } = useSearchHistory()

  const debouncedQuery = useDebounce(query, 300)

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestionsPanel(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string = query) => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return

    addToHistory(trimmedQuery)
    setShowSuggestionsPanel(false)
    setIsFocused(false)

    if (onSearch) {
      onSearch(trimmedQuery)
    } else {
      router.push(`/buscar?q=${encodeURIComponent(trimmedQuery)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (showSuggestions) {
      setShowSuggestionsPanel(true)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearQuery = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            className={cn("pl-10 pr-10", isFocused && "ring-2 ring-ring ring-offset-2")}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearQuery}
              className="absolute right-1 top-1/2 h-7 w-7 p-0 -translate-y-1/2 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions Panel */}
      {showSuggestions && showSuggestionsPanel && (
        <SearchSuggestions
          query={debouncedQuery}
          onSelectSuggestion={handleSelectSuggestion}
          onClose={() => setShowSuggestionsPanel(false)}
        />
      )}
    </div>
  )
}
