"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { FiltersSidebar } from "./filters-sidebar"
import { Badge } from "@/components/ui/badge"

interface FiltersState {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  acceptsTrade?: boolean
}

interface FiltersModalProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
  onClearFilters: () => void
}

export function FiltersModal({ filters, onFiltersChange, onClearFilters }: FiltersModalProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrar produtos</DialogTitle>
        </DialogHeader>

        <FiltersSidebar
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClearFilters={onClearFilters}
          className="border-0 shadow-none"
        />
      </DialogContent>
    </Dialog>
  )
}
