"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/src/components/layout/header"
import { BottomNav } from "@/src/components/layout/bottom-nav"
import { ChatList } from "@/src/components/chat/chat-list"
import { ChatWindow } from "@/src/components/chat/chat-window"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("c")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationId)

  useEffect(() => {
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [conversationId])

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="pb-20 md:pb-8">
        <div className="container px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Chat</h1>

          <div className="md:grid md:grid-cols-[320px_1fr] gap-4">
            {/* Chat List - Left Side */}
            <div className={`${selectedConversation ? "hidden md:block" : ""}`}>
              <ChatList />
            </div>

            {/* Chat Window - Right Side */}
            <div className={`${!selectedConversation ? "hidden md:block" : ""}`}>
              {selectedConversation ? (
                <ChatWindow conversationId={selectedConversation} withUser="Mariana" />
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Selecione uma conversa para começar</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
