import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="service" />
      <Stack.Screen name="working-hours" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="break-schedule" />
      <Stack.Screen name="reviews" />
    </Stack>
  );
};

export default ProfileLayout;
