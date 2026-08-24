import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface DaySchedule {
  breakHours?: string;
  day: string;
  hours: string;
  isClosed?: boolean;
}

const DEFAULT_STAFF_WORKING_HOURS: DaySchedule[] = [
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
    hours: "10:00 am – 05:00 pm",
  },
  {
    day: "Friday",
    hours: "Closed",
    isClosed: true,
  },
  {
    day: "Sunday",
    hours: "Closed",
    isClosed: true,
  },
];

const MOCK_STAFF_OPTIONS = [
  "Isaac (manager)",
  "Alex (Senior barber)",
  "Sarah (Stylist)",
  "Jhon (barber)",
];

interface StaffWorkingHoursViewProps {
  onBack: () => void;
  onSave?: () => void;
}

export function StaffWorkingHoursView({
  onBack,
  onSave,
}: StaffWorkingHoursViewProps) {
  const [selectedStaff, setSelectedStaff] = useState(MOCK_STAFF_OPTIONS[0]);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [scheduleList] = useState<DaySchedule[]>(DEFAULT_STAFF_WORKING_HOURS);

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
          Staff member working hours
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Selector */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Select Staff Member
          </Text>
          <Pressable
            className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
            onPress={() => setIsStaffPickerOpen(true)}
          >
            <Text className="font-semibold text-sm text-gray-900">
              {selectedStaff}
            </Text>
            <StyledIcons
              className="text-gray-500"
              name="chevron-down"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section Heading */}
        <Text className="font-bold text-lg text-gray-900 mt-2 mb-2">
          Working Hours
        </Text>

        {/* Schedule Rows */}
        <View className="mb-6">
          {scheduleList.map((item, index) => (
            <Pressable
              className="py-4.5 flex-row items-center justify-between border-b border-gray-100/90 active:bg-gray-50/50"
              key={index}
              onPress={() => console.log("Edit working hours for", item.day)}
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

      {/* Staff Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStaffPickerOpen(false)}
        transparent
        visible={isStaffPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Staff Member
            </Text>
            {MOCK_STAFF_OPTIONS.map((st) => (
              <Pressable
                className={`py-3.5 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedStaff === st
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={st}
                onPress={() => {
                  setSelectedStaff(st);
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedStaff === st
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {st}
                </Text>
                {selectedStaff === st && (
                  <StyledIcons
                    className="text-[#FF9500]"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
