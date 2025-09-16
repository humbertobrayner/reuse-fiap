import { MainLayout } from "@/src/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Entrar no Reuse</CardTitle>
              <CardDescription>Entre com sua conta para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Sua senha" />
              </div>

              <Button className="w-full">Entrar</Button>

              <div className="text-center text-sm text-muted-foreground">
                Funcionalidade de login será implementada em breve
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
