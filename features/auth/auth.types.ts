import type { operations } from "@/lib/api-types";

// ─── Request Bodies ───────────────────────────────────────────────────────────

export type RegisterBody =
  operations["postAuthRegister"]["requestBody"]["content"]["application/json"];

export type LoginBody =
  operations["postAuthLogin"]["requestBody"]["content"]["application/json"];

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

export type AuthUser =
  operations["postAuthLogin"]["responses"][200]["content"]["application/json"]["data"]["user"];

export type AuthTokenResponse =
  operations["postAuthLogin"]["responses"][200]["content"]["application/json"]["data"];
