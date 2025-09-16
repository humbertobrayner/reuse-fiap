"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"

interface Conversation {
  id: string
  withUser: string
  unread: number
  lastMessage: string
  avatarUrl: string | null
  timestamp?: string
}

interface ChatListProps {
  conversations?: Conversation[]
  loading?: boolean
}

// Mock data for demo mode
const mockConversations: Conversation[] = [
  {
    id: "c1",
    withUser: "Mariana",
    unread: 2,
    lastMessage: "Tenho interesse, aceita troca?",
    avatarUrl: null,
    timestamp: "10:30",
  },
  {
    id: "c2",
    withUser: "João",
    unread: 0,
    lastMessage: "Fechado, posso retirar amanhã.",
    avatarUrl: null,
    timestamp: "09:15",
  },
  {
    id: "c3",
    withUser: "Ana",
    unread: 1,
    lastMessage: "Ainda está disponível?",
    avatarUrl: null,
    timestamp: "Ontem",
  },
]

export function ChatList({ conversations, loading = false }: ChatListProps) {
  const [displayConversations, setDisplayConversations] = useState<Conversation[]>([])

  useEffect(() => {
    // Use provided conversations or fallback to mock data
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false"
    if (isDemoMode || !conversations) {
      setDisplayConversations(mockConversations)
    } else {
      setDisplayConversations(conversations)
    }
  }, [conversations])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (displayConversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Você ainda não possui conversas.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {displayConversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/chat?c=${conversation.id}`}
          aria-label={`Abrir conversa com ${conversation.withUser}`}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={conversation.avatarUrl || "/placeholder/avatar.jpg"}
                    alt={`Avatar de ${conversation.withUser}`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{conversation.withUser}</h3>
                    <div className="flex items-center gap-2">
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                          {conversation.unread}
                        </Badge>
                      )}
                      {conversation.timestamp && (
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
