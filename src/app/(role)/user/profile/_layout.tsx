import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="location-services" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="contact-us" />
      <Stack.Screen name="help-center" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="refund" />
      <Stack.Screen name="terms" />
    </Stack>
  );
}
