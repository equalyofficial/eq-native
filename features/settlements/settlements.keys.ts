export const settlementsKeys = {
  all: ['settlements'] as const,
  lists: () => [...settlementsKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...settlementsKeys.lists(), filters] as const,
  details: () => [...settlementsKeys.all, 'detail'] as const,
  detail: (id: string) => [...settlementsKeys.details(), id] as const,
} as const;
