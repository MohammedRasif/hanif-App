import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/components/staff/profile/staff-profile-top-header";
import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface ReportItem {
  amount: string;
  date: string;
  id: string;
  name: string;
  service: string;
}

const MOCK_REPORTS: ReportItem[] = [
  {
    amount: "$40",
    date: "29 may 2026",
    id: "1",
    name: "Trump",
    service: "face wah",
  },
  {
    amount: "$40",
    date: "29 may 2026",
    id: "2",
    name: "Trump",
    service: "face wah",
  },
  {
    amount: "$40",
    date: "29 may 2026",
    id: "3",
    name: "Trump",
    service: "face wah",
  },
  {
    amount: "$40",
    date: "29 may 2026",
    id: "4",
    name: "Trump",
    service: "face wah",
  },
  {
    amount: "$40",
    date: "29 may 2026",
    id: "5",
    name: "Trump",
    service: "face wah",
  },
];

export default function StaffReportsScreen() {
  const [selectedMonth] = useState("Jan");

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
            25
          </Text>
        </View>

        {/* Revenue Card */}
        <View className="flex-1 rounded-2xl bg-[#FFFBF0] border border-amber-100/60 p-4">
          <Text className="font-poppins-medium text-xs text-gray-500">
            Revenue
          </Text>
          <Text className="mt-1 font-poppins-bold text-xl text-gray-900">
            $8788
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        data={MOCK_REPORTS}
        keyExtractor={(item) => item.id}
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
    </Container>
  );
}
