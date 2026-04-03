export const friendsKeys = {
  all: ['friends'] as const,
  lists: () => [...friendsKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...friendsKeys.lists(), filters] as const,
  details: () => [...friendsKeys.all, 'detail'] as const,
  detail: (id: string) => [...friendsKeys.details(), id] as const,
} as const;
