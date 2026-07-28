import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";

export default function LocationServicesScreen() {
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
              Location Services
            </Text>
            <View className="w-6" />
          </View>

          {/* Current Location Card */}
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Current Location
          </Text>
          <View className="mb-4 flex-row items-center gap-4 rounded-2xl bg-[#F8F9FA] p-4">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <StyledIcons
                className="text-[#F0B100]"
                name="location"
                size={20}
              />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-foreground text-sm">
                Downtown Plaza
              </Text>
              <Text className="mt-0.5 text-default-400 text-xs">
                123 Main Street, New York, NY 10001
              </Text>
            </View>
          </View>

          {/* Use current location trigger */}
          <Pressable className="flex-row items-center justify-center gap-2 rounded-2xl border border-[#F0B100] py-3">
            <StyledIcons
              className="text-[#F0B100]"
              name="locate-outline"
              size={18}
            />
            <Text className="font-bold text-[#F0B100] text-sm">
              Use Current Location
            </Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            onPress={() => router.back()}
            variant="primary"
          >
            <Button.Label className="font-semibold text-base text-primary-foreground">
              Save Changes
            </Button.Label>
          </Button>

          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-default-100"
            onPress={() => router.back()}
            variant="secondary"
          >
            <Button.Label className="font-semibold text-base text-foreground">
              Cancel
            </Button.Label>
          </Button>
        </View>
      </View>
    </Container>
  );
}
