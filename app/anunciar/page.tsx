"use client"
import { ProductForm } from "@/src/components/forms/product-form"
import { CategoryAccordion } from "@/src/components/forms/category-accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  category: z.string().min(1, "Selecione uma categoria"),
  subcategory: z.string().optional(),
})

export default function CreateListingPage() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })
  const selectedCategory = watch("category")
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      <main className="pb-20 md:pb-8">
        <div className="container px-4 py-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Anunciar Produto</h1>
              <p className="text-muted-foreground">Preencha as informações do seu produto</p>
            </div>
          </div>

          <ProductForm />
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Categoria do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryAccordion
                selectedCategory={selectedCategory}
                selectedSubcategory={watch("subcategory")}
                onCategorySelect={(categoryId, subcategoryId) => {
                  setValue("category", categoryId)
                  if (subcategoryId) {
                    setValue("subcategory", subcategoryId)
                  }
                }}
              />
              {errors.category && <p className="text-sm text-destructive mt-2">{errors.category.message}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
