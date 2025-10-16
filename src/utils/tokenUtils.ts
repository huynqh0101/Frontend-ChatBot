import Cookies from 'js-cookie'
import { TokenData, TokenStorageOptions } from '@/contents/interfaces'

export const tokenUtils = {
  getTokens: (): TokenData | null => {
    if (typeof window === 'undefined') return null

    // Try cookies first
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

    // Try localStorage
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

    // Try sessionStorage
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
  },

  setTokens: (tokens: TokenData, options: TokenStorageOptions = {}) => {
    if (typeof window === 'undefined') return

    const {
      rememberMe = true,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
    } = options

    const cookieOptions = {
      secure,
      sameSite,
      expires: rememberMe ? 30 : undefined,
    }

    // Set cookies
    Cookies.set('accessToken', tokens.accessToken, cookieOptions)
    Cookies.set('refreshToken', tokens.refreshToken, cookieOptions)
    Cookies.set('user', JSON.stringify(tokens.user), cookieOptions)

    // Set storage
    if (rememberMe) {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(tokens.user))
    } else {
      sessionStorage.setItem('accessToken', tokens.accessToken)
      sessionStorage.setItem('refreshToken', tokens.refreshToken)
      sessionStorage.setItem('user', JSON.stringify(tokens.user))
    }
  },

  clearTokens: () => {
    if (typeof window === 'undefined') return

    // Clear cookies
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')

    // Clear storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
  },

  hasTokens: (): boolean => {
    return tokenUtils.getTokens() !== null
  },

  getAccessToken: (): string | null => {
    const tokens = tokenUtils.getTokens()
    return tokens?.accessToken || null
  },
}
