import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { InputOTP, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useResendOtp, useVerifyEmail, useVerifyPasswordOtp } from "@/api";
import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { getApiErrorMessage } from "@/lib/ky";

export default function OtpCodeScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { email, type } = useLocalSearchParams<{
    email?: string;
    type?: string;
  }>();

  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyEmailMutation = useVerifyEmail();
  const verifyPasswordOtpMutation = useVerifyPasswordOtp();
  const resendOtpMutation = useResendOtp();

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
    setIsVerifying(true);
    const targetEmail = email || "";

    try {
      if (type === "register") {
        await verifyEmailMutation.mutateAsync({
          email: targetEmail,
          otp: code,
        });

        toast.show({
          label: "Email Verified!",
          description: "Your account is verified. Please log in.",
          variant: "success",
          placement: "top",
        });

        router.replace("/auth/login" as Href);
      } else {
        await verifyPasswordOtpMutation.mutateAsync({
          email: targetEmail,
          otp: code,
        });

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
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Invalid verification code. Please try again.",
      );
      toast.show({
        label: "Verification Failed",
        description: message,
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;

    try {
      await resendOtpMutation.mutateAsync({
        email,
        type: type === "register" ? "register" : "password_reset",
      });

      toast.show({
        label: "OTP Resent",
        description: "A new verification code has been sent to your email.",
        variant: "success",
        placement: "top",
      });

      setTimer(45);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to resend code.");
      toast.show({
        label: "Resend Failed",
        description: message,
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
                {resendOtpMutation.isPending ? "Sending..." : "Resend Code"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Container>
  );
}
