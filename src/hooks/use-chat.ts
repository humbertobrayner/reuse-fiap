"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: "text" | "image"
}

interface ChatState {
  messages: Message[]
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export function useChat(conversationId?: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3

  const connect = useCallback(() => {
    // Check if WebSocket URL is configured
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL

    if (!wsUrl) {
      console.log("[v0] WebSocket URL not configured, chat will work in offline mode")
      setState((prev) => ({
        ...prev,
        error: "Chat em modo offline - WebSocket não configurado",
        isConnecting: false,
        isConnected: false,
      }))
      return
    }

    if (!conversationId) {
      console.log("[v0] No conversation ID provided, skipping WebSocket connection")
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const ws = new WebSocket(`${wsUrl}/chat/${conversationId}`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[v0] WebSocket connected successfully")
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }))
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Message
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
          }))
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        console.log("[v0] WebSocket error:", error)
        setState((prev) => ({
          ...prev,
          error: "Erro de conexão com o chat",
          isConnecting: false,
        }))
      }

      ws.onclose = (event) => {
        console.log("[v0] WebSocket connection closed:", event.code, event.reason)
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }))

        // Attempt to reconnect if it wasn't a clean close and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)

          console.log(
            `[v0] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket connection:", error)
      setState((prev) => ({
        ...prev,
        error: "Falha ao conectar com o chat",
        isConnecting: false,
        isConnected: false,
      }))
    }
  }, [conversationId])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected")
      wsRef.current = null
    }

    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }))
  }, [])

  const sendMessage = useCallback((content: string, type: "text" | "image" = "text") => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("[v0] WebSocket not connected, cannot send message")
      setState((prev) => ({
        ...prev,
        error: "Não é possível enviar mensagem - desconectado",
      }))
      return false
    }

    try {
      const message = {
        content,
        type,
        timestamp: new Date().toISOString(),
      }

      wsRef.current.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      setState((prev) => ({
        ...prev,
        error: "Falha ao enviar mensagem",
      }))
      return false
    }
  }, [])

  // Connect when conversationId changes
  useEffect(() => {
    if (conversationId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [conversationId, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    messages: state.messages,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
    sendMessage,
    connect,
    disconnect,
  }
}
