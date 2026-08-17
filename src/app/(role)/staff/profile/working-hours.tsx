import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import React from "react";
import { FlatList, Text, View } from "react-native";

interface WorkingHourItem {
  breakTime?: string;
  day: string;
  hours: string;
  id: string;
}

const MOCK_WORKING_HOURS: WorkingHourItem[] = [
  {
    id: "1",
    day: "Saturday",
    hours: "10:00 am - 05:00 pm",
    breakTime: "Break: 2:00 pm -03:00 pm",
  },
  { id: "2", day: "Monday", hours: "10:00 am - 05:00 pm" },
  { id: "3", day: "Thusday", hours: "10:00 am - 05:00 pm" },
  { id: "4", day: "Thusday", hours: "10:00 am - 05:00 pm" },
  { id: "5", day: "Thusday", hours: "Day off" },
];

export default function StaffWorkingHoursScreen() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Working Days & Hours" />

      {/* Working Hours List */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        data={MOCK_WORKING_HOURS}
        keyExtractor={(item) => item.id}
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
    </Container>
  );
}
