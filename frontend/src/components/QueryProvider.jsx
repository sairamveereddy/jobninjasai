import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 20_000,
    },
    mutations: {
      onError: (err) => {
        toast.error(err?.message || 'Something went wrong. Please try again.');
      },
    },
  },
});

/**
 * Wraps the app with React Query + sonner toast provider.
 */
const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          fontWeight: 600,
          borderRadius: '16px',
        },
      }}
    />
  </QueryClientProvider>
);

export default QueryProvider;
