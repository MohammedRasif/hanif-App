import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, Text, View } from "react-native";

export default function ContactUsScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(role)/user/profile");
    }
  };

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/+1234567890");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@example.com");
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-14 pb-8">
        {/* Top Header Row with Circle Back Button */}
        <View className="relative mb-8 flex-row items-center justify-between">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-gray-100/90 active:bg-gray-200"
            onPress={handleBack}
          >
            <StyledIcons
              className="text-gray-900"
              name="arrow-back"
              size={20}
            />
          </Pressable>

          <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-xl text-gray-900">
            Contact Us
          </Text>
          <View className="w-11" />
        </View>

        {/* Contact Options List matching screenshot design */}
        <View className="gap-3.5 pt-2">
          {/* Call Option */}
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 active:bg-gray-50 shadow-2xs"
            onPress={handleCall}
          >
            <StyledIcons
              className="text-gray-700"
              name="call-outline"
              size={22}
            />
            <Text className="font-poppins-medium text-base text-gray-900">
              Call
            </Text>
          </Pressable>

          {/* WhatsApp Option */}
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 active:bg-gray-50 shadow-2xs"
            onPress={handleWhatsApp}
          >
            <StyledIcons
              className="text-gray-700"
              name="logo-whatsapp"
              size={22}
            />
            <Text className="font-poppins-medium text-base text-gray-900">
              What's app
            </Text>
          </Pressable>

          {/* Email Option */}
          <Pressable
            className="flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 active:bg-gray-50 shadow-2xs"
            onPress={handleEmail}
          >
            <StyledIcons
              className="text-gray-700"
              name="mail-outline"
              size={22}
            />
            <Text className="font-poppins-medium text-base text-gray-900">
              Email
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}
