import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { InputOTP } from "heroui-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function OtpCodeScreen() {
  const router = useRouter();
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const onComplete = (code: string) => {
    console.log("OTP code completed:", code);
    // Auto-navigate to change password screen
    router.push("/(auth)/change-password");
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-[#FFFFFF] px-6 pt-14 pb-8">
        {/* Back button */}
        <Pressable className="mb-6 self-start" onPress={() => router.back()}>
          <StyledIonicons
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
            Code has ben send to xxx@gmai.com
          </Text>
        </View>

        {/* OTP Input Slots */}
        <View className="mb-6 items-center">
          <InputOTP
            className="flex-row gap-4"
            maxLength={4}
            onComplete={onComplete}
          >
            <InputOTP.Group className="flex-row gap-4">
              <InputOTP.Slot
                className="h-16 w-16 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0]"
                index={0}
              />
              <InputOTP.Slot
                className="h-16 w-16 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0]"
                index={1}
              />
              <InputOTP.Slot
                className="h-16 w-16 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0]"
                index={2}
              />
              <InputOTP.Slot
                className="h-16 w-16 items-center justify-center rounded-2xl border-0 bg-[#F0F0F0]"
                index={3}
              />
            </InputOTP.Group>
          </InputOTP>
        </View>

        {/* Resend timer */}
        <View className="items-start">
          <Text className="text-base text-muted">
            Resend code in{" "}
            <Text className="font-bold text-[#F0B100]">{timer}s</Text>
          </Text>
        </View>
      </View>
    </Container>
  );
}
