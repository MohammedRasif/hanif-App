import { Stack } from "expo-router";
import React from "react";

export default function AdminProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="personal-setting" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="schedule-management" />
      <Stack.Screen name="service-setup" />
      <Stack.Screen name="shop" />
      <Stack.Screen name="shop-settings" />
      <Stack.Screen name="staff-management" />
    </Stack>
  );
}
