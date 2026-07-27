import type { Href } from "expo-router";
import { Stack, useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function Splash() {
  const router = useRouter();

  return (
    <Pressable
      className="flex-1"
      onPress={() => router.push("/(auth)/login" as Href)}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent />

      <ImageBackground
        className="flex-1 items-center justify-center px-6"
        resizeMode="cover"
        source={require("@/assets/splash-bg.jpg")}
      >
        {/* Dark overlay for readability */}
        <View className="absolute inset-0 bg-black/40" />

        {/* Center Content: Gold Logo & Title */}
        <View className="items-center justify-center z-10">
          <Image
            className="w-64 h-52 mb-4"
            resizeMode="contain"
            source={require("@/assets/logo-gold.png")}
          />

          <Text className="text-center font-extrabold text-3xl tracking-tight leading-tight">
            <Text className="text-[#F0B100]">Your beauty{"\n"}</Text>
            <Text className="text-white">appointment</Text>
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
