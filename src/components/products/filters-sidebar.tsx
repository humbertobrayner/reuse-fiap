"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { useCategories } from "@/src/hooks/use-categories"

interface FiltersState {
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  acceptsTrade?: boolean
}

interface FiltersSidebarProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
  onClearFilters: () => void
  className?: string
}

export function FiltersSidebar({ filters, onFiltersChange, onClearFilters, className }: FiltersSidebarProps) {
  const { data: categories } = useCategories()
  const [localFilters, setLocalFilters] = useState<FiltersState>(filters)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs">
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select
            value={localFilters.category || "all"}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, category: value === "all" ? undefined : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label>Faixa de preço</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Mín"
                value={localFilters.minPrice || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Máx"
                value={localFilters.maxPrice || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Condition Filter */}
        <div className="space-y-2">
          <Label>Condição</Label>
          <Select
            value={localFilters.condition || "any"}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, condition: value === "any" ? undefined : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Qualquer condição</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="usado">Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trade Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptsTrade"
            checked={localFilters.acceptsTrade || false}
            onCheckedChange={(checked) =>
              setLocalFilters((prev) => ({
                ...prev,
                acceptsTrade: checked === true ? true : undefined,
              }))
            }
          />
          <Label htmlFor="acceptsTrade" className="text-sm">
            Aceita troca
          </Label>
        </div>

        {/* Apply Button */}
        <Button onClick={handleApplyFilters} className="w-full">
          Aplicar filtros
        </Button>
      </CardContent>
    </Card>
  )
}
