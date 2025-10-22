'use client'

import { useTokenRefresh } from '@/hooks/core/useTokenRefresh'
import { ReactNode } from 'react'

export function TokenRefreshProvider({ children }: { children: ReactNode }) {
  // Hook này sẽ tự động chạy và schedule refresh token
  useTokenRefresh()

  return <>{children}</>
}
