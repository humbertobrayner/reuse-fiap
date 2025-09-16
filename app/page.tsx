import { MainLayout } from "@/src/components/layout/main-layout"
import { CategoryChips } from "@/src/components/home/category-chips"
import { TabsSection } from "@/src/components/home/tabs-section"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="text-center py-4">
          <h1 className="text-2xl font-bold mb-2 text-balance">Bem-vindo ao Reuse</h1>
          <p className="text-muted-foreground text-balance">Compre, venda e troque produtos de forma sustentável</p>
        </section>

        {/* Category Chips */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Categorias</h2>
          <CategoryChips />
        </section>

        {/* Main Content Tabs */}
        <TabsSection />
      </div>
    </MainLayout>
  )
}
