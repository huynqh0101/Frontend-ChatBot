import type { IRegister, ILogin, LoginResponse } from '@/contents/interfaces'
import { apiClient } from './apiClient'

export async function register(payload: IRegister): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/register', payload)
}

export async function login(payload: ILogin): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/login', payload)
}

export async function refreshToken(
  refreshToken: string
): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/refresh-token', { refreshToken })
}

export async function logout(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/auth/logout')
}

export async function getCurrentUser(): Promise<{ user: object }> {
  return apiClient.get<{ user: object }>('/auth/me')
}
