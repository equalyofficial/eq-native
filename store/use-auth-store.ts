import { create } from 'zustand';
import { setAuthToken, clearAuthToken } from '@/lib/api';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) => {
    setAuthToken(accessToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  clearTokens: () => {
    clearAuthToken();
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
