import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";
import ky, { HTTPError, isHTTPError } from "ky";

export type ApiErrorData = {
  message?: string;
  detail?: string;
  details?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

const baseUrl = env.EXPO_PUBLIC_SERVER_URL.replace(/\/+$/, "");
const apiPrefix = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

export const kyClient = ky.create({
  prefix: apiPrefix,
  timeout: 15000,
  retry: {
    limit: 1,
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      ({ error }) => {
        return error;
      },
    ],
  },
});

export const getApiErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred",
): string => {
  if (isHTTPError(error)) {
    const data = error.data as ApiErrorData | undefined;
    if (typeof data?.details === "string") {
      return data.details;
    }
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
    if (typeof data?.error === "string") {
      return data.error;
    }
    return `Error ${error.response.status}: ${error.response.statusText || fallback}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export { HTTPError, isHTTPError };
