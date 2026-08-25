import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyledIcons } from "../styled-icons";
import type { DayItem } from "./types";

type Props = {
  activeDateStr?: string;
  days: DayItem[];
  onPressFilter?: () => void;
  onSelectDate?: (day: DayItem) => void;
  title?: string;
  workingHoursLabel?: string;
};

export function CalendarHeaderView({
  activeDateStr,
  days,
  onPressFilter,
  onSelectDate,
  title = "Appointments",
  workingHoursLabel = "9.00 - 6.00 pm",
}: Props) {
  return (
    <View className="bg-white border-b border-gray-100 pt-10">
      {/* Top Title & Header Actions */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View>
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            {title}
          </Text>
          <Text className="mt-1 font-normal text-gray-400 text-sm">
            {workingHoursLabel}
          </Text>
        </View>

        {/* Top Right Action Icons */}
        <View className="flex-row items-center gap-3">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-70"
            onPress={onPressFilter}
          >
            <StyledIcons
              className="text-gray-700"
              name="options-outline"
              size={20}
            />
          </Pressable>
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-70">
            <StyledIcons
              className="text-gray-700"
              name="list-outline"
              size={20}
            />
          </Pressable>
        </View>
      </View>

      {/* Days Horizontal Carousel */}
      <View className="my-3">
        <ScrollView
          contentContainerClassName="px-5 gap-2.5"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {days.map((day) => {
            const isSelected = day.fullDateStr === activeDateStr;
            return (
              <Pressable
                className={`items-center justify-center rounded-2xl px-4 py-3 min-w-14.5 ${
                  isSelected ? "bg-black" : "border border-gray-200 bg-white"
                }`}
                key={day.fullDateStr}
                onPress={() => onSelectDate?.(day)}
              >
                <Text
                  className={`font-medium text-xs ${
                    isSelected ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {day.dayName}
                </Text>
                <Text
                  className={`mt-1 font-bold text-lg ${
                    isSelected ? "text-white" : "text-gray-900"
                  }`}
                >
                  {day.dateNumber}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
