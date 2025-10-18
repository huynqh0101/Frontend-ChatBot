import { LoginResponse, ApiError, QueueItem } from '@/contents/interfaces'
import { tokenUtils } from '@/utils/tokenUtils'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/forgot-password',
  '/auth/reset-password',
]

class ApiClient {
  private baseURL: string
  private isRefreshing: boolean = false
  private failedQueue: QueueItem[] = []

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private isPublicEndpoint(endpoint: string): boolean {
    return PUBLIC_ENDPOINTS.some((publicPath) =>
      endpoint.startsWith(publicPath)
    )
  }

  private shouldRetryWithRefresh(endpoint: string, status: number): boolean {
    return (
      status === 401 &&
      !this.isPublicEndpoint(endpoint) &&
      !!tokenUtils.getTokens()?.refreshToken
    )
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const tokens = tokenUtils.getTokens()
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Refresh token failed')
      }

      const data: LoginResponse = await response.json()

      // Lưu token với rememberMe = true để giữ được thời gian refresh
      tokenUtils.setTokens(
        {
          accessToken: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
        },
        { rememberMe: true }
      )

      // Dispatch custom event để useTokenRefresh biết token đã được refresh
      window.dispatchEvent(
        new CustomEvent('tokenRefreshed', {
          detail: { token: data.token },
        })
      )

      return data.token
    } catch (error) {
      tokenUtils.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw error
    }
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })

    this.failedQueue = []
  }

  private createApiError(message: string, status: number): ApiError {
    const error = new Error(message) as ApiError
    error.status = status
    return error
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Lấy token từ tokenUtils
    if (!this.isPublicEndpoint(endpoint)) {
      const tokens = tokenUtils.getTokens()
      if (tokens?.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        }
      }
    }

    if (!options.headers) {
      options.headers = {}
    }

    if (
      options.body &&
      !Object.hasOwnProperty.call(options.headers, 'Content-Type')
    ) {
      ;(options.headers as Record<string, string>)['Content-Type'] =
        'application/json'
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options)

      if (this.shouldRetryWithRefresh(endpoint, response.status)) {
        if (this.isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            this.failedQueue.push({
              resolve: (token: string | null) => {
                if (token) {
                  this.request<T>(endpoint, {
                    ...options,
                    headers: {
                      ...options.headers,
                      Authorization: `Bearer ${token}`,
                    },
                  })
                    .then(resolve)
                    .catch(reject)
                } else {
                  reject(new Error('Token refresh failed'))
                }
              },
              reject,
            })
          })
        }

        this.isRefreshing = true

        try {
          const newToken = await this.refreshToken()
          this.processQueue(null, newToken)

          const newOptions = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }

          const retryResponse = await fetch(
            `${this.baseURL}${endpoint}`,
            newOptions
          )

          if (!retryResponse.ok) {
            let errorMessage = `Request failed: ${retryResponse.status}`
            try {
              const errorData = await retryResponse.json()
              errorMessage = errorData.message || errorMessage
            } catch {
              // Ignore JSON parse errors
            }
            throw this.createApiError(errorMessage, retryResponse.status)
          }

          return retryResponse.json()
        } catch (refreshError) {
          this.processQueue(refreshError as Error, null)
          throw refreshError
        } finally {
          this.isRefreshing = false
        }
      }

      // Handle other errors
      if (!response.ok) {
        let errorMessage = `Request failed: ${response.status}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // Nếu không parse được JSON, dùng default message
          switch (response.status) {
            case 400:
              errorMessage = 'Bad Request'
              break
            case 403:
              errorMessage = 'Forbidden'
              break
            case 404:
              errorMessage = 'Not Found'
              break
            case 500:
              errorMessage = 'Internal Server Error'
              break
          }
        }

        throw this.createApiError(errorMessage, response.status)
      }

      // Handle empty response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const text = await response.text()
        return text ? JSON.parse(text) : ({} as T)
      } else {
        return response.text() as unknown as T
      }
    } catch (error) {
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
