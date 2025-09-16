import { MainLayout } from "@/src/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Star, Package, MessageCircle, Settings } from "lucide-react"

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="container px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e atividades</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>Usuário Demo</CardTitle>
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 (23 avaliações)</span>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="mb-4">
              Membro desde Janeiro 2024
            </Badge>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Produtos vendidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Trocas realizadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Meus Anúncios</h3>
              <p className="text-sm text-muted-foreground">Gerencie seus produtos anunciados</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Conversas</h3>
              <p className="text-sm text-muted-foreground">Veja suas mensagens e negociações</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Configurações</h3>
              <p className="text-sm text-muted-foreground">Ajuste suas preferências</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder Message */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Funcionalidades em desenvolvimento</h3>
            <p className="text-muted-foreground mb-4">
              O sistema de perfil completo estará disponível em breve, incluindo histórico de transações, avaliações e
              configurações avançadas.
            </p>
            <Button variant="outline">Voltar ao início</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
