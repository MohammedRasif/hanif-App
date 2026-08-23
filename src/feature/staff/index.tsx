import { useGetProfileQuery } from "@/Redux/feature/auth";
import { useGetDashboardOverviewQuery } from "@/Redux/feature/dashboard";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { StaffHeader } from "./staff-header";
import {
  StaffNextAppointments,
  type UpcomingAppointment,
} from "./staff-next-appointments";
import { StaffTodayMetrics, type StaffMetric } from "./staff-today-metrics";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

export function StaffDashboardComponent() {
  const router = useRouter();

  // Fetch user profile (GET /v1/auth/profile/)
  const { data: userProfileResponse } = useGetProfileQuery();
  const userProfile = userProfileResponse?.data;

  const staffName = userProfile?.full_name || userProfile?.username || "Staff";
  const avatarUrl = userProfile?.image || DEFAULT_AVATAR;

  // Fetch dashboard overview
  const { data: dashboardResponse, isLoading } = useGetDashboardOverviewQuery();

  const overviewData = dashboardResponse?.data;
  const metrics = overviewData?.metrics;
  const upcomingBookings = overviewData?.upcoming_bookings || [];

  const formattedMetrics: StaffMetric[] = [
    {
      id: "1",
      label: "Booking",
      value: metrics ? String(metrics.todays_bookings) : "0",
    },
    {
      id: "2",
      label: "Completed",
      value: metrics ? String(metrics.completed) : "0",
    },
    {
      id: "3",
      label: "Revenue",
      value: metrics ? `$${metrics.revenue_today}` : "$0",
    },
  ];

  const formattedAppointments: UpcomingAppointment[] = upcomingBookings.map(
    (item) => ({
      id: String(item.id),
      clientName: item.customer_name || "Client",
      serviceName: item.service_name || "Salon Service",
      time: item.start_time || "10:00",
      duration: "30 min",
    }),
  );

  return (
    <View className="flex-1 bg-white">
      <StaffHeader
        avatarUrl={avatarUrl}
        onPressNotification={() => router.push("/notification")}
        staffName={staffName}
      />
      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <StaffTodayMetrics metrics={formattedMetrics} />
          <StaffNextAppointments
            appointments={
              formattedAppointments.length > 0
                ? formattedAppointments
                : undefined
            }
          />
        </ScrollView>
      )}
    </View>
  );
}

export default StaffDashboardComponent;
