import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface AddBusinessDaysOffViewProps {
  onBack: () => void;
  onSave?: (data: { duration: string; from: string; to: string }) => void;
}

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "This Weekend",
  "Next Monday",
  "Custom Date",
];

export function AddBusinessDaysOffView({
  onBack,
  onSave,
}: AddBusinessDaysOffViewProps) {
  const [fromDate, setFromDate] = useState("Today");
  const [toDate, setToDate] = useState("Today");
  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);
  const [duration] = useState("1 day");

  const handleSave = () => {
    onSave?.({ from: fromDate, to: toDate, duration });
    onBack();
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
          Add business full days off
        </Text>

        <View className="w-10" />
      </View>

      {/* Date Range Selection Row */}
      <View className="px-6 pt-4 flex-row items-center justify-between gap-2.5">
        {/* From Date Dropdown */}
        <Pressable
          className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsFromPickerOpen(true)}
        >
          <Text className="font-semibold text-sm text-gray-900">
            {fromDate}
          </Text>
          <StyledIcons
            className="text-gray-500"
            name="chevron-down"
            size={18}
          />
        </Pressable>

        <Text className="font-medium text-sm text-gray-600 px-1">to</Text>

        {/* To Date Dropdown */}
        <Pressable
          className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsToPickerOpen(true)}
        >
          <Text className="font-semibold text-sm text-gray-900">{toDate}</Text>
          <StyledIcons
            className="text-gray-500"
            name="chevron-down"
            size={18}
          />
        </Pressable>
      </View>

      {/* Flexible Spacer */}
      <View className="flex-1" />

      {/* Bottom Summary & Save Action */}
      <View className="px-6 pb-8 pt-3 border-t border-gray-100 bg-white">
        <Text className="text-center font-medium text-xs text-gray-400 mb-1">
          Duration
        </Text>
        <Text className="text-center font-bold text-2xl text-gray-900 mb-6">
          {duration}
        </Text>

        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          onPress={handleSave}
        >
          <Text className="font-bold text-base text-white">Save</Text>
        </Pressable>
      </View>

      {/* From Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsFromPickerOpen(false)}
        transparent
        visible={isFromPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Start Date
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  fromDate === opt ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setFromDate(opt);
                  setIsFromPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    fromDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {fromDate === opt && (
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

      {/* To Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsToPickerOpen(false)}
        transparent
        visible={isToPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select End Date
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  toDate === opt ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setToDate(opt);
                  setIsToPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    toDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {toDate === opt && (
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
