import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import { StyledIcons } from "@/lib";
import { useGetStaffMeReportsQuery } from "@/Redux/feature/dashboard";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

interface ReportItem {
  amount: string;
  date: string;
  id: string;
  name: string;
  service: string;
}

export default function StaffReportsScreen() {
  const [selectedMonth] = useState("Jan");

  const {
    data: reportsResponse,
    isLoading,
    isError,
  } = useGetStaffMeReportsQuery();

  const reportData = reportsResponse?.data;
  const historyList = Array.isArray(reportData?.history)
    ? reportData.history
    : [];

  const transactions: ReportItem[] = historyList.map((t) => ({
    id: String(t.id),
    name: t.customer_name || "Customer",
    service: t.service_name || "Service",
    amount:
      typeof t.price === "number" || !String(t.price).startsWith("$")
        ? `$${t.price}`
        : String(t.price),
    date: t.date || "Today",
  }));

  const totalBookings =
    reportData?.total_bookings !== undefined ? reportData.total_bookings : 0;
  const totalRevenue =
    reportData?.total_revenue !== undefined
      ? typeof reportData.total_revenue === "number"
        ? `$${reportData.total_revenue.toFixed(2)}`
        : String(reportData.total_revenue).startsWith("$")
          ? reportData.total_revenue
          : `$${reportData.total_revenue}`
      : "$0.00";

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Reports" />

      {/* Sub Header Bar */}
      <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
        <Text className="font-poppins-medium text-base text-gray-600">
          Total
        </Text>

        <Pressable className="flex-row items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 active:bg-gray-50">
          <Text className="font-poppins-medium text-xs text-gray-800">
            {selectedMonth}
          </Text>
          <StyledIcons
            className="text-gray-600"
            name="chevron-down"
            size={14}
          />
        </Pressable>
      </View>

      {/* Summary Cards Row */}
      <View className="px-6 mb-5 flex-row gap-3">
        {/* Booking Card */}
        <View className="flex-1 rounded-2xl bg-[#FFFBF0] border border-amber-100/60 p-4">
          <Text className="font-poppins-medium text-xs text-gray-500">
            Booking
          </Text>
          <Text className="mt-1 font-poppins-bold text-xl text-gray-900">
            {totalBookings}
          </Text>
        </View>

        {/* Revenue Card */}
        <View className="flex-1 rounded-2xl bg-[#FFFBF0] border border-amber-100/60 p-4">
          <Text className="font-poppins-medium text-xs text-gray-500">
            Revenue
          </Text>
          <Text className="mt-1 font-poppins-bold text-xl text-gray-900">
            {totalRevenue}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-400">
            Loading reports...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-16 items-center justify-center px-6">
          <Text className="font-poppins-medium text-red-500 text-sm text-center">
            Failed to load staff reports.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          data={transactions}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-16 items-center justify-center">
              <Text className="font-poppins text-gray-400 text-sm">
                No data here
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between border-b border-gray-100/80 py-3.5">
              <View>
                <Text className="font-poppins-semibold text-sm text-gray-900">
                  {item.name}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                  {item.service}
                </Text>
              </View>

              <View className="items-end">
                <Text className="font-poppins-bold text-sm text-gray-900">
                  {item.amount}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                  {item.date}
                </Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
}
