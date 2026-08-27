import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8200/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL.replace(/\/$/, "")}/`,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("ngrok-skip-browser-warning", "true");
    return headers;
  },
});

const baseQueryWithLogging: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const url = typeof args === "string" ? args : args.url;
  const method = typeof args === "string" ? "GET" : args.method || "GET";
  const body = typeof args === "string" ? undefined : args.body;

  console.log(`\n========================================`);
  console.log(`🚀 [API REQUEST] ${method} ${url}`);
  if (body) {
    console.log(`📦 [PAYLOAD]:`, JSON.stringify(body, null, 2));
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.log(
      `❌ [API ERROR] ${method} ${url}:`,
      JSON.stringify(result.error, null, 2),
    );
  } else {
    console.log(
      `✅ [API SUCCESS] ${method} ${url}:`,
      JSON.stringify(result.data, null, 2),
    );
  }
  console.log(`========================================\n`);

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithLogging,
  tagTypes: [
    "User",
    "Agency",
    "TourPlan",
    "Profile",
    "Shop",
    "Dashboard",
    "Booking",
  ],
  endpoints: () => ({}),
});
