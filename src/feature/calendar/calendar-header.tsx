import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { MOCK_BARBERS, MOCK_DAYS } from "./calendar-mock-data";
import type { DayItem } from "./calendar-types";

const StyledIonicons = withUniwind(Ionicons);

type Props = {
  activeDateStr?: string;
  onSelectDate?: (day: DayItem) => void;
};

export function CalendarHeader({
  activeDateStr = "2026-07-18",
  onSelectDate,
}: Props) {
  return (
    <View className="bg-white border-b border-gray-100 pt-10">
      {/* Top Title & Header Actions */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View>
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            Appointments
          </Text>
          <Text className="mt-1 font-normal text-gray-400 text-sm">
            9.00 - 6.00 pm
          </Text>
        </View>

        {/* Top Right Action Icons */}
        <View className="flex-row items-center gap-3">
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-70">
            <StyledIonicons
              className="text-gray-700"
              name="options-outline"
              size={20}
            />
          </Pressable>
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-70">
            <StyledIonicons
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
          {MOCK_DAYS.map((day) => {
            const isSelected = day.fullDateStr === activeDateStr;
            return (
              <Pressable
                className={`items-center justify-center rounded-2xl px-4 py-3 min-w-[58px] ${
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

      {/* Barber Columns Header (Multi-barber view supporting 4 barbers) */}
      <View className="flex-row border-t border-gray-100 pt-3 pb-2 px-2 ml-14">
        {MOCK_BARBERS.map((barber) => (
          <View
            className="flex-1 flex-row items-center gap-1.5 px-1"
            key={barber.id}
          >
            <Image
              contentFit="cover"
              source={{ uri: barber.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <View className="flex-1">
              <Text
                className="font-semibold text-gray-900 text-[11px]"
                numberOfLines={1}
              >
                {barber.name}
              </Text>
              <Text className="text-gray-400 text-[10px]" numberOfLines={1}>
                {barber.workingHours}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
