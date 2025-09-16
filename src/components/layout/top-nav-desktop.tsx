"use client"

import { Home, Search, PlusCircle, ShoppingBag, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface TopNavDesktopProps {
  chatUnreadCount?: number
}

const navItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Buscar", href: "/buscar", icon: Search },
  { label: "Anunciar", href: "/anunciar", icon: PlusCircle, highlight: true },
  { label: "Produtos", href: "/produtos", icon: ShoppingBag },
  { label: "Chat", href: "/chat", icon: MessageCircle, unreadBadge: true },
  { label: "Perfil", href: "/perfil", icon: User },
]

export function TopNavDesktop({ chatUnreadCount = 0 }: TopNavDesktopProps) {
  const pathname = usePathname()

  return (
    <nav role="navigation" aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
      <ul className="flex items-center gap-1">
        {navItems.map(({ label, href, icon: Icon, highlight, unreadBadge }) => {
          const isActive = pathname === href
          const showUnreadBadge = unreadBadge && chatUnreadCount > 0

          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={`Ir para ${label}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isActive
                    ? "bg-accent text-accent-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground",
                  highlight && !isActive && "text-primary hover:text-primary/80 hover:bg-primary/10",
                )}
              >
                <div className="relative">
                  <Icon className="h-4 w-4" />
                  {showUnreadBadge && (
                    <span
                      className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"
                      aria-label={`${chatUnreadCount} mensagens não lidas`}
                    />
                  )}
                </div>
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
