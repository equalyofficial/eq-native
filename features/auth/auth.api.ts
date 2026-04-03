import { api } from "@/lib/api";
import { parseApiError } from "@/lib/api-error";
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
} from "./auth.types";

export async function register(body: RegisterBody): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/register", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function login(body: LoginBody): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/login", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function forgotPassword(
  body: ForgotPasswordBody,
): Promise<string> {
  const { data, error } = await api.POST("/auth/forgot-password", { body });
  if (error) throw parseApiError(error);
  return data.data.message;
}

export async function resetPassword(body: ResetPasswordBody): Promise<string> {
  const { data, error } = await api.POST("/auth/reset-password", { body });
  if (error) throw parseApiError(error);
  return data.data.message;
}

export async function signInWithGoogle(
  body: GoogleAuthBody,
): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/google", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function signInWithApple(
  body: AppleAuthBody,
): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/apple", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function refreshTokens(
  body: RefreshBody,
): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/refresh", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function logout(body: LogoutBody): Promise<void> {
  const { error } = await api.POST("/auth/logout", { body });
  if (error) throw parseApiError(error);
}
