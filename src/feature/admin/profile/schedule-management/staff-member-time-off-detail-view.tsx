import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export interface TimeOffRecord {
  date: string;
  id: string;
  reason: string;
}

export interface StaffMemberTimeOffDetailProps {
  onBack: () => void;
  staff?: {
    avatarUrl?: string;
    id: string;
    name: string;
    role?: string;
  };
}

const DEFAULT_TIME_OFF_RECORDS: TimeOffRecord[] = [
  {
    id: "1",
    reason: "Sick day",
    date: "10 march 2026",
  },
  {
    id: "2",
    reason: "Vacation",
    date: "10 march 2026",
  },
];

const MOCK_REASON_OPTIONS = [
  "Sick day",
  "Vacation",
  "Personal emergency",
  "Training / Conference",
  "Other",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function StaffMemberTimeOffDetailView({
  onBack,
  staff = {
    id: "1",
    name: "Isaac",
    role: "manager",
  },
}: StaffMemberTimeOffDetailProps) {
  const [records, setRecords] = useState<TimeOffRecord[]>(
    DEFAULT_TIME_OFF_RECORDS,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = useMemo(() => formatDateISO(new Date()), []);

  // Modal form states
  const [selectedReason, setSelectedReason] = useState("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [isApproved, setIsApproved] = useState(false);

  // Pickers
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end">(
    "start",
  );
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(
    new Date().getMonth(),
  );

  const handleOpenCalendar = (target: "start" | "end") => {
    setCalendarTarget(target);
    setIsCalendarOpen(true);
  };

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

  // Calendar days grid calculation
  const daysInMonth = useMemo(
    () => new Date(calendarYear, calendarMonthIndex + 1, 0).getDate(),
    [calendarYear, calendarMonthIndex],
  );
  const firstDayOfWeek = useMemo(
    () => new Date(calendarYear, calendarMonthIndex, 1).getDay(),
    [calendarYear, calendarMonthIndex],
  );

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between border-b border-gray-100">
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
          Staff member details
        </Text>

        <View className="w-10" />
      </View>

      {/* Staff Profile Header Card */}
      <View className="px-6 pt-5 pb-3">
        <View className="flex-row items-center gap-4">
          {staff.avatarUrl ? (
            <Image
              className="h-16 w-16 rounded-full bg-gray-200"
              contentFit="cover"
              source={{ uri: staff.avatarUrl }}
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <StyledIcons className="text-gray-900" name="person" size={28} />
            </View>
          )}

          <View>
            <Text className="font-bold text-xl text-gray-900 capitalize">
              {staff.name}
            </Text>
            <Text className="font-medium text-sm text-gray-400 mt-0.5">
              {staff.role || "Staff Member"}
            </Text>
          </View>
        </View>
      </View>

      {/* Section Subheader & Action Button */}
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="font-bold text-lg text-gray-900">Time off</Text>
        <Pressable
          className="rounded-full bg-black px-4 py-2 active:bg-gray-800"
          onPress={() => setIsModalOpen(true)}
        >
          <Text className="font-semibold text-xs text-white">Add time off</Text>
        </Pressable>
      </View>

      {/* Time Off Records List */}
      <View className="flex-1 px-6 pt-2">
        <FlatList
          contentContainerStyle={{ paddingBottom: 40 }}
          data={records}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-16 items-center justify-center">
              <Text className="font-medium text-sm text-gray-400">
                No time off records found for this staff member
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5">
              <Text className="font-bold text-base text-gray-900">
                {item.reason}
              </Text>
              <Text className="font-medium text-sm text-gray-500">
                {item.date}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Time Off Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
        transparent
        visible={isModalOpen}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 items-center justify-center bg-black/50 px-6"
        >
          <ScrollView
            className="w-full max-w-sm"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full rounded-4xl bg-white p-6 shadow-2xl my-6">
              {/* Modal Title */}
              <Text className="font-bold text-xl text-gray-900 text-center mb-5">
                Add time off
              </Text>

              {/* Staff Card Display */}
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

                <View className="flex-1">
                  <Text className="font-bold text-base text-gray-900 capitalize">
                    {staff.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    {staff.role || "Staff Member"}
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
                      ? "text-gray-400"
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

              {/* Start Date & End Date Row - Opens Calendar Directly */}
              <View className="flex-row items-center justify-between gap-2.5 mb-4">
                {/* Start Date */}
                <View className="flex-1">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Start date
                  </Text>
                  <Pressable
                    className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                    onPress={() => handleOpenCalendar("start")}
                  >
                    <Text className="font-semibold text-sm text-gray-900">
                      {startDate}
                    </Text>
                    <StyledIcons
                      className="text-gray-500"
                      name="calendar"
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
                    onPress={() => handleOpenCalendar("end")}
                  >
                    <Text className="font-semibold text-sm text-gray-900">
                      {endDate}
                    </Text>
                    <StyledIcons
                      className="text-gray-500"
                      name="calendar"
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
                    If you select this checkbox, the time will be include in
                    staff member working time
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
          </ScrollView>
        </KeyboardAvoidingView>

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
                  className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
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

        {/* Calendar Modal for Date Selection */}
        <Modal
          animationType="slide"
          onRequestClose={() => setIsCalendarOpen(false)}
          transparent
          visible={isCalendarOpen}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
              {/* Header: Month / Year + Switcher */}
              <View className="flex-row items-center justify-between mb-4">
                <Pressable
                  className="p-2 rounded-full active:bg-gray-100"
                  onPress={() => {
                    if (calendarMonthIndex === 0) {
                      setCalendarMonthIndex(11);
                      setCalendarYear((y) => y - 1);
                    } else {
                      setCalendarMonthIndex((m) => m - 1);
                    }
                  }}
                >
                  <StyledIcons
                    className="text-gray-900"
                    name="chevron-back"
                    size={20}
                  />
                </Pressable>

                <Text className="font-bold text-lg text-gray-900">
                  {MONTH_NAMES[calendarMonthIndex]} {calendarYear}
                </Text>

                <Pressable
                  className="p-2 rounded-full active:bg-gray-100"
                  onPress={() => {
                    if (calendarMonthIndex === 11) {
                      setCalendarMonthIndex(0);
                      setCalendarYear((y) => y + 1);
                    } else {
                      setCalendarMonthIndex((m) => m + 1);
                    }
                  }}
                >
                  <StyledIcons
                    className="text-gray-900"
                    name="chevron-forward"
                    size={20}
                  />
                </Pressable>
              </View>

              {/* Days Grid */}
              <View className="flex-row flex-wrap">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <View
                    className="w-[14.28%] items-center justify-center py-2"
                    key={`day-head-${i}`}
                  >
                    <Text className="font-semibold text-xs text-gray-400">
                      {d}
                    </Text>
                  </View>
                ))}

                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <View className="w-[14.28%] py-3" key={`blank-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${calendarYear}-${String(
                    calendarMonthIndex + 1,
                  ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

                  const currentSelected =
                    calendarTarget === "start" ? startDate : endDate;

                  const isSelected = currentSelected === dateStr;

                  return (
                    <Pressable
                      className="w-[14.28%] items-center justify-center py-2.5"
                      key={`day-${dayNum}`}
                      onPress={() => {
                        if (calendarTarget === "start") setStartDate(dateStr);
                        if (calendarTarget === "end") setEndDate(dateStr);
                        setIsCalendarOpen(false);
                      }}
                    >
                      <View
                        className={`h-9 w-9 items-center justify-center rounded-full ${
                          isSelected ? "bg-[#FF9500]" : "active:bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`font-semibold text-sm ${
                            isSelected
                              ? "text-white font-bold"
                              : "text-gray-900"
                          }`}
                        >
                          {dayNum}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}
