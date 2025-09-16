import { apiClient } from "./client"

// Auth endpoints
export const authApi = {
  me: () => apiClient.get("/auth/me"),
}

// Products endpoints
export const productsApi = {
  list: (params?: {
    q?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
    page?: number
    pageSize?: number
  }) => apiClient.get("/products", params),

  get: (id: string) => apiClient.get(`/products/${id}`),

  create: (data: FormData) => apiClient.upload("/products", data),

  toggleFavorite: (id: string) => apiClient.post(`/products/${id}/favorite`),
}

// Categories endpoints
export const categoriesApi = {
  list: () => apiClient.get("/categories"),
}

// Chat endpoints
export const chatApi = {
  conversations: () => apiClient.get("/conversations"),

  messages: (conversationId: string, params?: { page?: number; pageSize?: number }) =>
    apiClient.get(`/conversations/${conversationId}/messages`, params),

  sendMessage: (conversationId: string, data: { content: string; type?: string }) =>
    apiClient.post(`/conversations/${conversationId}/messages`, data),
}

// Search endpoints
export const searchApi = {
  suggest: (q: string) => apiClient.get("/search/suggest", { q }),
}
