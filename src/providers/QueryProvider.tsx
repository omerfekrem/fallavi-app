import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 dk boyunca tekrar okuma yok
            gcTime: 30 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false, // uygulama öne gelince otomatik okuma yok
            refetchOnReconnect: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
