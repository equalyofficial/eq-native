export const expensesKeys = {
  all: ["expenses"] as const,
  lists: () => [...expensesKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...expensesKeys.lists(), filters] as const,
  details: () => [...expensesKeys.all, "detail"] as const,
  detail: (id: string) => [...expensesKeys.details(), id] as const,
} as const;
