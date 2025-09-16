import type React from "react"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-4">{children}</main>

      <BottomNav />
    </div>
  )
}
