interface ApiError {
  message: string
  status: number
  code?: string
}

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private maxRetries: number

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"
    this.timeout = 30000 // 30 seconds
    this.maxRetries = 3
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null

    // Try to get from httpOnly cookie first (if available)
    // Fallback to localStorage
    return localStorage.getItem("auth_token")
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const token = this.getAuthToken()
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.status === 401) {
        // Redirect to login on unauthorized
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("Unauthorized")
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = {
          message: errorData.message || "Erro na requisição",
          status: response.status,
          code: errorData.code,
        }
        throw error
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      // Retry logic for network errors and 5xx status codes
      if (
        retryCount < this.maxRetries &&
        (error instanceof TypeError || // Network error
          (error as ApiError)?.status >= 500)
      ) {
        const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff
        await this.sleep(delay)
        return this.makeRequest(endpoint, options, retryCount + 1)
      }

      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.makeRequest<T>(url.pathname + url.search)
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
    })
  }

  async upload<T>(endpoint: string, formData: FormData, onProgress?: (progress: UploadProgress) => void): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const token = this.getAuthToken()

      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            }
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText as any)
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"))
      })

      xhr.open("POST", `${this.baseURL}${endpoint}`)

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  }
}

export const apiClient = new ApiClient()
