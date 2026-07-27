import { Stack } from "expo-router";
import React from "react";

export default function CalenderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="custom-calendar" />
    </Stack>
  );
}
