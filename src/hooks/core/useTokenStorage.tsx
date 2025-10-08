'use client'

import Cookies from 'js-cookie'
import { useCallback } from 'react'

interface TokenData {
  accessToken: string
  refreshToken: string
  user: object
}

interface TokenStorageOptions {
  rememberMe?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export const useTokenStorage = () => {
  const setTokens = useCallback(
    (tokens: TokenData, options: TokenStorageOptions = {}) => {
      const {
        rememberMe = false,
        secure = process.env.NODE_ENV === 'production',
        sameSite = 'strict',
      } = options

      const cookieOptions = {
        secure,
        sameSite,
        expires: rememberMe ? 30 : undefined,
      }

      // Lưu vào cookies
      Cookies.set('accessToken', tokens.accessToken, cookieOptions)
      Cookies.set('refreshToken', tokens.refreshToken, cookieOptions)
      Cookies.set('user', JSON.stringify(tokens.user), cookieOptions)

      // Lưu vào localStorage/sessionStorage
      if (rememberMe) {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(tokens.user))
      } else {
        sessionStorage.setItem('accessToken', tokens.accessToken)
        sessionStorage.setItem('refreshToken', tokens.refreshToken)
        sessionStorage.setItem('user', JSON.stringify(tokens.user))
      }

      console.log('Tokens and user stored successfully', { rememberMe, secure })
    },
    []
  )

  const getTokens = useCallback((): TokenData | null => {
    // Cookies
    const cookieToken = Cookies.get('accessToken')
    if (cookieToken) {
      return {
        accessToken: cookieToken,
        refreshToken: Cookies.get('refreshToken') || '',
        user: Cookies.get('user')
          ? JSON.parse(Cookies.get('user') as string)
          : {},
      }
    }

    // localStorage
    const localToken = localStorage.getItem('accessToken')
    if (localToken) {
      return {
        accessToken: localToken,
        refreshToken: localStorage.getItem('refreshToken') || '',
        user: localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user') as string)
          : {},
      }
    }

    // sessionStorage
    const sessionToken = sessionStorage.getItem('accessToken')
    if (sessionToken) {
      return {
        accessToken: sessionToken,
        refreshToken: sessionStorage.getItem('refreshToken') || '',
        user: sessionStorage.getItem('user')
          ? JSON.parse(sessionStorage.getItem('user') as string)
          : {},
      }
    }

    return null
  }, [])

  const clearTokens = useCallback(() => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')

    console.log('All tokens and user cleared successfully')
  }, [])

  const hasTokens = useCallback((): boolean => {
    return getTokens() !== null
  }, [getTokens])

  const getAccessToken = useCallback((): string | null => {
    const tokens = getTokens()
    return tokens?.accessToken || null
  }, [getTokens])

  const getUser = useCallback((): object | null => {
    const tokens = getTokens()
    return tokens?.user || null
  }, [getTokens])

  return {
    setTokens,
    getTokens,
    clearTokens,
    hasTokens,
    getAccessToken,
    getUser,
  }
}
