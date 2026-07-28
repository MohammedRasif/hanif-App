import { StyledIcons } from "@/lib";
import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function RefundScreen() {
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
              Refund Policies
            </Text>
            <View className="w-6" />
          </View>

          {/* Policy Text details */}
          <View className="rounded-2xl bg-[#F8F9FA] p-5">
            <Text className="mb-2 font-bold text-base text-foreground">
              Request Refund
            </Text>
            <Text className="text-default-500 text-sm leading-6">
              You are eligible for a full refund if cancellations are made at
              least 24 hours prior to the scheduled appointment start time.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={() => router.back()}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Go Back
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
