import React from "react";
import { Container } from "@/components/container";
import { Text, View } from "react-native";
import { ProfileUpdateForm } from "@/feature/admin/profile/shop-settings/UserProfileSettings";

const PersonalSettings = () => {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <ProfileUpdateForm />
      </View>
    </Container>
  );
};

export default PersonalSettings;
