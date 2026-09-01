import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

export default function PersonalSettingScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <Text className="font-poppins-bold text-lg text-gray-900 tracking-tight">
          Personal setting
        </Text>

        <View className="w-10" />
      </View>

      {/* Settings Items */}
      <View className="px-6 pt-2">
        {/* Item 1: Notifications */}
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100/80">
          <View className="flex-row items-center gap-3.5">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50/80">
              <StyledIcons
                className="text-gray-700"
                name="notifications-outline"
                size={20}
              />
            </View>
            <Text className="font-poppins-semibold text-base text-gray-900">
              Notifications
            </Text>
          </View>

          <Switch
            ios_backgroundColor="#e5e7eb"
            onValueChange={setNotificationsEnabled}
            thumbColor="#ffffff"
            trackColor={{ false: "#d1d5db", true: "#000000" }}
            value={notificationsEnabled}
          />
        </View>

        {/* Item 2: Shop */}
        <Pressable
          className="flex-row items-center justify-between py-4 border-b border-gray-100/80 active:bg-gray-50/50"
          onPress={() => {
            router.push("/(role)/admin/profile/shop");
          }}
        >
          <View className="flex-row items-center gap-3.5">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50/80">
              <StyledIcons
                className="text-gray-700"
                name="storefront-outline"
                size={20}
              />
            </View>
            <Text className="font-poppins-semibold text-base text-gray-900">
              Shop
            </Text>
          </View>

          <StyledIcons
            className="text-gray-400"
            name="chevron-forward"
            size={18}
          />
        </Pressable>
        <Pressable
          className="flex-row items-center justify-between py-4 border-b border-gray-100/80 active:bg-gray-50/50"
          onPress={() => {
            router.push("/(role)/admin/profile/personal-settings");
          }}
        >
          <View className="flex-row items-center gap-3.5">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50/80">
              <StyledIcons className="text-gray-700" name="person" size={20} />
            </View>
            <Text className="font-poppins-semibold text-base text-gray-900">
              Personal Settings
            </Text>
          </View>

          <StyledIcons
            className="text-gray-400"
            name="chevron-forward"
            size={18}
          />
        </Pressable>
      </View>
    </Container>
  );
}
