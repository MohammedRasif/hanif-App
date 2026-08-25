import triggerIcon from "@/assets/calender-trigger.png";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

export interface StaffDetailItem {
  avatarUrl?: string;
  id: string;
  name: string;
  role?: string;
}

export interface TimeOffRecord {
  date: string;
  id: string;
  reason: string;
}

interface StaffMemberTimeOffDetailViewProps {
  onBack: () => void;
  staff?: StaffDetailItem;
}

const DEFAULT_TIME_OFF_RECORDS: TimeOffRecord[] = [
  {
    id: "1",
    date: "Today",
    reason: "Sick day",
  },
  {
    id: "2",
    date: "30 july 2026",
    reason: "Sick day",
  },
];

const MOCK_REASON_OPTIONS = [
  "Sick day",
  "Vacation",
  "Personal emergency",
  "Training / Conference",
  "Other",
];

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "30 july 2026",
  "Next Monday",
  "Custom Date",
];

export function StaffMemberTimeOffDetailView({
  onBack,
  staff = {
    id: "1",
    name: "Isaac",
    role: "manager",
  },
}: StaffMemberTimeOffDetailViewProps) {
  const [records, setRecords] = useState<TimeOffRecord[]>(
    DEFAULT_TIME_OFF_RECORDS,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [selectedReason, setSelectedReason] = useState("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState("Today");
  const [endDate, setEndDate] = useState("Today");
  const [isApproved, setIsApproved] = useState(false);

  // Pickers
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const handleSaveModal = () => {
    if (selectedReason !== "Reason") {
      setRecords((prev) => [
        {
          id: String(Date.now()),
          date: startDate,
          reason: selectedReason,
        },
        ...prev,
      ]);
    }
    setIsModalOpen(false);
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
          {staff.name}
        </Text>

        <View className="w-10" />
      </View>

      {/* Time Off Records List */}
      <View className="flex-1 px-6 pt-2">
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="py-4 border-b border-gray-100">
              <Text className="font-bold text-base text-gray-900">
                {item.date}
              </Text>
              <Text className="font-medium text-xs text-gray-400 mt-1">
                {item.reason}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-xl active:scale-95 overflow-hidden z-20"
        onPress={() => setIsModalOpen(true)}
      >
        <Image
          contentFit="contain"
          source={triggerIcon}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>

      {/* Add Time Off Modal (Matching Image 2) */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
        transparent
        visible={isModalOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
            {/* Modal Title */}
            <Text className="font-bold text-xl text-gray-900 text-center mb-5">
              Add time off
            </Text>

            {/* Staff Card */}
            <View className="mb-4 flex-row items-center gap-3.5 rounded-2xl bg-[#F8F9FA] p-3.5">
              {staff.avatarUrl ? (
                <Image
                  className="h-12 w-12 rounded-full bg-gray-200"
                  contentFit="cover"
                  source={{ uri: staff.avatarUrl }}
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
                  {staff.name}
                </Text>
                <Text className="font-medium text-xs text-gray-400 mt-0.5">
                  {staff.role || "manager"}
                </Text>
              </View>
            </View>

            {/* Reason Dropdown */}
            <Pressable
              className="mb-4 h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsReasonPickerOpen(true)}
            >
              <Text
                className={`font-semibold text-sm ${
                  selectedReason === "Reason"
                    ? "text-gray-500"
                    : "text-gray-900"
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
                  <StyledIcons
                    className="text-white"
                    name="checkmark"
                    size={16}
                  />
                )}
              </View>
              <Text className="font-semibold text-base text-gray-900">
                All day
              </Text>
            </Pressable>

            {/* Thin Divider */}
            <View className="mb-4 h-px w-full bg-gray-100" />

            {/* Start Date & End Date Row */}
            <View className="flex-row items-center justify-between gap-2.5 mb-4">
              {/* Start Date */}
              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Start date
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setIsStartDatePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {startDate}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={16}
                  />
                </Pressable>
              </View>

              {/* End Date */}
              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  End date
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setIsEndDatePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {endDate}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={16}
                  />
                </Pressable>
              </View>
            </View>

            {/* Thin Divider */}
            <View className="mb-4 h-px w-full bg-gray-100" />

            {/* Approved Checkbox Row */}
            <Pressable
              className="mb-6 flex-row items-start gap-3 active:opacity-80"
              onPress={() => setIsApproved(!isApproved)}
            >
              <View
                className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md ${
                  isApproved ? "bg-black" : "border border-gray-300 bg-white"
                }`}
              >
                {isApproved && (
                  <StyledIcons
                    className="text-white"
                    name="checkmark"
                    size={16}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="font-bold text-base text-gray-900">
                  Approved
                </Text>
                <Text className="font-medium text-xs text-gray-400 mt-0.5 leading-4">
                  If you select this checkbox, the time will be include in staff
                  member working time
                </Text>
              </View>
            </Pressable>

            {/* Save Action Button */}
            <Pressable
              className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleSaveModal}
            >
              <Text className="font-bold text-base text-white">Save</Text>
            </Pressable>
          </View>
        </View>

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
      </Modal>
    </View>
  );
}
