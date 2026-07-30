import { StyledIcons } from "@/lib";
import { Stack, useRouter, type Href } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function BookScreen() {
  const router = useRouter();

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={() => router.back()}>
              <StyledIcons
                className="text-foreground"
                name="arrow-back"
                size={24}
              />
            </Pressable>
            <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
              Select Date & Time
            </Text>
            <View className="w-6" />
          </View>

          {/* Service detail card */}
          <View className="mb-6 rounded-2xl bg-[#F8F9FA] p-4">
            <Text className="font-semibold text-foreground text-sm">
              Hair Cut & Style + Classic Facial
            </Text>
            <Text className="mt-1 font-bold text-[#F0B100] text-lg">$120</Text>
          </View>

          {/* Calendar Picker placeholder */}
          <Text className="mb-3 font-semibold text-foreground text-sm">
            Choose date
          </Text>
          <View className="mb-6 h-48 items-center justify-center rounded-3xl border border-default-300 border-dashed p-6">
            <Text className="font-medium text-default-400">
              Calendar Widget Picker
            </Text>
            <Text className="mt-2 text-default-400 text-xs">January 2024</Text>
          </View>

          {/* Time Picker placeholder */}
          <Text className="mb-3 font-semibold text-foreground text-sm">
            Available Times
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {[
              "9:00 AM",
              "10:30 AM",
              "12:00 PM",
              "2:00 PM",
              "3:30 PM",
              "5:00 PM",
            ].map((t) => (
              <Pressable
                className="rounded-xl border border-transparent bg-[#F8F9FA] px-4 py-3 active:border-[#F0B100] active:bg-[#FFF9E6]"
                key={t}
              >
                <Text className="font-semibold text-foreground text-sm active:text-[#F0B100]">
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={() => router.push("/(role)/user/salon/choose-shop" as Href)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Continue To Confirm
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
