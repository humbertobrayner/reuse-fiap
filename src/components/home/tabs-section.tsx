"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeaturedSection } from "./featured-section"
import { CategorySections } from "./category-sections"

export function TabsSection() {
  return (
    <Tabs defaultValue="comprar" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="comprar">Comprar</TabsTrigger>
        <TabsTrigger value="trocar">Trocar</TabsTrigger>
      </TabsList>

      <TabsContent value="comprar" className="space-y-8">
        <FeaturedSection />
        <CategorySections />
      </TabsContent>

      <TabsContent value="trocar" className="space-y-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Trocas em breve!</h3>
          <p className="text-muted-foreground">A funcionalidade de trocas estará disponível em breve.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
