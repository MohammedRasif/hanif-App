import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export const StaffReviewCard = () => {
  return (
    <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
      {/* Top Row: 5 Stars + User Info */}
      <View className="flex-row items-center justify-between">
        {/* 5 Yellow Stars */}
        <View className="flex-row items-center gap-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <StyledIcons
              key={item}
              className="text-amber-400"
              name="star"
              size={18}
            />
          ))}
        </View>

        {/* User Info & Avatar */}
        <View className="flex-row items-center gap-2">
          <View className="items-end">
            <Text className="font-poppins-semibold text-xs text-gray-900">
              john
            </Text>
            <Text className="mt-0.5 font-poppins text-[10px] text-gray-400">
              29 may 2026
            </Text>
          </View>
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            }}
            style={{ borderRadius: 16, height: 32, width: 32 }}
          />
        </View>
      </View>

      {/* Review Content */}
      <Text className="mt-3 mb-2 font-poppins text-xs leading-relaxed text-gray-600">
        we are the best on uk base shop we are the best on uk base shop we are
        the best on uk base shop
      </Text>

      {/* Reply Footer */}
      <Text className="font-poppins text-[10px] text-gray-400">
        You replied
      </Text>
    </View>
  );
};
