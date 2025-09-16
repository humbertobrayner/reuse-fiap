"use client"

import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopNavDesktop } from "./top-nav-desktop"
import { useState } from "react"

interface HeaderProps {
  onMenuClick?: () => void
  showSearch?: boolean
  chatUnreadCount?: number
}

export function Header({ onMenuClick, showSearch = true, chatUnreadCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg">Reuse</span>
          </div>
        </div>

        <TopNavDesktop chatUnreadCount={chatUnreadCount} />

        {showSearch && (
          <div className="flex-1 max-w-md mx-4 md:ml-auto md:mr-0">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar produtos"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
