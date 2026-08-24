import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface DaySchedule {
  breakHours?: string;
  day: string;
  hours: string;
  isClosed?: boolean;
}

const DEFAULT_BUSINESS_HOURS: DaySchedule[] = [
  {
    day: "Saturday",
    hours: "10:00 am – 05:00 pm",
    breakHours: "Break: 2:00 pm -03:00 pm",
  },
  {
    day: "Monday",
    hours: "10:00 am – 05:00 pm",
  },
  {
    day: "Tuesday",
    hours: "10:00 am – 05:00 pm",
  },
  {
    day: "Wednesday",
    hours: "10:00 am – 05:00 pm",
  },
  {
    day: "Thursday",
    hours: "Closed",
    isClosed: true,
  },
  {
    day: "Friday",
    hours: "10:00 am – 05:00 pm",
  },
  {
    day: "Sunday",
    hours: "Closed",
    isClosed: true,
  },
];

interface BusinessHoursViewProps {
  onBack: () => void;
  onSave?: () => void;
}

export function BusinessHoursView({ onBack, onSave }: BusinessHoursViewProps) {
  const [scheduleList] = useState<DaySchedule[]>(DEFAULT_BUSINESS_HOURS);

  const handleSave = () => {
    onSave ? onSave() : onBack();
  };

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
          Business hours
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Heading */}
        <Text className="font-bold text-lg text-gray-900 mt-2 mb-2">
          Opening Hours
        </Text>

        {/* Schedule Rows */}
        <View className="mb-6">
          {scheduleList.map((item, index) => (
            <Pressable
              className="py-4.5 flex-row items-center justify-between border-b border-gray-100/90 active:bg-gray-50/50"
              key={index}
              onPress={() => console.log("Edit hours for", item.day)}
            >
              {/* Day Name */}
              <Text className="font-bold text-base text-gray-900">
                {item.day}
              </Text>

              {/* Hours + Chevron */}
              <View className="flex-row items-center gap-3">
                <View className="items-end">
                  <Text
                    className={`font-semibold text-sm ${
                      item.isClosed ? "text-gray-900" : "text-gray-900"
                    }`}
                  >
                    {item.hours}
                  </Text>
                  {item.breakHours && (
                    <Text className="font-medium text-xs text-gray-400 mt-0.5">
                      {item.breakHours}
                    </Text>
                  )}
                </View>

                <StyledIcons
                  className="text-gray-900"
                  name="chevron-forward"
                  size={18}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View className="px-6 pb-8 pt-3 bg-white border-t border-gray-100">
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          onPress={handleSave}
        >
          <Text className="font-bold text-base text-white">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
