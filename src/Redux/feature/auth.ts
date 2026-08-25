import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "@/lib/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8200/api";

// Raw base query with auth headers
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

export interface UserProfileData {
  id: string;
  email: string;
  username: string;
  role: string;
  full_name: string;
  image: string | null;
  phone: string;
  address: string;
  last_active_at?: string;
  date_joined?: string;
}

export interface NotificationItem {
  id: number;
  user: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsData {
  unread_count: number;
  notifications: NotificationItem[];
}

export const authentication = createApi({
  reducerPath: "authentication",
  baseQuery: async (args, api, extraOptions) => {
    const requestUrl =
      typeof args === "string"
        ? `${BASE_URL.replace(/\/$/, "")}/${args}`
        : `${BASE_URL.replace(/\/$/, "")}/${(args as any).url}`;
    const method =
      typeof args === "string" ? "GET" : ((args as any).method ?? "GET");
    const body = typeof args === "string" ? undefined : (args as any).body;

    console.log(
      "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" +
        "\n📤 [REQUEST]" +
        `\n   Endpoint : ${api.endpoint}` +
        `\n   Method   : ${method}` +
        `\n   URL      : ${requestUrl}` +
        `\n   Payload  :\n${body ? JSON.stringify(body, null, 4) : "   none"}` +
        "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      console.log(
        "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" +
          "\n❌ [RESPONSE ERROR]" +
          `\n   Endpoint  : ${api.endpoint}` +
          `\n   URL       : ${requestUrl}` +
          `\n   Status    : ${result.error.status}` +
          `\n   Error     :\n${JSON.stringify(result.error.data, null, 4)}` +
          "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
    } else {
      console.log(
        "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" +
          "\n✅ [RESPONSE SUCCESS]" +
          `\n   Endpoint  : ${api.endpoint}` +
          `\n   URL       : ${requestUrl}` +
          `\n   Data      :\n${JSON.stringify(result.data, null, 4)}` +
          "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
    }

    return result;
  },
  tagTypes: ["User", "Agency", "TourPlan", "Profile"],
  endpoints: (builder) => ({
    // Register API
    register: builder.mutation({
      query: (data) => ({
        url: "v1/auth/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    registerVerifyOtp: builder.mutation({
      query: (data) => ({
        url: "v1/auth/verify-email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Verify OTP API
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "v1/auth/password/verify-otp/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Resend OTP API
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "v1/auth/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),

    // Login API
    login: builder.mutation({
      query: (data) => ({
        url: "v1/auth/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Forgot Password API
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "v1/auth/password/forgot/",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password API
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "v1/auth/password/reset/",
        method: "POST",
        body: data,
      }),
    }),

    // Send OTP API
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "v1/auth/send-otp/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Get User Profile API: GET v1/auth/profile/
    getProfile: builder.query<
      { success: boolean; data: UserProfileData },
      void
    >({
      query: () => ({
        url: "v1/auth/profile/",
        method: "GET",
      }),
      providesTags: ["Profile", "User"],
    }),

    // Update Profile API: PATCH v1/auth/profile/update/ (via FormData)
    updateProfile: builder.mutation<
      { success: boolean; data: UserProfileData; details?: string },
      FormData
    >({
      query: (formData) => ({
        url: "v1/auth/profile/update/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile", "User"],
    }),

    // Change Password API: POST v1/auth/password/change/
    changePassword: builder.mutation<
      { success: boolean; details?: string; message?: string },
      { password?: string; new_password?: string; confirm_password?: string }
    >({
      query: (data) => ({
        url: "v1/auth/password/change/",
        method: "POST",
        body: data,
      }),
    }),

    // Get Notifications API: GET v1/notifications/
    getNotifications: builder.query<
      { success: boolean; data: NotificationsData },
      void
    >({
      query: () => ({
        url: "v1/notifications/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useRegisterVerifyOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
} = authentication;
