import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8200/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL.replace(/\/$/, "")}/`,
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Agency",
    "TourPlan",
    "Profile",
    "Shop",
    "Dashboard",
    "Booking",
    "BookingCalendar",
  ],
  endpoints: () => ({}),
});
