import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ChangePasswordData,
  type ForgotPasswordData,
  type LocationFilters,
  type LoginData,
  type RegisterData,
  type ResendOtpData,
  type ResetPasswordData,
  type TokenRefreshData,
  type UpdateProfileData,
  type UserLocation,
  type VerifyEmailData,
  type VerifyPasswordOtpData,
  authApi,
} from "@/api/query-list/auth.query";

export const AUTH_KEYS = {
  all: () => ["auth"] as const,
  profile: () => ["auth", "profile"] as const,
  locations: (filters?: LocationFilters) =>
    ["auth", "locations", filters] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: AUTH_KEYS.profile(),
    queryFn: () => authApi.getProfile(),
  });
};

export const useLocations = (filters?: LocationFilters) => {
  return useQuery({
    queryKey: AUTH_KEYS.locations(filters),
    queryFn: () => authApi.getLocations(filters),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailData) => authApi.verifyEmail(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpData) => authApi.resendOtp(data),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => authApi.changePassword(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
  });
};

export const useVerifyPasswordOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyPasswordOtpData) =>
      authApi.verifyPasswordOtp(data),
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserLocation) => authApi.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.locations() });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserLocation) => authApi.updateLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.locations() });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile() });
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: TokenRefreshData) => authApi.refreshToken(data),
  });
};
