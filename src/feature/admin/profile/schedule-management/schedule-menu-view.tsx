import { StyledIcons } from "@/lib";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SCHEDULE_MENU_ITEMS } from "./mock-data";
import type { ScheduleSubPage } from "./types";

interface ScheduleMenuViewProps {
  onBack: () => void;
  onNavigate: (page: ScheduleSubPage) => void;
}

export function ScheduleMenuView({
  onBack,
  onNavigate,
}: ScheduleMenuViewProps) {
  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-5 flex-row items-center justify-between">
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
          Schedule management
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Menu List Card */}
      <View className="px-6 pt-2">
        <View className="rounded-3xl bg-[#F8F9FA] overflow-hidden">
          {SCHEDULE_MENU_ITEMS.map((item, index) => {
            const isLast = index === SCHEDULE_MENU_ITEMS.length - 1;
            return (
              <Pressable
                className={`py-4.5 px-5 flex-row items-center justify-between active:bg-gray-100 ${
                  !isLast ? "border-b border-gray-100" : ""
                }`}
                key={item.id}
                onPress={() => onNavigate(item.page)}
              >
                <Text className="font-semibold text-base text-gray-900">
                  {item.label}
                </Text>
                <StyledIcons
                  className="text-gray-900"
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
