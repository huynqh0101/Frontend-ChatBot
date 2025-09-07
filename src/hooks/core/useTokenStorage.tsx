'use client';

import Cookies from 'js-cookie';
import { useCallback } from 'react';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  selectedCompany: string;
}

interface TokenStorageOptions {
  rememberMe?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const useTokenStorage = () => {
  const setTokens = useCallback(
    (tokens: TokenData, options: TokenStorageOptions = {}) => {
      const {
        rememberMe = false,
        secure = process.env.NODE_ENV === 'production',
        sameSite = 'strict',
      } = options;

      // Cookie options
      const cookieOptions = {
        secure,
        sameSite,
        expires: rememberMe ? 30 : undefined, // 30 days if remember me, session cookie otherwise
      };

      // Store in cookies (for middleware/SSR access)
      Cookies.set('accessToken', tokens.accessToken, cookieOptions);
      Cookies.set('refreshToken', tokens.refreshToken, cookieOptions);
      Cookies.set('selectedCompany', tokens.selectedCompany, cookieOptions);

      // Store in localStorage/sessionStorage (for client-side access)
      if (rememberMe) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('selectedCompany', tokens.selectedCompany);
      } else {
        sessionStorage.setItem('accessToken', tokens.accessToken);
        sessionStorage.setItem('refreshToken', tokens.refreshToken);
        sessionStorage.setItem('selectedCompany', tokens.selectedCompany);
      }

      console.log('Tokens stored successfully', { rememberMe, secure });
    },
    []
  );

  const getTokens = useCallback((): TokenData | null => {
    // Try cookies first (for SSR/middleware)
    const cookieToken = Cookies.get('accessToken');
    if (cookieToken) {
      return {
        accessToken: cookieToken,
        refreshToken: Cookies.get('refreshToken') || '',
        selectedCompany: Cookies.get('selectedCompany') || '',
      };
    }

    // Fallback to localStorage
    const localToken = localStorage.getItem('accessToken');
    if (localToken) {
      return {
        accessToken: localToken,
        refreshToken: localStorage.getItem('refreshToken') || '',
        selectedCompany: localStorage.getItem('selectedCompany') || '',
      };
    }

    // Fallback to sessionStorage
    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) {
      return {
        accessToken: sessionToken,
        refreshToken: sessionStorage.getItem('refreshToken') || '',
        selectedCompany: sessionStorage.getItem('selectedCompany') || '',
      };
    }

    return null;
  }, []);

  const clearTokens = useCallback(() => {
    // Clear cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('selectedCompany');

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('selectedCompany');

    // Clear sessionStorage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('selectedCompany');

    console.log('All tokens cleared successfully');
  }, []);

  const hasTokens = useCallback((): boolean => {
    return getTokens() !== null;
  }, [getTokens]);

  const getAccessToken = useCallback((): string | null => {
    const tokens = getTokens();
    return tokens?.accessToken || null;
  }, [getTokens]);

  const getSelectedCompany = useCallback((): string | null => {
    const tokens = getTokens();
    return tokens?.selectedCompany || null;
  }, [getTokens]);

  return {
    setTokens,
    getTokens,
    clearTokens,
    hasTokens,
    getAccessToken,
    getSelectedCompany,
  };
};
