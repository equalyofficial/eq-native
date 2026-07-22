import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Keep cached data for 24h so it can be persisted to disk and shown
      // offline on next launch (must be >= the persister's maxAge).
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});
