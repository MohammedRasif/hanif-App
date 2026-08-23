import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  setUserData,
} from "@/lib/storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.10.29.119:8100/api";

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
      transformResponse: (response: any) => {
        if (response?.data?.access) {
          setAccessToken(response.data.access);
        }
        if (response?.data?.refresh) {
          setRefreshToken(response.data.refresh);
        }
        return response;
      },
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
      transformResponse: (response: any) => {
        if (response?.data?.access) {
          setAccessToken(response.data.access);
        }
        if (response?.data?.refresh) {
          setRefreshToken(response.data.refresh);
        }
        if (response?.data?.user) {
          setUserData(response.data.user);
        }
        return response;
      },
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
