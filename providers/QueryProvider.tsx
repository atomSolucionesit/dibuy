'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo que los datos se consideran frescos
            staleTime: 5 * 60 * 1000, // 5 minutos
            // Tiempo que los datos se mantienen en caché
            gcTime: 10 * 60 * 1000, // 10 minutos
            // Reintentos en caso de error
            retry: (failureCount, error: any) => {
              // No reintentar en errores 4xx (excepto 408, 429)
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return error?.response?.status === 408 || error?.response?.status === 429;
              }
              // Reintentar hasta 3 veces para otros errores
              return failureCount < 3;
            },
            // Refetch en window focus
            refetchOnWindowFocus: false,
            // Refetch en reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Reintentos para mutaciones
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
