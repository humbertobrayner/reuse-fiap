"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SearchFilter {
  key: string
  label: string
  value: string
}

interface SearchFiltersProps {
  filters: SearchFilter[]
  onRemoveFilter: (key: string) => void
  onClearAll: () => void
}

export function SearchFilters({ filters, onRemoveFilter, onClearAll }: SearchFiltersProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filtros aplicados:</span>

      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="flex items-center gap-1">
          <span>
            {filter.label}: {filter.value}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.key)}
            className="h-auto w-auto p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Limpar todos
        </Button>
      )}
    </div>
  )
}
