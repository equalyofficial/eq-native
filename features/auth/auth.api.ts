import { api } from "@/lib/api";
import { parseApiError } from "@/lib/api-error";
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

// ─── Registration (OTP two-step) ───────────────────────────────────────────────

export async function registerInitiate(
  body: RegisterInitiateBody,
): Promise<OtpChallenge> {
  const { data, error } = await api.POST("/auth/register/initiate", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function registerVerify(
  body: RegisterVerifyBody,
): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/register/verify", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

// ─── Login ──────────────────────────────────────────────────────────────────

export async function login(body: LoginBody): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/login", {
    // body is an email-or-phone union; the generated path type may still be
    // phone-only until api.json is regenerated.
    body: body as never,
  });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function loginOtpInitiate(
  body: LoginOtpInitiateBody,
): Promise<OtpChallenge> {
  const { data, error } = await api.POST("/auth/login/otp/initiate", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function loginOtpVerify(
  body: LoginOtpVerifyBody,
): Promise<AuthTokenResponse> {
  const { data, error } = await api.POST("/auth/login/otp/verify", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function resendOtp(body: ResendOtpBody): Promise<OtpChallenge> {
  const { data, error } = await api.POST("/auth/otp/resend", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function forgotPassword(
  body: ForgotPasswordBody,
): Promise<{ message: string; dev_token: string | null }> {
  const { data, error } = await api.POST("/auth/forgot-password", { body });
  if (error) throw parseApiError(error);
  return data.data;
}

export async function resetPassword(body: ResetPasswordBody): Promise<string> {
  const { data, error } = await api.POST("/auth/reset-password", { body });
  if (error) throw parseApiError(error);
  return data.data.message;
}

// ─── OAuth ────────────────────────────────────────────────────────────────────

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

// ─── Tokens ───────────────────────────────────────────────────────────────────

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
