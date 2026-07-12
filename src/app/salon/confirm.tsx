import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function ConfirmScreen() {
  const router = useRouter();

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={() => router.back()}>
              <StyledIonicons
                className="text-foreground"
                name="arrow-back"
                size={24}
              />
            </Pressable>
            <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
              Confirm Appointment
            </Text>
            <View className="w-6" />
          </View>

          {/* Appointment detail summary cards */}
          <Text className="mb-3 font-semibold text-foreground text-sm">
            Appointment Details
          </Text>
          <View className="mb-4 gap-2 rounded-2xl bg-[#F8F9FA] p-4">
            <View className="flex-row justify-between">
              <Text className="text-default-400 text-sm">Date & Time</Text>
              <Text className="font-semibold text-foreground text-sm">
                January 18, 2024 (2:00 PM)
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-default-400 text-sm">Shop Location</Text>
              <Text className="font-semibold text-foreground text-sm">
                Glam Beauty Salon
              </Text>
            </View>
          </View>

          {/* Pricing summary */}
          <Text className="mb-3 font-semibold text-foreground text-sm">
            Selected Services
          </Text>
          <View className="mb-6 gap-3 rounded-2xl bg-[#F8F9FA] p-4">
            <View className="flex-row justify-between">
              <Text className="text-foreground text-sm">Hair Cut & Style</Text>
              <Text className="font-bold text-foreground text-sm">$50.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-foreground text-sm">Classic Facial</Text>
              <Text className="font-bold text-foreground text-sm">$70.00</Text>
            </View>
            <View className="my-1 h-px bg-default-100" />
            <View className="flex-row justify-between">
              <Text className="font-bold text-base text-foreground">
                Total Amount
              </Text>
              <Text className="font-extrabold text-[#F0B100] text-lg">
                $120.00
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={() => router.replace("/main" as Href)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Make Payment
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
