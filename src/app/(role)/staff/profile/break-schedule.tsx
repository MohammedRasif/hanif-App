import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import { StyledIcons } from "@/lib";
import { useGetStaffMeTimeOffQuery } from "@/Redux/feature/dashboard";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

interface BreakItem {
  date: string;
  dateRange: string;
  id: string;
  status?: string;
  type: string;
}

export default function StaffBreakScheduleScreen() {
  const [selectedMonth] = useState("July");

  const {
    data: timeOffResponse,
    isLoading,
    isError,
  } = useGetStaffMeTimeOffQuery();

  const timeOffData = Array.isArray(timeOffResponse?.data)
    ? timeOffResponse.data
    : [];

  const formattedBreaks: BreakItem[] = timeOffData.map((item) => ({
    id: String(item.id),
    date: item.start_date || "Time off",
    type: item.reason || "Sick leave",
    status: item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
      : undefined,
    dateRange: `${item.start_date} - ${item.end_date}`,
  }));

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Break Schedule" />

      {/* Sub Header & Month Selector */}
      <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
        <Text className="font-poppins-bold text-base text-gray-900">
          Time off
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

      {/* Schedule Items List */}
      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-400">
            Loading time off schedule...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-16 items-center justify-center px-6">
          <Text className="font-poppins-medium text-red-500 text-sm text-center">
            Failed to load time off schedule.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          data={formattedBreaks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Text className="font-poppins text-gray-400 text-sm">
                No data here
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="border-b border-gray-100/80 py-3.5 flex-row items-start justify-between">
              {/* Left Info */}
              <View>
                <Text className="font-poppins-semibold text-sm text-gray-900">
                  {item.date}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                  {item.type}
                </Text>
              </View>

              {/* Right Status & Date Range */}
              <View className="items-end">
                {item.status ? (
                  <View className="rounded-full bg-[#00B049] px-3 py-1">
                    <Text className="font-poppins-medium text-[11px] text-white">
                      {item.status}
                    </Text>
                  </View>
                ) : null}

                <Text
                  className={`font-poppins text-xs text-gray-400 ${
                    item.status ? "mt-1.5" : "mt-0"
                  }`}
                >
                  {item.dateRange}
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
