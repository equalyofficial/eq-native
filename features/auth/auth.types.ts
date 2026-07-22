import type { operations } from "@/lib/api-types";

// ─── Request Bodies ───────────────────────────────────────────────────────────

export type RegisterInitiateBody =
  operations["postAuthRegisterInitiate"]["requestBody"]["content"]["application/json"];

export type RegisterVerifyBody =
  operations["postAuthRegisterVerify"]["requestBody"]["content"]["application/json"];

/**
 * Login accepts either email or phone (plus password). The backend supports the
 * union; the generated `postAuthLogin` body may lag until api.json is
 * regenerated, so this is declared explicitly to stay correct either way.
 */
export type LoginBody =
  | { email: string; password: string }
  | { phone: string; password: string };

export type LoginOtpInitiateBody =
  operations["postAuthLoginOtpInitiate"]["requestBody"]["content"]["application/json"];

export type LoginOtpVerifyBody =
  operations["postAuthLoginOtpVerify"]["requestBody"]["content"]["application/json"];

export type ResendOtpBody =
  operations["postAuthOtpResend"]["requestBody"]["content"]["application/json"];

export type ForgotPasswordBody =
  operations["postAuthForgot-password"]["requestBody"]["content"]["application/json"];

export type ResetPasswordBody =
  operations["postAuthReset-password"]["requestBody"]["content"]["application/json"];

export type GoogleAuthBody =
  operations["postAuthGoogle"]["requestBody"]["content"]["application/json"];

export type AppleAuthBody =
  operations["postAuthApple"]["requestBody"]["content"]["application/json"];

export type RefreshBody =
  operations["postAuthRefresh"]["requestBody"]["content"]["application/json"];

export type LogoutBody =
  operations["postAuthLogout"]["requestBody"]["content"]["application/json"];

// ─── Response Data ────────────────────────────────────────────────────────────

export type AuthTokenResponse =
  operations["postAuthLogin"]["responses"][200]["content"]["application/json"]["data"];

export type AuthUser = AuthTokenResponse["user"];

export type OtpChallenge =
  operations["postAuthRegisterInitiate"]["responses"][201]["content"]["application/json"]["data"];
