'use client';

import { useTokenStorage } from '@/hooks/core/useTokenStorage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { hasTokens, clearTokens } = useTokenStorage();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = hasTokens();
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, [hasTokens]);

  const logout = () => {
    clearTokens();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return {
    isLoggedIn,
    isLoading,
    logout,
  };
};
