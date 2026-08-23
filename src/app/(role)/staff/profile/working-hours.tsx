import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import { useGetStaffMeScheduleQuery } from "@/Redux/feature/dashboard";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface WorkingHourItem {
  breakTime?: string;
  day: string;
  hours: string;
  id: string;
}

export default function StaffWorkingHoursScreen() {
  const {
    data: scheduleResponse,
    isLoading,
    isError,
  } = useGetStaffMeScheduleQuery();

  const scheduleData = Array.isArray(scheduleResponse?.data)
    ? scheduleResponse.data
    : [];

  const formattedWorkingHours: WorkingHourItem[] = scheduleData.map((item) => ({
    id: String(item.id),
    day: item.day_of_week
      ? item.day_of_week.charAt(0).toUpperCase() + item.day_of_week.slice(1)
      : "Shift",
    hours: item.is_active ? `${item.start_time} - ${item.end_time}` : "Day off",
  }));

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Working Days & Hours" />

      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-400">
            Loading schedule...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-16 items-center justify-center px-6">
          <Text className="font-poppins-medium text-red-500 text-sm text-center">
            Failed to load working hours.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          data={formattedWorkingHours}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Text className="font-poppins text-gray-400 text-sm">
                No data here
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="flex-row items-start justify-between border-b border-gray-100/80 py-4">
              <Text className="font-poppins-semibold text-sm text-gray-800">
                {item.day}
              </Text>

              <View className="items-end">
                <Text className="font-poppins-bold text-sm text-gray-800">
                  {item.hours}
                </Text>
                {item.breakTime && (
                  <Text className="mt-1 font-poppins text-xs text-gray-400">
                    {item.breakTime}
                  </Text>
                )}
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
}
