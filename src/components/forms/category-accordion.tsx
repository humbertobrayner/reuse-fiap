"use client"

import { useState } from "react"
import { ChevronDown, Cpu, Shirt, Car, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
  children: Category[]
}

interface CategoryAccordionProps {
  categories?: Category[]
  selectedCategory?: string
  selectedSubcategory?: string
  onCategorySelect?: (categoryId: string, subcategoryId?: string) => void
}

// Mock categories from the specification
const mockCategories: Category[] = [
  {
    id: "tec",
    name: "Tecnologia",
    slug: "tecnologia",
    children: [
      { id: "smartphones", name: "Smartphones", slug: "smartphones", children: [] },
      { id: "notebooks", name: "Notebooks", slug: "notebooks", children: [] },
      { id: "tvs", name: "TVs", slug: "tvs", children: [] },
      { id: "games", name: "Games", slug: "games", children: [] },
      { id: "audio", name: "Áudio", slug: "audio", children: [] },
      { id: "cameras", name: "Câmeras e Drones", slug: "cameras-drones", children: [] },
      { id: "wearables", name: "Wearables", slug: "wearables", children: [] },
      { id: "pecas", name: "Peças e Acessórios", slug: "pecas-acessorios", children: [] },
    ],
  },
  {
    id: "vest",
    name: "Vestuário",
    slug: "vestuario",
    children: [
      { id: "masc", name: "Masculino", slug: "masculino", children: [] },
      { id: "fem", name: "Feminino", slug: "feminino", children: [] },
      { id: "inf", name: "Infantil", slug: "infantil", children: [] },
      { id: "calcados", name: "Calçados", slug: "calcados", children: [] },
      { id: "bolsas", name: "Bolsas e Acessórios", slug: "bolsas-acessorios", children: [] },
      { id: "esportivas", name: "Esportivas", slug: "esportivas", children: [] },
      { id: "festa", name: "Festa", slug: "festa", children: [] },
    ],
  },
  {
    id: "auto",
    name: "Automotivo",
    slug: "automotivo",
    children: [
      { id: "pecas-auto", name: "Peças", slug: "pecas", children: [] },
      { id: "pneus", name: "Pneus e Rodas", slug: "pneus-rodas", children: [] },
      { id: "som-auto", name: "Som Automotivo", slug: "som", children: [] },
      { id: "ferramentas", name: "Ferramentas", slug: "ferramentas", children: [] },
      { id: "manutencao", name: "Manutenção", slug: "manutencao", children: [] },
      { id: "navegacao", name: "Câmeras/Navegadores", slug: "navegacao", children: [] },
    ],
  },
  {
    id: "casa",
    name: "Para Casa",
    slug: "para-casa",
    children: [
      { id: "moveis", name: "Móveis", slug: "moveis", children: [] },
      { id: "eletro", name: "Eletrodomésticos", slug: "eletrodomesticos", children: [] },
      { id: "decoracao", name: "Decoração", slug: "decoracao", children: [] },
      { id: "cama", name: "Cama, Mesa e Banho", slug: "cama-mesa-banho", children: [] },
      { id: "iluminacao", name: "Iluminação", slug: "iluminacao", children: [] },
      { id: "cozinha", name: "Cozinha", slug: "cozinha", children: [] },
      { id: "jardim", name: "Jardim e Varanda", slug: "jardim-varanda", children: [] },
      { id: "organizacao", name: "Organização", slug: "organizacao", children: [] },
    ],
  },
]

const categoryIcons = {
  Tecnologia: Cpu,
  Vestuário: Shirt,
  Automotivo: Car,
  "Para Casa": Home,
}

export function CategoryAccordion({
  categories = mockCategories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
}: CategoryAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string>(selectedCategory || "")
  const [searchTerm, setSearchTerm] = useState("")

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? "" : categoryId)
  }

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onCategorySelect?.(categoryId, subcategoryId)
  }

  const filteredCategories = categories.map((category) => ({
    ...category,
    children: category.children.filter((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
  }))

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Input
        placeholder="Buscar categoria..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Selected Category Display */}
      {selectedCategory && selectedSubcategory && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Categoria selecionada:</p>
          <Badge variant="outline">
            {categories.find((c) => c.id === selectedCategory)?.name} →{" "}
            {
              categories.find((c) => c.id === selectedCategory)?.children.find((s) => s.id === selectedSubcategory)
                ?.name
            }
          </Badge>
        </div>
      )}

      {/* Category Accordion */}
      <div className="space-y-2">
        {filteredCategories.map((category) => {
          const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons]
          const isOpen = openCategory === category.id

          return (
            <div key={category.id} className="border rounded-lg">
              {/* Category Header */}
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
                onClick={() => handleCategoryToggle(category.id)}
                aria-expanded={isOpen}
                aria-controls={`category-${category.id}`}
              >
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </Button>

              {/* Subcategories */}
              {isOpen && (
                <div
                  id={`category-${category.id}`}
                  role="region"
                  aria-labelledby={`category-${category.id}-header`}
                  className="border-t bg-muted/30"
                >
                  <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                    {category.children.map((subcategory) => (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        size="sm"
                        className={`justify-start text-left h-auto py-2 ${
                          selectedSubcategory === subcategory.id ? "bg-primary/10 text-primary" : ""
                        }`}
                        onClick={() => handleSubcategorySelect(category.id, subcategory.id)}
                      >
                        {subcategory.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
