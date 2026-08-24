import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { MOCK_REPORTS_DATA } from "./mock-data";
import type { TimeFilter } from "./types";

interface ReportsScreenProps {
  onBack?: () => void;
}

export function ReportsScreen({ onBack }: ReportsScreenProps) {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("daily");

  const currentData = MOCK_REPORTS_DATA[timeFilter];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleExportPdf = () => {
    console.log("Exporting PDF report for:", timeFilter);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={handleBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Reports
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-6">
        {/* Title & Export PDF Button */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            Reports
          </Text>

          <Pressable
            className="flex-row items-center gap-1.5 rounded-2xl bg-[#FF9500] px-4 py-2.5 active:bg-[#e08300] shadow-xs"
            onPress={handleExportPdf}
          >
            <StyledIcons
              className="text-white"
              name="download-outline"
              size={18}
            />
            <Text className="font-bold text-sm text-white">Export PDF</Text>
          </Pressable>
        </View>

        {/* Time Filter Pills */}
        <View className="mb-5 flex-row gap-2.5">
          {(["daily", "weekly", "monthly"] as const).map((filter) => {
            const isSelected = timeFilter === filter;
            const label =
              filter === "daily"
                ? "Daily"
                : filter === "weekly"
                  ? "weekly"
                  : "Monthly";

            return (
              <Pressable
                className={`rounded-full px-4 py-2 border ${
                  isSelected
                    ? "border-gray-900 bg-white"
                    : "border-gray-200/80 bg-white"
                } active:bg-gray-50`}
                key={filter}
                onPress={() => setTimeFilter(filter)}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? "font-bold text-gray-900"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Metric Cards Row */}
        <View className="mb-6 flex-row gap-3.5">
          {/* Total Revenue Card */}
          <View className="flex-1 rounded-3xl bg-[#F8F9FA] p-4.5">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-50">
                <StyledIcons
                  className="text-blue-500"
                  name="trending-up"
                  size={14}
                />
              </View>
              <Text className="font-medium text-xs text-gray-500">
                Total Revenue
              </Text>
            </View>
            <Text className="font-bold text-2xl text-gray-900">
              {currentData.totalRevenue}
            </Text>
          </View>

          {/* Appointments Card */}
          <View className="flex-1 rounded-3xl bg-[#F8F9FA] p-4.5">
            <View className="mb-2 flex-row items-center gap-2">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                <StyledIcons
                  className="text-emerald-500"
                  name="calendar-outline"
                  size={14}
                />
              </View>
              <Text className="font-medium text-xs text-gray-500">
                Appointments
              </Text>
            </View>
            <Text className="font-bold text-2xl text-gray-900">
              {currentData.appointments}
            </Text>
          </View>
        </View>

        {/* Staff Breakdown Section */}
        <Text className="font-bold text-xl text-gray-900 mb-2">
          Staff Breakdown
        </Text>

        <FlatList
          contentContainerStyle={{ paddingBottom: 40 }}
          data={currentData.staffBreakdown}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between py-3.5 border-b border-gray-100">
              <View className="flex-row items-center gap-3.5">
                <Image
                  className="h-12 w-12 rounded-full bg-gray-200"
                  contentFit="cover"
                  source={{ uri: item.avatarUrl }}
                />
                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    {item.appointmentsCount} appointment
                  </Text>
                </View>
              </View>

              <Text className="font-semibold text-base text-gray-900">
                {item.revenue}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
