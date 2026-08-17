import React from "react";
import { ScrollView, View } from "react-native";

import { StaffHeader } from "./staff-header";
import { StaffNextAppointments } from "./staff-next-appointments";
import { StaffTodayMetrics } from "./staff-today-metrics";

export function StaffDashboardComponent() {
  return (
    <View className="flex-1 bg-white">
      <StaffHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StaffTodayMetrics />
        <StaffNextAppointments />
      </ScrollView>
    </View>
  );
}

export default StaffDashboardComponent;
