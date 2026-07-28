import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/components/staff/profile/staff-profile-top-header";
import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface BreakItem {
  date: string;
  dateRange: string;
  id: string;
  status?: string;
  type: string;
}

const MOCK_BREAKS: BreakItem[] = [
  {
    id: "1",
    date: "10 July",
    type: "Sick leave",
    status: "Approved",
    dateRange: "18 july -20 july",
  },
  {
    id: "2",
    date: "16 July",
    type: "Sick leave",
    status: "Approved",
    dateRange: "18 july -20 july",
  },
  {
    id: "3",
    date: "19 July",
    type: "Custom",
    dateRange: "18 july -20 july",
  },
];

export default function StaffBreakScheduleScreen() {
  const [selectedMonth] = useState("July");

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
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        data={MOCK_BREAKS}
        keyExtractor={(item) => item.id}
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
    </Container>
  );
}
