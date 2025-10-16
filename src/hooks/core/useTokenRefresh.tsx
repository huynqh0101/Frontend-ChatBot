'use client'

import { useCallback, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useTokenStorage } from './useTokenStorage'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface JwtPayload {
  id: string
  iat: number
  exp: number
}

interface RefreshResponse {
  user: object
  token: string
  refreshToken: string
}

export const useTokenRefresh = () => {
  const { getTokens, setTokens, clearTokens } = useTokenStorage()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)

  // Hàm kiểm tra token có hết hạn không
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      // Kiểm tra nếu token sẽ hết hạn trong vòng 5 phút tới
      return decoded.exp - currentTime < 300
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }, [])

  // Hàm refresh token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) {
      return false
    }

    isRefreshingRef.current = true

    try {
      const tokens = getTokens()
      if (!tokens?.refreshToken) {
        console.error('No refresh token available')
        clearTokens()
        return false
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
        }),
      })

      if (!response.ok) {
        throw new Error(`Refresh token failed: ${response.status}`)
      }

      const data: RefreshResponse = await response.json()

      // Lưu tokens mới
      setTokens(
        {
          accessToken: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
        },
        { rememberMe: true }
      )

      console.log('Token refreshed successfully')
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      clearTokens()
      // Redirect to login page
      window.location.href = '/login'
      return false
    } finally {
      isRefreshingRef.current = false
    }
  }, [getTokens, setTokens, clearTokens])

  // Hàm lên lịch refresh token tự động
  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        const currentTime = Date.now() / 1000
        const timeUntilExpiry = decoded.exp - currentTime

        // Lên lịch refresh trước khi token hết hạn 5 phút
        const refreshTime = Math.max(0, (timeUntilExpiry - 300) * 1000)

        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }

        refreshTimeoutRef.current = setTimeout(() => {
          refreshAccessToken()
        }, refreshTime)

        console.log(
          `Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
        )
      } catch (error) {
        console.error('Error scheduling token refresh:', error)
      }
    },
    [refreshAccessToken]
  )

  // Hàm kiểm tra và refresh token nếu cần
  const checkAndRefreshToken = useCallback(async (): Promise<string | null> => {
    const tokens = getTokens()
    if (!tokens?.accessToken) {
      return null
    }

    if (isTokenExpired(tokens.accessToken)) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        const newTokens = getTokens()
        return newTokens?.accessToken || null
      }
      return null
    }

    return tokens.accessToken
  }, [getTokens, isTokenExpired, refreshAccessToken])

  // Setup tự động refresh khi component mount
  useEffect(() => {
    const tokens = getTokens()
    if (tokens?.accessToken) {
      // Kiểm tra ngay khi mount
      if (isTokenExpired(tokens.accessToken)) {
        refreshAccessToken()
      } else {
        scheduleTokenRefresh(tokens.accessToken)
      }
    }

    // Cleanup timeout khi component unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [getTokens, isTokenExpired, refreshAccessToken, scheduleTokenRefresh])

  // Lắng nghe sự thay đổi token trong storage
  useEffect(() => {
    const handleStorageChange = () => {
      const tokens = getTokens()
      if (tokens?.accessToken && !isTokenExpired(tokens.accessToken)) {
        scheduleTokenRefresh(tokens.accessToken)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [getTokens, isTokenExpired, scheduleTokenRefresh])

  return {
    checkAndRefreshToken,
    refreshAccessToken,
    isTokenExpired,
  }
}
