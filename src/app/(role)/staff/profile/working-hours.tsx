import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function StaffWorkingHoursScreen() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1">
      <View className="flex-row items-center gap-3 px-6 pt-12 pb-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <StyledIcons
            className="text-gray-800"
            name="chevron-back"
            size={22}
          />
        </Pressable>
        <Text className="font-poppins-bold text-xl text-gray-900">
          Working Days & Hours
        </Text>
      </View>

      <View className="flex-1 items-center justify-center p-6">
        <Text className="font-poppins-medium text-base text-gray-500 text-center">
          Working Days & Hours Page
        </Text>
      </View>
    </Container>
  );
}
