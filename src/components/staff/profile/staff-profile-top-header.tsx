import { StyledIcons } from "@/lib";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface StaffProfileTopHeaderProps {
  onBackPress?: () => void;
  title: string;
}

export const StaffProfileTopHeader = ({
  title,
  onBackPress,
}: StaffProfileTopHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
      <Pressable
        className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        onPress={handleBack}
      >
        <StyledIcons className="text-gray-800" name="chevron-back" size={22} />
      </Pressable>

      <Text className="font-poppins-bold text-xl text-gray-900 tracking-tight">
        {title}
      </Text>

      <View className="w-10" />
    </View>
  );
};
