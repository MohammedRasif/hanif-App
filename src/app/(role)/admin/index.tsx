import {
  AdminHeader,
  AdminNextAppointments,
  AdminTodayMetrics,
} from "@/components/admin";
import { Container } from "@/components/container";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export function AdminDashboardIndex() {
  const router = useRouter();

  return (
    <Container className="bg-white" isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white pb-10">
        <AdminHeader onPressNotification={() => router.push("/notification")} />
        <AdminTodayMetrics />
        <AdminNextAppointments />
      </View>
    </Container>
  );
}

export default AdminDashboardIndex;
