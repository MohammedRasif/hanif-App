import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { InputOTP, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { getErrorMessage, StyledIcons } from "@/lib";
import { setAccessToken, setRefreshToken, setUserData } from "@/lib/storage";
import {
  useRegisterVerifyOtpMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/Redux/feature/auth";

export default function OtpCodeScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { email, type } = useLocalSearchParams<{
    email?: string;
    type?: string;
  }>();

  const [timer, setTimer] = useState(45);
  const [registerVerifyOtpApi, { isLoading: isRegisterVerifying }] =
    useRegisterVerifyOtpMutation();
  const [verifyOtpApi, { isLoading: isForgetVerifying }] =
    useVerifyOtpMutation();
  const [resendOtpApi, { isLoading: isResending }] = useResendOtpMutation();

  const isVerifying = isRegisterVerifying || isForgetVerifying;

  useEffect(() => {
    if (timer <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const onComplete = async (code: string) => {
    const targetEmail = email || "";
    const payload = {
      email: targetEmail,
      otp: code,
    };

    try {
      console.log("[Submitting Verify OTP Form]:", payload, "Type:", type);

      if (type === "register") {
        const res = await registerVerifyOtpApi(payload).unwrap();
        console.log("[Register Verify OTP API Success Response]:", res);

        if (res?.data?.access) setAccessToken(res.data.access);
        if (res?.data?.refresh) setRefreshToken(res.data.refresh);
        if (res?.data?.user) setUserData(res.data.user);

        toast.show({
          label: "Email Verified!",
          description: res?.details || "Email verified successfully.",
          variant: "success",
          placement: "top",
        });

        const rawRole = String(res?.data?.user?.role || "USER").toUpperCase();
        if (
          rawRole === "ADMIN" ||
          rawRole === "SUPER_ADMIN" ||
          rawRole === "SUPERADMIN" ||
          rawRole === "OWNER" ||
          rawRole === "SHOP_ADMIN"
        ) {
          router.replace("/(role)/admin" as Href);
        } else if (
          rawRole === "BARBER" ||
          rawRole === "STAFF" ||
          rawRole === "BARBER_STAFF"
        ) {
          router.replace("/(role)/staff" as Href);
        } else {
          router.replace("/(role)/user" as Href);
        }
      } else {
        const res = await verifyOtpApi(payload).unwrap();
        console.log("[Verify OTP API Success Response]:", res);

        if (res?.data?.access) setAccessToken(res.data.access);
        if (res?.data?.refresh) setRefreshToken(res.data.refresh);
        if (res?.data?.user) setUserData(res.data.user);

        toast.show({
          label: "Code Verified!",
          description: "Please enter your new password.",
          variant: "success",
          placement: "top",
        });

        router.push({
          pathname: "/auth/change-password",
          params: { email: targetEmail, otp: code },
        } as Href);
      }
    } catch (error: any) {
      console.error("[Verify OTP API Error Response]:", error);
      const errorMessage = getErrorMessage(
        error,
        "Invalid verification code. Please try again.",
      );

      toast.show({
        label: "Verification Failed",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;

    const payload = {
      email,
      type: type === "register" ? "register" : "forgot-password",
    };

    try {
      console.log("[Submitting Resend OTP Form]:", payload);
      const res = await resendOtpApi(payload).unwrap();
      console.log("[Resend OTP API Success Response]:", res);

      toast.show({
        label: "OTP Resent",
        description:
          res?.details ||
          "A new verification code has been sent to your email.",
        variant: "success",
        placement: "top",
      });

      setTimer(45);
    } catch (error: any) {
      console.error("[Resend OTP API Error Response]:", error);
      const errorMessage = getErrorMessage(error, "Failed to resend code.");

      toast.show({
        label: "Resend Failed",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
    }
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-[#FFFFFF] px-6 pt-14 pb-8">
        {/* Back button */}
        <Pressable className="mb-6 self-start" onPress={() => router.back()}>
          <StyledIcons
            className="text-foreground"
            name="arrow-back"
            size={24}
          />
        </Pressable>

        {/* Title and description */}
        <View className="mb-8">
          <Text className="font-bold text-3xl text-foreground">
            OTP code Verification
          </Text>
          <Text className="mt-2 text-base text-muted">
            Code has been sent to {email || "your email"}
          </Text>
        </View>

        {/* OTP Input Slots (6 Digits) */}
        <View className="mb-8 items-center justify-center">
          <InputOTP
            className="flex-row gap-2.5 justify-center"
            isDisabled={isVerifying}
            maxLength={6}
            onComplete={onComplete}
          >
            <InputOTP.Group className="flex-row gap-2.5 justify-center">
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={0}
              />
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={1}
              />
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={2}
              />
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={3}
              />
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={4}
              />
              <InputOTP.Slot
                className="h-14 w-12 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0] text-center font-bold text-lg text-foreground"
                index={5}
              />
            </InputOTP.Group>
          </InputOTP>
        </View>

        {/* Resend timer & action */}
        <View className="items-start">
          {timer > 0 ? (
            <Text className="text-base text-muted">
              Resend code in{" "}
              <Text className="font-bold text-[#F0B100]">{timer}s</Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text className="font-bold text-[#F0B100] text-base underline">
                {isResending ? "Sending..." : "Resend Code"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Container>
  );
}
