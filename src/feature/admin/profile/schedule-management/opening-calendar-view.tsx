import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface OpeningCalendarViewProps {
  onBack: () => void;
  onNavigateToBusinessHours?: () => void;
  onNavigateToShift?: () => void;
  onNavigateToTimeOff?: () => void;
}

export function OpeningCalendarView({
  onBack,
  onNavigateToTimeOff,
  onNavigateToShift,
  onNavigateToBusinessHours,
}: OpeningCalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState(18);
  const [currentMonth] = useState("January 2024");

  // Mock days grid matching the design
  const calendarRows = [
    [
      { day: 31, isCurrentMonth: false },
      { day: 1, isCurrentMonth: true },
      { day: 2, isCurrentMonth: true },
      { day: 3, isCurrentMonth: true },
      { day: 4, isCurrentMonth: true },
      { day: 5, isCurrentMonth: true },
      { day: 6, isCurrentMonth: true },
    ],
    [
      { day: 7, isCurrentMonth: true },
      { day: 8, isCurrentMonth: true },
      { day: 9, isCurrentMonth: true },
      { day: 10, isCurrentMonth: true },
      { day: 11, isCurrentMonth: true },
      { day: 12, isCurrentMonth: true },
      { day: 13, isCurrentMonth: true },
    ],
    [
      { day: 14, isCurrentMonth: true },
      { day: 15, isCurrentMonth: true },
      { day: 16, isCurrentMonth: true },
      { day: 17, isCurrentMonth: true },
      { day: 18, isCurrentMonth: true },
      { day: 19, isCurrentMonth: true },
      { day: 20, isCurrentMonth: true },
    ],
    [
      { day: 21, isCurrentMonth: true },
      { day: 22, isCurrentMonth: true },
      { day: 23, isCurrentMonth: true },
      { day: 24, isCurrentMonth: true },
      { day: 25, isCurrentMonth: true },
      { day: 26, isCurrentMonth: true },
      { day: 27, isCurrentMonth: true },
    ],
    [
      { day: 28, isCurrentMonth: true },
      { day: 29, isCurrentMonth: true },
      { day: 30, isCurrentMonth: true },
      { day: 31, isCurrentMonth: true },
      { day: 1, isCurrentMonth: false },
      { day: 2, isCurrentMonth: false },
      { day: 3, isCurrentMonth: false },
    ],
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Opening calendar
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Card */}
        <View className="mb-4 rounded-3xl bg-[#F8F9FA] p-5">
          {/* Month Switcher Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/90 active:bg-gray-200">
              <StyledIcons
                className="text-gray-700"
                name="chevron-back"
                size={18}
              />
            </Pressable>

            <Text className="font-bold text-lg text-gray-900">
              {currentMonth}
            </Text>

            <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/90 active:bg-gray-200">
              <StyledIcons
                className="text-gray-700"
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          </View>

          {/* Weekday Labels */}
          <View className="mb-3 flex-row justify-between">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text
                className="w-10 text-center font-medium text-xs text-gray-400"
                key={day}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View className="gap-2">
            {calendarRows.map((row, rIdx) => (
              <View className="flex-row justify-between" key={rIdx}>
                {row.map((cell, cIdx) => {
                  const isSelected =
                    cell.isCurrentMonth && cell.day === selectedDay;

                  return (
                    <Pressable
                      className={`h-10 w-10 items-center justify-center rounded-2xl ${
                        isSelected
                          ? "bg-black shadow-xs"
                          : "active:bg-gray-200/60"
                      }`}
                      key={cIdx}
                      onPress={() => {
                        if (cell.isCurrentMonth) {
                          setSelectedDay(cell.day);
                        }
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "font-bold text-white"
                            : !cell.isCurrentMonth
                              ? "font-normal text-gray-300"
                              : "font-medium text-gray-900"
                        }`}
                      >
                        {cell.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Selected Day Info Card */}
        <Pressable
          className="mb-6 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={onNavigateToBusinessHours}
        >
          <View>
            <Text className="font-bold text-base text-gray-900">Thu</Text>
            <Text className="font-medium text-xs text-gray-400 mt-0.5">
              Today
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-sm text-gray-900">
              09:00 – 05:30 pm
            </Text>
            <StyledIcons
              className="text-gray-900"
              name="chevron-forward"
              size={18}
            />
          </View>
        </Pressable>

        {/* Section: Staff Management */}
        <Text className="font-bold text-lg text-gray-900 mb-3">
          Staff management
        </Text>

        {/* Shift Card */}
        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={onNavigateToShift}
        >
          <Text className="font-bold text-base text-gray-900">Shift</Text>
          <StyledIcons
            className="text-gray-900"
            name="chevron-forward"
            size={18}
          />
        </Pressable>

        {/* Time off (2) Card */}
        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={onNavigateToTimeOff}
        >
          <Text className="font-bold text-base text-gray-900">
            Time off (2)
          </Text>
          <StyledIcons
            className="text-gray-900"
            name="chevron-forward"
            size={18}
          />
        </Pressable>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 z-20"
        onPress={onNavigateToTimeOff}
      >
        <StyledIcons className="text-white" name="sunny-outline" size={26} />
      </Pressable>
    </View>
  );
}
