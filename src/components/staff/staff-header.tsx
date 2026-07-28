import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function StaffHeader({
  staffName = "Maïa",
  greeting = "Good after noon",
  avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  onPressNotification,
}: {
  avatarUrl?: string;
  greeting?: string;
  onPressNotification?: () => void;
  staffName?: string;
}) {
  return (
    <View className="flex-row items-center justify-between pt-12 pb-6 px-6 bg-white">
      {/* Staff Profile & Greeting */}
      <View className="flex-row items-center gap-3">
        <Image
          contentFit="cover"
          source={{ uri: avatarUrl }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="font-bold text-xl text-gray-900 tracking-tight">
            Welcome, {staffName}
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">{greeting}</Text>
        </View>
      </View>

      {/* Notification Bell Button */}
      <Pressable
        className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-75"
        onPress={onPressNotification}
      >
        <StyledIcons className="text-gray-800" name="notifications" size={20} />
      </Pressable>
    </View>
  );
}
