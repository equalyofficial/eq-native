import createClient from "openapi-fetch";
import type { paths } from "./api-types";

// Update this to your backend URL — use env var in production
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = createClient<paths>({ baseUrl: BASE_URL });

/** Attach bearer token to every request — call this after login */
export function setAuthToken(token: string) {
  api.use({
    onRequest({ request }) {
      request.headers.set("Authorization", `Bearer ${token}`);
      return request;
    },
  });
}

/** Strip auth header — call this on logout */
export function clearAuthToken() {
  api.eject((middleware) => middleware as never);
}
