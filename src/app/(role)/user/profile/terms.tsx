import { StyledIcons } from "@/lib";
import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function TermsScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(role)/user/profile");
    }
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={handleBack}>
              <StyledIcons
                className="text-foreground"
                name="arrow-back"
                size={24}
              />
            </Pressable>
            <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
              Terms & Conditions
            </Text>
            <View className="w-6" />
          </View>

          {/* Terms content */}
          <View className="rounded-2xl bg-[#F8F9FA] p-5">
            <Text className="mb-2 font-bold text-base text-foreground">
              Service Terms
            </Text>
            <Text className="text-default-500 text-sm leading-6">
              By registering and booking appointments on Barbers Bay, you agree
              to comply with our user standards and late cancellation
              structures.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={handleBack}
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
