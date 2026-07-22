import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./api-types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.16.157:3000";

export const api = createClient<paths>({ baseUrl: BASE_URL });

let authMiddleware: Middleware | null = null;

/** Attach bearer token to every request — call this after login */
export function setAuthToken(token: string) {
  if (authMiddleware) {
    api.eject(authMiddleware);
  }
  authMiddleware = {
    onRequest({ request }) {
      request.headers.set("Authorization", `Bearer ${token}`);
      return request;
    },
  };
  api.use(authMiddleware);
}

/** Strip auth header — call this on logout */
export function clearAuthToken() {
  if (authMiddleware) {
    api.eject(authMiddleware);
    authMiddleware = null;
  }
}
