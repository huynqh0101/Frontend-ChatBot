export interface IRegister {
  name: string
  email: string
  password: string
  passwordconf: string
  image?: string
}

export interface ILogin {
  email: string
  password: string
}

export interface ApiMessage {
  id: string
  conversationId: string
  role: string
  content: string
  metadata?: JSON
  createdAt: string
}

export interface IUser {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
}

export interface LoginResponse {
  user: IUser
  token: string
  refreshToken: string
}

// Thêm interfaces cho Chat
export interface Conversation {
  id: string
  title: string
  createdAt?: string
  updatedAt?: string
}

export interface SendMessageResponse {
  conversation?: Conversation
  messages?: ApiMessage[]
  message?: ApiMessage | string // Fallback cho format cũ
  // Có thể có các field khác tùy theo API response
  [key: string]: unknown
}

// Common API response interfaces
export interface ApiError extends Error {
  status?: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

// Token related interfaces
export interface TokenData {
  accessToken: string
  refreshToken: string
  user: IUser
}

export interface TokenStorageOptions {
  rememberMe?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Common API responses
export interface MessageResponse {
  message: string
}

export interface QueueItem {
  resolve: (value: string | null) => void
  reject: (reason: Error) => void
}
