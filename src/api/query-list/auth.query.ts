import { kyClient } from "@/lib/ky";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role?: string;
  full_name?: string;
  image?: string;
  phone?: string;
  address?: string;
  last_active_at?: string;
  date_joined?: string;
}

export interface UserLocation {
  id?: number;
  location_name: string;
  location_link: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  confirm_password?: string;
  full_name?: string;
  phone?: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResendOtpData {
  email: string;
  type?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface ChangePasswordData {
  password?: string;
  new_password?: string;
  confirm_password?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  new_password?: string;
  confirm_password?: string;
}

export interface VerifyPasswordOtpData {
  email: string;
  otp: string;
}

export interface UpdateProfileData {
  full_name?: string;
  image?: string;
  phone?: string;
  address?: string;
}

export interface TokenRefreshData {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export interface LocationFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface LocationListResponse {
  count: number;
  results: UserLocation[];
  next?: string | null;
  previous?: string | null;
}

export const authApi = {
  register: (data: RegisterData) =>
    kyClient.post("v1/auth/register/", { json: data }).json<UserProfile>(),

  verifyEmail: (data: VerifyEmailData) =>
    kyClient
      .post("v1/auth/verify-email/", { json: data })
      .json<{ message: string }>(),

  resendOtp: (data: ResendOtpData) =>
    kyClient
      .post("v1/auth/resend-otp/", { json: data })
      .json<{ message: string }>(),

  login: (data: LoginData) =>
    kyClient
      .post("v1/auth/login/", { json: data })
      .json<{ access: string; refresh: string; user: UserProfile }>(),

  changePassword: (data: ChangePasswordData) =>
    kyClient
      .post("v1/auth/password/change/", { json: data })
      .json<{ message: string }>(),

  forgotPassword: (data: ForgotPasswordData) =>
    kyClient
      .post("v1/auth/password/forgot/", { json: data })
      .json<{ message: string }>(),

  resetPassword: (data: ResetPasswordData) =>
    kyClient
      .post("v1/auth/password/reset/", { json: data })
      .json<{ message: string }>(),

  verifyPasswordOtp: (data: VerifyPasswordOtpData) =>
    kyClient
      .post("v1/auth/password/verify-otp/", { json: data })
      .json<{ message: string }>(),

  getProfile: () => kyClient.get("v1/auth/profile/").json<UserProfile>(),

  getLocations: (filters?: LocationFilters) =>
    kyClient
      .get("v1/auth/profile/location/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<LocationListResponse>(),

  createLocation: (data: UserLocation) =>
    kyClient
      .post("v1/auth/profile/location/", { json: data })
      .json<UserLocation>(),

  updateLocation: (data: UserLocation) =>
    kyClient
      .put("v1/auth/profile/location/", { json: data })
      .json<UserLocation>(),

  updateProfile: (data: UpdateProfileData) =>
    kyClient
      .patch("v1/auth/profile/update/", { json: data })
      .json<UserProfile>(),

  refreshToken: (data: TokenRefreshData) =>
    kyClient
      .post("v1/auth/token/refresh/", { json: data })
      .json<TokenRefreshResponse>(),
};
