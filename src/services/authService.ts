import type { IRegister, ILogin } from '@/contents/interfaces'
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function register(payload: IRegister) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Register failed')
  }
  return res.json()
}

export async function login(payload: ILogin) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Login failed')
  }
  return res.json()
}
