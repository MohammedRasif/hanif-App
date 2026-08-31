import { Container } from "@/components/container";
import {
  AdminHeader,
  AdminNextAppointments,
  AdminTodayMetrics,
} from "@/feature/admin/index-page";
import { getUserData } from "@/lib/storage";
import { useGetProfileQuery } from "@/Redux/feature/auth";
import { useGetDashboardOverviewQuery } from "@/Redux/feature/dashboard";
import { Stack, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

export function AdminDashboardIndex() {
  const router = useRouter();
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 9;

  // 📡 GET /v1/auth/profile/
  const { data: profileResponse } = useGetProfileQuery();

  // 📡 GET /v1/dashboard/?shop={shopId}
  const { data: dashboardResponse, isLoading: isLoadingDashboard } =
    useGetDashboardOverviewQuery({ shop: shopId });

  const adminName = profileResponse?.data?.full_name || "Admin";
  const avatarUrl = profileResponse?.data?.image || undefined;

  const metricsData = useMemo(() => {
    const m = dashboardResponse?.data?.metrics;
    return [
      {
        id: "1",
        label: "Today's Bookings",
        value: String(m?.todays_bookings ?? 0),
        iconName: "calendar-outline" as const,
        iconColor: "#60a5fa",
      },
      {
        id: "2",
        label: "Completed",
        value: String(m?.completed ?? 0),
        iconName: "people-outline" as const,
        iconColor: "#34d399",
      },
      {
        id: "3",
        label: "In service",
        value: String(m?.in_service ?? 0),
        iconName: "time-outline" as const,
        iconColor: "#fb923c",
      },
      {
        id: "4",
        label: "Revenue Today",
        value:
          typeof m?.revenue_today === "number"
            ? `$${m.revenue_today.toFixed(0)}`
            : `$${m?.revenue_today || 0}`,
        iconName: "trending-up-outline" as const,
        iconColor: "#f59e0b",
      },
    ];
  }, [dashboardResponse]);

  const upcomingBookingsData = useMemo(() => {
    const list = dashboardResponse?.data?.upcoming_bookings;
    if (Array.isArray(list)) {
      return list.map((b: any) => ({
        id: String(b.id),
        clientName: b.customer_name || "Customer",
        serviceName: b.services || b.service_name || "Service",
        price:
          typeof b.price === "number"
            ? `$${b.price.toFixed(2)}`
            : `$${b.price || 0}`,
        duration: b.duration_minutes ? `${b.duration_minutes} min` : "30 min",
        time: b.start_time || "00:00",
      }));
    }
    return [];
  }, [dashboardResponse]);

  return (
    <Container className="bg-white" isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white pb-10">
        <AdminHeader
          adminName={adminName}
          avatarUrl={avatarUrl}
          onPressNotification={() => router.push("/notification")}
        />
        {isLoadingDashboard ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator color="#FF9500" size="large" />
          </View>
        ) : (
          <>
            <AdminTodayMetrics metrics={metricsData} />
            <AdminNextAppointments bookings={upcomingBookingsData} />
          </>
        )}
      </View>
    </Container>
  );
}

export default AdminDashboardIndex;
