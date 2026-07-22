import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { useAuthStore } from "@/store/use-auth-store";
import type { ApiError } from "@/lib/api-error";
import * as authApi from "./auth.api";
import type {
  AppleAuthBody,
  AuthTokenResponse,
  ForgotPasswordBody,
  GoogleAuthBody,
  LoginBody,
  LoginOtpInitiateBody,
  LoginOtpVerifyBody,
  LogoutBody,
  OtpChallenge,
  RefreshBody,
  RegisterInitiateBody,
  RegisterVerifyBody,
  ResendOtpBody,
  ResetPasswordBody,
} from "./auth.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function onAuthSuccess(data: AuthTokenResponse) {
  useAuthStore
    .getState()
    .setSession(data.access_token, data.refresh_token, data.user);
}

function onLogoutSuccess() {
  useAuthStore.getState().clearTokens();
  queryClient.clear();
}

// ─── Registration ───────────────────────────────────────────────────────────

export function useRegisterInitiate(
  options?: UseMutationOptions<OtpChallenge, ApiError, RegisterInitiateBody>,
) {
  return useMutation<OtpChallenge, ApiError, RegisterInitiateBody>({
    mutationFn: authApi.registerInitiate,
    ...options,
  });
}

export function useRegisterVerify(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, RegisterVerifyBody>,
) {
  return useMutation<AuthTokenResponse, ApiError, RegisterVerifyBody>({
    mutationFn: authApi.registerVerify,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────

export function useLogin(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, LoginBody>,
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

export function useLoginOtpInitiate(
  options?: UseMutationOptions<OtpChallenge, ApiError, LoginOtpInitiateBody>,
) {
  return useMutation<OtpChallenge, ApiError, LoginOtpInitiateBody>({
    mutationFn: authApi.loginOtpInitiate,
    ...options,
  });
}

export function useLoginOtpVerify(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, LoginOtpVerifyBody>,
) {
  return useMutation<AuthTokenResponse, ApiError, LoginOtpVerifyBody>({
    mutationFn: authApi.loginOtpVerify,
    onSuccess(data, vars, ctx, mutation) {
      onAuthSuccess(data);
      options?.onSuccess?.(data, vars, ctx, mutation);
    },
    ...options,
  });
}

export function useResendOtp(
  options?: UseMutationOptions<OtpChallenge, ApiError, ResendOtpBody>,
) {
  return useMutation<OtpChallenge, ApiError, ResendOtpBody>({
    mutationFn: authApi.resendOtp,
    ...options,
  });
}

// ─── Password reset ───────────────────────────────────────────────────────────

export function useForgotPassword(
  options?: UseMutationOptions<
    { message: string; dev_token: string | null },
    ApiError,
    ForgotPasswordBody
  >,
) {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<string, ApiError, ResetPasswordBody>,
) {
  return useMutation<string, ApiError, ResetPasswordBody>({
    mutationFn: authApi.resetPassword,
    ...options,
  });
}

// ─── OAuth ────────────────────────────────────────────────────────────────────

export function useGoogleSignIn(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, GoogleAuthBody>,
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
  options?: UseMutationOptions<AuthTokenResponse, ApiError, AppleAuthBody>,
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

// ─── Tokens ───────────────────────────────────────────────────────────────────

export function useRefreshTokens(
  options?: UseMutationOptions<AuthTokenResponse, ApiError, RefreshBody>,
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
  options?: UseMutationOptions<void, ApiError, LogoutBody>,
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
