import ky, { HTTPError, isHTTPError } from "ky";
import { env } from "@/lib/env";

export type ApiErrorData = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

export const kyClient = ky.create({
  prefix: env.EXPO_PUBLIC_SERVER_URL,
  timeout: 10000,
  retry: {
    limit: 2,
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // Inject auth token here when auth flow is added
        // e.g. request.headers.set("Authorization", `Bearer ${token}`);
        void request;
      },
    ],
    beforeError: [
      ({ error }) => {
        // Custom error formatting or logging can be performed here
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
    if (typeof data?.message === "string") {
      return data.message;
    }
    if (typeof data?.detail === "string") {
      return data.detail;
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
