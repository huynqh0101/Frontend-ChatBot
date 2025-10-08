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
