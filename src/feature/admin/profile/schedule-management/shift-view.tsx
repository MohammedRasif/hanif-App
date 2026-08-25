import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export interface StaffShiftItem {
  avatarUrl?: string;
  breakHours?: string;
  duration: string;
  hours: string;
  id: string;
  name: string;
}

export const MOCK_SHIFTS: StaffShiftItem[] = [
  {
    id: "1",
    name: "isaac",
    duration: "8h:30 m",
    hours: "09:00 – 05:30 pm",
  },
  {
    id: "2",
    name: "isaac",
    duration: "8h:30 m",
    hours: "09:00 – 05:30 pm",
    breakHours: "Break: 2:00 pm - 3:00 pm",
  },
  {
    id: "3",
    name: "isaac",
    duration: "8h:30 m",
    hours: "09:00 – 05:30 pm",
  },
  {
    id: "4",
    name: "isaac",
    duration: "8h:30 m",
    hours: "09:00 – 05:30 pm",
  },
];

export interface ShiftViewProps {
  onBack: () => void;
  onSelectShift?: (shift: StaffShiftItem) => void;
}

export function ShiftView({ onBack, onSelectShift }: ShiftViewProps) {
  const [shifts, setShifts] = useState<StaffShiftItem[]>(MOCK_SHIFTS);
  const [selectedShift, setSelectedShift] = useState<StaffShiftItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [isShiftEnabled, setIsShiftEnabled] = useState(true);
  const [startTime, setStartTime] = useState("10:50 am");
  const [endTime, setEndTime] = useState("05:30 pm");

  // Break states
  const [hasBreak, setHasBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState("10:50 am");
  const [breakEndTime, setBreakEndTime] = useState("05:30 pm");

  // Staff member time off states
  const [hasTimeOff, setHasTimeOff] = useState(false);
  const [timeOffStartTime, setTimeOffStartTime] = useState("10:50 am");
  const [timeOffEndTime, setTimeOffEndTime] = useState("05:30 pm");

  const handleOpenShiftModal = (item: StaffShiftItem) => {
    setSelectedShift(item);
    setIsShiftEnabled(true);
    const parts = item.hours.split("–");
    const firstPart = parts[0];
    const secondPart = parts[1];
    if (firstPart && secondPart) {
      setStartTime(firstPart.trim());
      setEndTime(secondPart.trim());
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

    setHasTimeOff(false);
    setTimeOffStartTime("10:50 am");
    setTimeOffEndTime("05:30 pm");

    setIsModalOpen(true);
    onSelectShift?.(item);
  };

  const handleSaveModal = () => {
    if (selectedShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShift.id
            ? {
                ...s,
                hours: `${startTime} – ${endTime}`,
                breakHours: hasBreak
                  ? `Break: ${breakStartTime} - ${breakEndTime}`
                  : undefined,
              }
            : s,
        ),
      );
    }
    setIsModalOpen(false);
    setSelectedShift(null);
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
          Shift
        </Text>

        <View className="w-10" />
      </View>

      {/* Main List */}
      <View className="flex-1 px-6 pt-2">
        <FlatList
          contentContainerStyle={{ paddingBottom: 40 }}
          data={shifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
              onPress={() => handleOpenShiftModal(item)}
            >
              {/* Left Side: Avatar + Name + Duration */}
              <View className="flex-row items-center gap-3.5">
                {item.avatarUrl ? (
                  <Image
                    className="h-12 w-12 rounded-full bg-gray-200"
                    contentFit="cover"
                    source={{ uri: item.avatarUrl }}
                  />
                ) : (
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <StyledIcons
                      className="text-gray-900"
                      name="person"
                      size={22}
                    />
                  </View>
                )}

                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    {item.duration}
                  </Text>
                </View>
              </View>

              {/* Right Side: Hours + Chevron */}
              <View className="flex-row items-center gap-2.5">
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
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Edit Shift Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
        transparent
        visible={isModalOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
            {/* Header: Title + Enable Switch */}
            <View className="flex-row items-start justify-between">
              <Text className="font-bold text-2xl text-gray-900">Shift</Text>

              <View className="items-center">
                <Switch
                  ios_backgroundColor="#e5e7eb"
                  onValueChange={setIsShiftEnabled}
                  thumbColor="#ffffff"
                  trackColor={{ false: "#d1d5db", true: "#10B981" }}
                  value={isShiftEnabled}
                />
                <Text className="font-medium text-xs text-gray-500 mt-1 text-center">
                  Enable
                </Text>
              </View>
            </View>

            {/* Shift Time Range Row: [10:50 am] to [05:30 pm] */}
            <View className="mt-4 flex-row items-center justify-between gap-2.5">
              <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                <TextInput
                  className="text-center font-semibold text-sm text-gray-900 w-full"
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

            {/* Staff Member Time Off Section */}
            <View className="mt-5">
              <Text className="font-bold text-lg text-gray-900 mb-2">
                Staff member time off
              </Text>
              <View className="rounded-2xl bg-[#F8F9FA] p-3.5">
                <Pressable
                  className="flex-row items-center gap-2 active:opacity-75"
                  onPress={() => setHasTimeOff(!hasTimeOff)}
                >
                  <StyledIcons
                    className="text-gray-900"
                    name={hasTimeOff ? "remove" : "add"}
                    size={20}
                  />
                  <Text className="font-bold text-sm text-gray-900">
                    Add time off
                  </Text>
                </Pressable>

                {hasTimeOff && (
                  <View className="mt-3 flex-row items-center justify-between gap-2.5">
                    <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                      <TextInput
                        className="text-center font-semibold text-sm text-gray-900 w-full"
                        onChangeText={setTimeOffStartTime}
                        placeholder="10:50 am"
                        placeholderTextColor="#9CA3AF"
                        value={timeOffStartTime}
                      />
                    </View>

                    <Text className="font-medium text-sm text-gray-600 px-1">
                      to
                    </Text>

                    <View className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3">
                      <TextInput
                        className="text-center font-semibold text-sm text-gray-900 w-full"
                        onChangeText={setTimeOffEndTime}
                        placeholder="05:30 pm"
                        placeholderTextColor="#9CA3AF"
                        value={timeOffEndTime}
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
