"use client"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/src/hooks/use-categories"
import Link from "next/link"

export function CategoryChips() {
  const { data: categories, isLoading, error } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    )
  }

  if (error || !categories?.length) {
    return null
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Link key={category.id} href={`/produtos?category=${category.slug}`}>
          <Badge
            variant="secondary"
            className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
