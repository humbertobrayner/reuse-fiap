"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "./image-upload"
import { useCategories } from "@/src/hooks/use-categories"
import { productsApi } from "@/src/lib/api/endpoints"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const productSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100, "Título muito longo"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(1000, "Descrição muito longa"),
  category: z.string().min(1, "Selecione uma categoria"),
  condition: z.enum(["novo", "usado"], { required_error: "Selecione a condição" }),
  price: z.number().min(0, "Preço deve ser positivo").optional(),
  acceptsTrade: z.boolean().default(false),
  location: z.string().min(3, "Localização deve ter pelo menos 3 caracteres").max(100, "Localização muito longa"),
})

type ProductFormData = z.infer<typeof productSchema>

interface ImageFile {
  file: File
  preview: string
  id: string
}

export function ProductForm() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: categories } = useCategories()
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      acceptsTrade: false,
    },
  })

  const acceptsTrade = watch("acceptsTrade")
  const price = watch("price")

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma imagem do produto.",
        variant: "destructive",
      })
      return
    }

    if (!data.price && !data.acceptsTrade) {
      toast({
        title: "Erro",
        description: "Defina um preço ou marque que aceita troca.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Add product data
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("category", data.category)
      formData.append("condition", data.condition)
      formData.append("location", data.location)
      formData.append("acceptsTrade", String(data.acceptsTrade))

      if (data.price) {
        formData.append("price", String(data.price))
      }

      // Add images
      images.forEach((imageFile, index) => {
        formData.append("images", imageFile.file)
        if (index === 0) {
          formData.append("mainImageIndex", "0")
        }
      })

      const result = await productsApi.create(formData)

      toast({
        title: "Sucesso!",
        description: "Produto anunciado com sucesso.",
      })

      // Redirect to product detail page
      router.push(`/produtos/${(result as any).id}`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o anúncio. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload value={images} onChange={setImages} maxFiles={8} maxSizeMB={8} />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do anúncio *</Label>
            <Input id="title" placeholder="Ex: iPhone 13 Pro Max 256GB" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condição *</Label>
            <Select onValueChange={(value) => setValue("condition", value as "novo" | "usado")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a condição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
              </SelectContent>
            </Select>
            {errors.condition && <p className="text-sm text-destructive">{errors.condition.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva o produto, seu estado, características importantes..."
              rows={4}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Price and Trade */}
      <Card>
        <CardHeader>
          <CardTitle>Preço e negociação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptsTrade"
              checked={acceptsTrade}
              onCheckedChange={(checked) => setValue("acceptsTrade", checked === true)}
            />
            <Label htmlFor="acceptsTrade">Aceito troca</Label>
          </div>

          {!acceptsTrade && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register("price", {
                  setValueAs: (value) => (value === "" ? undefined : Number.parseFloat(value)),
                })}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          )}

          {acceptsTrade && price && (
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) - opcional para troca</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register("price", {
                  setValueAs: (value) => (value === "" ? undefined : Number.parseFloat(value)),
                })}
              />
              <p className="text-xs text-muted-foreground">Você pode definir um preço mesmo aceitando trocas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="location">Cidade/Estado *</Label>
            <Input id="location" placeholder="Ex: São Paulo, SP" {...register("location")} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isSubmitting ? "Publicando..." : "Publicar anúncio"}
        </Button>
      </div>
    </form>
  )
}
