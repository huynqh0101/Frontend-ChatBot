'use client'

import { useTokenStorage } from '@/hooks/core/useTokenStorage'
import { useTokenRefresh } from '@/hooks/core/useTokenRefresh'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const { hasTokens, clearTokens, getTokens } = useTokenStorage()
  const { checkAndRefreshToken } = useTokenRefresh()

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const token = await checkAndRefreshToken()
        setIsLoggedIn(!!token)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [checkAndRefreshToken])

  // Listen for storage changes (login from another tab)
  useEffect(() => {
    const handleStorageChange = async () => {
      try {
        const token = await checkAndRefreshToken()
        setIsLoggedIn(!!token)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAndRefreshToken])

  const logout = () => {
    clearTokens()
    setIsLoggedIn(false)
    router.push('/login')
  }

  const getValidToken = async (): Promise<string | null> => {
    return await checkAndRefreshToken()
  }

  return {
    isLoggedIn,
    isLoading,
    logout,
    getValidToken,
  }
}
