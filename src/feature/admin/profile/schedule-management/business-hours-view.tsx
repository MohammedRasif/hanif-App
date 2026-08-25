import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>(
    DEFAULT_BUSINESS_HOURS,
  );
  const [selectedDayItem, setSelectedDayItem] = useState<DaySchedule | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [isDayEnabled, setIsDayEnabled] = useState(true);
  const [startTime, setStartTime] = useState("10:50 am");
  const [endTime, setEndTime] = useState("05:30 pm");

  // Break states
  const [hasBreak, setHasBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState("10:50 am");
  const [breakEndTime, setBreakEndTime] = useState("05:30 pm");

  const handleOpenEditModal = (item: DaySchedule) => {
    setSelectedDayItem(item);
    setIsDayEnabled(!item.isClosed);

    if (!item.isClosed && item.hours.includes("–")) {
      const parts = item.hours.split("–");
      const first = parts[0];
      const second = parts[1];
      if (first && second) {
        setStartTime(first.trim());
        setEndTime(second.trim());
      } else {
        setStartTime("10:50 am");
        setEndTime("05:30 pm");
      }
    } else {
      setStartTime("10:50 am");
      setEndTime("05:30 pm");
    }

    if (item.breakHours) {
      setHasBreak(true);
      setBreakStartTime("02:00 pm");
      setBreakEndTime("03:00 pm");
    } else {
      setHasBreak(false);
      setBreakStartTime("10:50 am");
      setBreakEndTime("05:30 pm");
    }

    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (selectedDayItem) {
      setScheduleList((prev) =>
        prev.map((item) => {
          if (item.day === selectedDayItem.day) {
            if (!isDayEnabled) {
              return {
                ...item,
                hours: "Closed",
                isClosed: true,
                breakHours: undefined,
              };
            }
            return {
              ...item,
              hours: `${startTime} – ${endTime}`,
              isClosed: false,
              breakHours: hasBreak
                ? `Break: ${breakStartTime} - ${breakEndTime}`
                : undefined,
            };
          }
          return item;
        }),
      );
    }
    setIsModalOpen(false);
    setSelectedDayItem(null);
  };

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
              onPress={() => handleOpenEditModal(item)}
            >
              {/* Day Name */}
              <Text className="font-bold text-base text-gray-900">
                {item.day}
              </Text>

              {/* Hours + Chevron */}
              <View className="flex-row items-center gap-3">
                <View className="items-end">
                  <Text className="font-semibold text-sm text-gray-900">
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

      {/* Edit Day Schedule Modal (Dialog matching screenshot) */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
        transparent
        visible={isModalOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
            {/* Header: Day Title + Enable Switch */}
            <View className="flex-row items-start justify-between">
              <Text className="font-bold text-2xl text-gray-900">
                {selectedDayItem?.day || "Saturday"}
              </Text>

              <View className="items-center">
                <Switch
                  ios_backgroundColor="#e5e7eb"
                  onValueChange={setIsDayEnabled}
                  thumbColor="#ffffff"
                  trackColor={{ false: "#d1d5db", true: "#10B981" }}
                  value={isDayEnabled}
                />
                <Text className="font-medium text-xs text-gray-500 mt-1 text-center">
                  Enable
                </Text>
              </View>
            </View>

            {/* Time Range Row: [10:50 am] to [05:30 pm] */}
            <View className="mt-4 flex-row items-center justify-between gap-2.5">
              <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                <TextInput
                  className="text-center font-semibold text-sm text-gray-900 w-full"
                  editable={isDayEnabled}
                  onChangeText={setStartTime}
                  placeholder="10:50 am"
                  placeholderTextColor="#9CA3AF"
                  value={startTime}
                />
              </View>

              <Text className="font-medium text-sm text-gray-600 px-1">to</Text>

              <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                <TextInput
                  className="text-center font-semibold text-sm text-gray-900 w-full"
                  editable={isDayEnabled}
                  onChangeText={setEndTime}
                  placeholder="05:30 pm"
                  placeholderTextColor="#9CA3AF"
                  value={endTime}
                />
              </View>
            </View>

            {/* Break Section */}
            <View className="mt-5">
              <Text className="font-bold text-lg text-gray-900 mb-2">
                Break
              </Text>
              <View className="rounded-2xl bg-[#F8F9FA] p-3.5">
                <Pressable
                  className="flex-row items-center gap-2 active:opacity-75"
                  onPress={() => setHasBreak(!hasBreak)}
                >
                  <StyledIcons
                    className="text-gray-900"
                    name={hasBreak ? "remove" : "add"}
                    size={20}
                  />
                  <Text className="font-bold text-sm text-gray-900">
                    Add break
                  </Text>
                </Pressable>

                {hasBreak && (
                  <View className="mt-3 flex-row items-center justify-between gap-2.5">
                    <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                      <TextInput
                        className="text-center font-semibold text-sm text-gray-900 w-full"
                        onChangeText={setBreakStartTime}
                        placeholder="10:50 am"
                        placeholderTextColor="#9CA3AF"
                        value={breakStartTime}
                      />
                    </View>

                    <Text className="font-medium text-sm text-gray-600 px-1">
                      to
                    </Text>

                    <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                      <TextInput
                        className="text-center font-semibold text-sm text-gray-900 w-full"
                        onChangeText={setBreakEndTime}
                        placeholder="05:30 pm"
                        placeholderTextColor="#9CA3AF"
                        value={breakEndTime}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Save Action Button */}
            <Pressable
              className="mt-6 h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleSaveModal}
            >
              <Text className="font-bold text-base text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
