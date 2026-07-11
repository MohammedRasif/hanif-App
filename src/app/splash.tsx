import type { Href } from "expo-router";
import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { ImageBackground, StatusBar, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent />

      <ImageBackground
        className="flex-1 justify-end px-6 pb-10"
        resizeMode="cover"
        source={require("@/assets/splash-bg.jpg")}
      >
        {/* Dark overlay for readability */}
        <View className="absolute inset-0 bg-black/40" />

        {/* Info Card */}
        <View className="w-full rounded-[32px] border border-white/10 bg-black/60 px-6 py-8 backdrop-blur-md">
          {/* Main Title */}
          <Text className="mb-4 text-center font-extrabold text-3xl leading-tight">
            <Text className="text-[#F0B100]">Your beauty{"\n"}</Text>
            <Text className="text-white">appointment </Text>
            <Text className="text-[#F0B100]">in one{"\n"}click !</Text>
          </Text>

          {/* Description */}
          <Text className="mb-8 text-center text-sm text-white/80 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Quam odio aliquam aenean
            commodo.
          </Text>

          {/* Get Started Button */}
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            onPress={() => router.push("/(auth)/login" as Href)}
            variant="primary"
          >
            <Button.Label className="font-semibold text-base text-primary-foreground">
              Let’s Get Started
            </Button.Label>
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}
