"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/src/components/shared/empty-state"
import { useConversations } from "@/src/hooks/use-chat"
import { MessageCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConversationListProps {
  selectedConversationId?: string
  onSelectConversation: (conversationId: string) => void
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { data: conversations, isLoading, error } = useConversations()

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("pt-BR", {
        weekday: "short",
      })
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Erro ao carregar conversas"
        description="Não foi possível carregar suas conversas. Tente novamente."
        action={{
          label: "Tentar novamente",
          onClick: () => window.location.reload(),
        }}
      />
    )
  }

  if (!conversations?.length) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nenhuma conversa"
        description="Você ainda não tem conversas. Comece fazendo uma proposta em um produto!"
      />
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-muted/50",
            selectedConversationId === conversation.id && "bg-muted border-primary",
          )}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {conversation.participantName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">{conversation.participantName}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(conversation.updatedAt)}
                  </div>
                </div>

                {/* Product Info */}
                {conversation.productTitle && (
                  <p className="text-xs text-muted-foreground mb-1 truncate">📦 {conversation.productTitle}</p>
                )}

                {/* Last Message */}
                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.type === "proposal" && "💰 "}
                    {conversation.lastMessage.senderId === "current-user" && "Você: "}
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
