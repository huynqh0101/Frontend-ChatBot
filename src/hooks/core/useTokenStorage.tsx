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

      // Chỉ lưu tokens vào cookies (không lưu user vì quá lớn)
      Cookies.set('accessToken', tokens.accessToken, cookieOptions)
      Cookies.set('refreshToken', tokens.refreshToken, cookieOptions)

      // Lưu user vào localStorage/sessionStorage
      const userString = JSON.stringify(tokens.user)
      if (rememberMe) {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        localStorage.setItem('user', userString)
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('accessToken', tokens.accessToken)
        sessionStorage.setItem('refreshToken', tokens.refreshToken)
        sessionStorage.setItem('user', userString)
      }

      console.log('Tokens stored successfully', { rememberMe, secure })
    },
    []
  )

  const getTokens = useCallback((): TokenData | null => {
    // Ưu tiên cookies cho tokens
    const cookieAccessToken = Cookies.get('accessToken')
    const cookieRefreshToken = Cookies.get('refreshToken')

    // Kiểm tra localStorage (rememberMe)
    const localAccessToken = localStorage.getItem('accessToken')
    const localRefreshToken = localStorage.getItem('refreshToken')
    const localUser = localStorage.getItem('user')

    // Kiểm tra sessionStorage
    const sessionAccessToken = sessionStorage.getItem('accessToken')
    const sessionRefreshToken = sessionStorage.getItem('refreshToken')
    const sessionUser = sessionStorage.getItem('user')

    // Cookies có token
    if (cookieAccessToken && cookieRefreshToken) {
      // Lấy user từ localStorage hoặc sessionStorage
      const userStr = localUser || sessionUser
      return {
        accessToken: cookieAccessToken,
        refreshToken: cookieRefreshToken,
        user: userStr ? JSON.parse(userStr) : {},
      }
    }

    // localStorage có token (rememberMe)
    if (localAccessToken && localRefreshToken) {
      return {
        accessToken: localAccessToken,
        refreshToken: localRefreshToken,
        user: localUser ? JSON.parse(localUser) : {},
      }
    }

    // sessionStorage có token
    if (sessionAccessToken && sessionRefreshToken) {
      return {
        accessToken: sessionAccessToken,
        refreshToken: sessionRefreshToken,
        user: sessionUser ? JSON.parse(sessionUser) : {},
      }
    }

    return null
  }, [])

  const clearTokens = useCallback(() => {
    // Clear cookies
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')

    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')

    // Clear sessionStorage
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')

    console.log('All tokens cleared successfully')
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
