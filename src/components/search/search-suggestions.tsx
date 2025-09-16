"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchSuggestions, useSearchHistory } from "@/src/hooks/use-search"
import { Search, Clock, Package, Tag, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchSuggestionsProps {
  query: string
  onSelectSuggestion: (suggestion: string) => void
  onClose: () => void
  className?: string
}

export function SearchSuggestions({ query, onSelectSuggestion, onClose, className }: SearchSuggestionsProps) {
  const { data: suggestions, isLoading } = useSearchSuggestions(query)
  const { history, clearHistory } = useSearchHistory()

  const showHistory = !query.trim() && history.length > 0
  const showSuggestions = query.length >= 2

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "product":
        return Package
      case "category":
        return Tag
      case "query":
        return TrendingUp
      default:
        return Search
    }
  }

  if (!showHistory && !showSuggestions) {
    return null
  }

  return (
    <Card className={cn("absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto", className)}>
      <CardContent className="p-0">
        {/* Search History */}
        {showHistory && (
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Buscas recentes</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar
              </Button>
            </div>
            <div className="space-y-1">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelectSuggestion(item)}
                  className="flex items-center w-full p-2 text-left text-sm hover:bg-muted rounded-md transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="flex-1 truncate">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {showSuggestions && isLoading && (
          <div className="p-3 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && !isLoading && suggestions && (
          <div className="p-3">
            {suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((suggestion) => {
                  const Icon = getSuggestionIcon(suggestion.type)

                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => onSelectSuggestion(suggestion.text)}
                      className="flex items-center w-full p-2 text-left text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground mr-3" />
                      <span className="flex-1 truncate">{suggestion.text}</span>
                      {suggestion.productCount && (
                        <span className="text-xs text-muted-foreground">{suggestion.productCount} produtos</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">Nenhuma sugestão encontrada</div>
            )}
          </div>
        )}

        {/* Close Button for Mobile */}
        <div className="md:hidden p-3 border-t">
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
