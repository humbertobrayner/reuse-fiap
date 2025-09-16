"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Message {
  id: string
  fromUser: string
  text: string
  timestamp: string
  type: "text" | "proposal"
}

interface ChatWindowProps {
  conversationId?: string
  withUser?: string
  messages?: Message[]
  onSendMessage?: (message: string, type: "text" | "proposal") => void
}

// Mock messages for demo
const mockMessages: Message[] = [
  {
    id: "m1",
    fromUser: "eu",
    text: "Olá! Ainda disponível?",
    timestamp: "2025-09-11T10:00:00Z",
    type: "text",
  },
  {
    id: "m2",
    fromUser: "Mariana",
    text: "Sim! Aceito proposta.",
    timestamp: "2025-09-11T10:01:00Z",
    type: "text",
  },
  {
    id: "m3",
    fromUser: "eu",
    text: "Proponho troca pelo meu item.",
    timestamp: "2025-09-11T10:02:00Z",
    type: "proposal",
  },
]

export function ChatWindow({ conversationId, withUser = "Usuário", messages, onSendMessage }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("")
  const [displayMessages, setDisplayMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use provided messages or fallback to mock data
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false"
    if (isDemoMode || !messages) {
      setDisplayMessages(mockMessages)
    } else {
      setDisplayMessages(messages)
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayMessages])

  const handleSendMessage = (type: "text" | "proposal" = "text") => {
    if (!messageText.trim()) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      fromUser: "eu",
      text: messageText,
      timestamp: new Date().toISOString(),
      type,
    }

    setDisplayMessages((prev) => [...prev, newMessage])
    onSendMessage?.(messageText, type)
    setMessageText("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleProposalClick = () => {
    setMessageText("Proponho troca pelo meu item.")
    handleSendMessage("proposal")
  }

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp))
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <Image
            src="/placeholder/avatar.jpg"
            alt={`Avatar de ${withUser}`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h3 className="font-medium">{withUser}</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {displayMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhuma mensagem ainda. Envie a primeira!</p>
          </div>
        ) : (
          displayMessages.map((message) => (
            <div key={message.id} className={`flex ${message.fromUser === "eu" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  message.fromUser === "eu" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.type === "proposal" && (
                  <Badge variant="secondary" className="mb-1 text-xs">
                    Proposta
                  </Badge>
                )}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="p-4 border-t space-y-3">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleProposalClick} className="text-xs bg-transparent">
            Propor troca
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              aria-label="Anexar arquivo"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => handleSendMessage()} disabled={!messageText.trim()} aria-label="Enviar mensagem">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
