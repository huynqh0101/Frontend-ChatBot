'use client';

import { isAuthRoute, isProtectedRoute, isPublicRoute } from '@/config/routes';
import { usePathname } from 'next/navigation';

export const useRoutes = () => {
  const pathname = usePathname();

  return {
    isProtectedRoute: isProtectedRoute(pathname),
    isAuthRoute: isAuthRoute(pathname),
    isPublicRoute: isPublicRoute(pathname),
    currentPath: pathname,
  };
};
