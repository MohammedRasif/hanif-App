import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, setRefreshToken, setUserData } from "@/lib/storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.10.29.119:8100/api";

export const authentication = createApi({
  reducerPath: "authentication",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL.replace(/\/$/, "")}/`,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["User", "Agency", "TourPlan"],
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
} = authentication;
