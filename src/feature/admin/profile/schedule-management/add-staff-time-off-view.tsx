import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface AddStaffTimeOffViewProps {
  onBack: () => void;
  onSave?: (data: any) => void;
}

const MOCK_STAFF_OPTIONS = [
  "isaac",
  "Alex (Senior barber)",
  "Sarah (Stylist)",
  "Jhon (barber)",
];

const MOCK_REASON_OPTIONS = [
  "Vacation",
  "Sick leave",
  "Personal emergency",
  "Training / Conference",
  "Other",
];

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "This Weekend",
  "Next Monday",
  "Custom Date",
];

export function AddStaffTimeOffView({
  onBack,
  onSave,
}: AddStaffTimeOffViewProps) {
  const [selectedStaff, setSelectedStaff] = useState<string>("staff meber");
  const [selectedReason, setSelectedReason] = useState<string>("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState("Today");
  const [endDate, setEndDate] = useState("Today");
  const [isApproved, setIsApproved] = useState(false);

  // Pickers modal states
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const handleSave = () => {
    onSave?.({
      staff: selectedStaff,
      reason: selectedReason,
      isAllDay,
      startDate,
      endDate,
      isApproved,
    });
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
          Add time off
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Form Content */}
      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Member Dropdown */}
        <Pressable
          className="mb-3 h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsStaffPickerOpen(true)}
        >
          <Text
            className={`font-semibold text-sm ${
              selectedStaff === "staff meber"
                ? "text-gray-500"
                : "text-gray-900"
            }`}
          >
            {selectedStaff}
          </Text>
          <StyledIcons
            className="text-gray-500"
            name="chevron-down"
            size={18}
          />
        </Pressable>

        {/* Reason Dropdown */}
        <Pressable
          className="mb-5 h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsReasonPickerOpen(true)}
        >
          <Text
            className={`font-semibold text-sm ${
              selectedReason === "Reason" ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {selectedReason}
          </Text>
          <StyledIcons
            className="text-gray-500"
            name="chevron-down"
            size={18}
          />
        </Pressable>

        {/* All Day Checkbox Row */}
        <Pressable
          className="mb-4 flex-row items-center gap-3 active:opacity-80"
          onPress={() => setIsAllDay(!isAllDay)}
        >
          <View
            className={`h-6 w-6 items-center justify-center rounded-md ${
              isAllDay ? "bg-black" : "border border-gray-300 bg-white"
            }`}
          >
            {isAllDay && (
              <StyledIcons className="text-white" name="checkmark" size={16} />
            )}
          </View>
          <Text className="font-semibold text-base text-gray-900">All day</Text>
        </Pressable>

        {/* Thin Divider */}
        <View className="mb-5 h-px w-full bg-gray-100" />

        {/* Start Date & End Date Row */}
        <View className="flex-row items-center justify-between gap-3">
          {/* Start Date Column */}
          <View className="flex-1">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              Start date
            </Text>
            <Pressable
              className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsStartDatePickerOpen(true)}
            >
              <Text className="font-semibold text-sm text-gray-900">
                {startDate}
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>
          </View>

          {/* End Date Column */}
          <View className="flex-1">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              End date
            </Text>
            <Pressable
              className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsEndDatePickerOpen(true)}
            >
              <Text className="font-semibold text-sm text-gray-900">
                {endDate}
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section: Approved Checkbox & Save Button */}
      <View className="border-t border-gray-100 bg-white px-6 pt-4 pb-8">
        {/* Approved Checkbox Row */}
        <Pressable
          className="mb-5 flex-row items-start gap-3 active:opacity-80"
          onPress={() => setIsApproved(!isApproved)}
        >
          <View
            className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md ${
              isApproved ? "bg-black" : "border border-gray-300 bg-white"
            }`}
          >
            {isApproved && (
              <StyledIcons className="text-white" name="checkmark" size={16} />
            )}
          </View>

          <View className="flex-1">
            <Text className="font-bold text-base text-gray-900">Approved</Text>
            <Text className="font-medium text-xs text-gray-400 mt-0.5 leading-4">
              If you select this checkbox, the time will be include in staff
              member working time
            </Text>
          </View>
        </Pressable>

        {/* Save Button */}
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

      {/* Reason Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsReasonPickerOpen(false)}
        transparent
        visible={isReasonPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Reason
            </Text>
            {MOCK_REASON_OPTIONS.map((r) => (
              <Pressable
                className={`py-3.5 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedReason === r
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={r}
                onPress={() => {
                  setSelectedReason(r);
                  setIsReasonPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedReason === r
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {r}
                </Text>
                {selectedReason === r && (
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

      {/* Start Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStartDatePickerOpen(false)}
        transparent
        visible={isStartDatePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Start Date
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  startDate === opt ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setStartDate(opt);
                  setIsStartDatePickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    startDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {startDate === opt && (
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

      {/* End Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsEndDatePickerOpen(false)}
        transparent
        visible={isEndDatePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select End Date
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  endDate === opt ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setEndDate(opt);
                  setIsEndDatePickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    endDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {endDate === opt && (
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
