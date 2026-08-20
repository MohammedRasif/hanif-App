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
    // Register API: {{baseUrl}}/v1/auth/register/
    register: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Register]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/register/",
          method: "POST",
          body: data, // { email, password, confirm_password, full_name, phone }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Register]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
      invalidatesTags: ["User"],
    }),

    registerVerifyOtp: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Register Verify OTP]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/verify-email/",
          method: "POST",
          body: data, // { email, otp }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Register Verify OTP]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
      invalidatesTags: ["User"],
    }),

    // Verify OTP API: {{baseUrl}}/v1/auth/password/verify-otp/
    verifyOtp: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Verify OTP]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/password/verify-otp/",
          method: "POST",
          body: data, // { email, otp }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Verify OTP]:",
          JSON.stringify(response, null, 2),
        );
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

    // Resend OTP API: {{baseUrl}}/v1/auth/resend-otp/
    resendOtp: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Resend OTP]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/resend-otp/",
          method: "POST",
          body: data, // { email, type: "register" }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Resend OTP]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
    }),

    // Login API: {{baseUrl}}/v1/auth/login/
    login: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Login]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/login/",
          method: "POST",
          body: data, // { email, password }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Login]:",
          JSON.stringify(response, null, 2),
        );
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

    // Forgot Password API: {{baseUrl}}/v1/auth/password/forgot/
    forgotPassword: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Forgot Password]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/password/forgot/",
          method: "POST",
          body: data, // { email }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Forgot Password]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
    }),

    // Reset Password API: {{baseUrl}}/v1/auth/password/reset/
    resetPassword: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Reset Password]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/password/reset/",
          method: "POST",
          body: data, // { email, otp, new_password, confirm_password }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Reset Password]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
    }),

    // Send OTP (General OTP flow)
    sendOtp: builder.mutation({
      query: (data) => {
        console.log(
          "[Auth API Request - Send OTP]:",
          JSON.stringify(data, null, 2),
        );
        return {
          url: "v1/auth/send-otp/",
          method: "POST",
          body: data, // { phone, email }
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "[Auth API Response - Send OTP]:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
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
