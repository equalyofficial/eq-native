import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setAuthToken, clearAuthToken } from '@/lib/api';
import { secureStorage } from '@/lib/secure-storage';
import type { AuthUser } from '@/features/auth/auth.types';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True once the persisted session has been read from secure storage. */
  hasHydrated: boolean;
};

type AuthActions = {
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => void;
  setUser: (user: AuthUser) => void;
  clearTokens: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setSession: (accessToken, refreshToken, user) => {
        setAuthToken(accessToken);
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      clearTokens: () => {
        clearAuthToken();
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'equaly-auth',
      storage: createJSONStorage(() => secureStorage),
      // Only persist session identity — not the hydration flag.
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        // Re-attach the bearer token to the API client after restore.
        if (!error && state?.accessToken) {
          setAuthToken(state.accessToken);
        }
        useAuthStore.getState().setHasHydrated(true);
      },
    },
  ),
);
