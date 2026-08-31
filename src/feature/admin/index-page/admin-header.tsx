import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function AdminHeader({
  adminName = "Maïa",
  subtitle = "Let's find your next treatment",
  avatarUrl = "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png",
  onPressNotification,
}: {
  adminName?: string;
  avatarUrl?: string;
  onPressNotification?: () => void;
  subtitle?: string;
}) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
      {/* Profile Info & Welcome Message */}
      <View className="flex-row items-center gap-3">
        <Image
          contentFit="cover"
          source={{ uri: avatarUrl }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="font-poppins-bold text-xl text-foreground">
            Welcome, {adminName}
          </Text>
          <Text className="font-poppins text-default-400 text-xs mt-0.5">
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Notification Bell Button */}
      <Pressable
        className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f3f5] active:opacity-75"
        onPress={onPressNotification}
      >
        <StyledIcons color="#1f2937" name="notifications" size={20} />
      </Pressable>
    </View>
  );
}
