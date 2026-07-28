import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/components/staff/profile/staff-profile-top-header";
import React from "react";
import { Text, View } from "react-native";

export default function StaffReviewsScreen() {
  return (
    <Container className="bg-white flex-1">
      <StaffProfileTopHeader title="Reviews" />

      <View className="flex-1 items-center justify-center p-6">
        <Text className="font-poppins-medium text-base text-gray-500 text-center">
          Reviews Page
        </Text>
      </View>
    </Container>
  );
}
