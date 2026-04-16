import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { useAuthStore } from '@/store/use-auth-store';
import type { ApiError } from '@/lib/api-error';
import * as authApi from './auth.api';
import type {
  AppleAuthBody,
  AuthTokenResponse,
  ForgotPasswordBody,
  GoogleAuthBody,
  LoginBody,
  LogoutBody,
  RefreshBody,
  RegisterBody,
  ResetPasswordBody,
} from './auth.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function onAuthSuccess(data: AuthTokenResponse) {
  useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
}

function onLogoutSuccess() {
  useAuthStore.getState().clearTokens();
  queryClient.clear();
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
 
export function useRegister(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, any>
) {
  return useMutation<AuthTokenResponse, ApiError, any>({
    mutationFn: (vars) => authApi.register(vars as any),
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useLogin(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, LoginBody>
) {
  return useMutation<AuthTokenResponse, ApiError, LoginBody>({
    mutationFn: authApi.login,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useForgotPassword(
  options?: UseMutationOptions<string, ApiError, ForgotPasswordBody>
) {
  return useMutation<string, ApiError, ForgotPasswordBody>({
    mutationFn: authApi.forgotPassword,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<string, ApiError, ResetPasswordBody>
) {
  return useMutation<string, ApiError, ResetPasswordBody>({
    mutationFn: authApi.resetPassword,
    ...options,
  });
}

export function useGoogleSignIn(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, GoogleAuthBody>
) {
  return useMutation<AuthTokenResponse, ApiError, GoogleAuthBody>({
    mutationFn: authApi.signInWithGoogle,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useAppleSignIn(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, AppleAuthBody>
) {
  return useMutation<AuthTokenResponse, ApiError, AppleAuthBody>({
    mutationFn: authApi.signInWithApple,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useRefreshTokens(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, RefreshBody>
) {
  return useMutation<AuthTokenResponse, ApiError, RefreshBody>({
    mutationFn: authApi.refreshTokens,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useLogout(
  options?: UseMutationOptions<void, ApiError, LogoutBody>
) {
  return useMutation<void, ApiError, LogoutBody>({
    mutationFn: authApi.logout,
    onSuccess(data, vars, ctx, mutation) {
      onLogoutSuccess();
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}
