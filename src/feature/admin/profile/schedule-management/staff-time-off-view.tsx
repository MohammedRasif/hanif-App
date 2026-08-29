import triggerIcon from "@/assets/calender-trigger.png";
import { StyledIcons } from "@/lib";
import { useUpdateBarberScheduleMutation } from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export interface StaffTimeOffItem {
  avatarUrl?: string;
  id: string;
  name: string;
  role?: string;
  subtitle: string;
}

interface StaffTimeOffViewProps {
  liveTimeOff?: any[] | null;
  onAddNewTimeOff?: () => void;
  onBack: () => void;
  onSelectStaff?: (item: StaffTimeOffItem) => void;
  onSelectTimeOff?: (item: StaffTimeOffItem) => void;
  selectedDate?: string;
}

const DEFAULT_STAFF_TIME_OFF_LIST: StaffTimeOffItem[] = [
  {
    id: "1",
    name: "isaac",
    role: "manager",
    subtitle: "Today",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
  {
    id: "2",
    name: "isaac",
    role: "manager",
    subtitle: "Today",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  },
];

const MOCK_STAFF_OPTIONS = [
  "Isaac",
  "Alex (Senior barber)",
  "Sarah (Stylist)",
  "Jhon (barber)",
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

export function StaffTimeOffView({
  onBack,
  onAddNewTimeOff,
  onSelectStaff,
  onSelectTimeOff,
  liveTimeOff,
  selectedDate,
}: StaffTimeOffViewProps) {
  const [updateBarberSchedule, { isLoading: isUpdating }] =
    useUpdateBarberScheduleMutation();

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initialTimeOffList = React.useMemo(() => {
    if (liveTimeOff !== undefined && liveTimeOff !== null) {
      if (Array.isArray(liveTimeOff) && liveTimeOff.length > 0) {
        return liveTimeOff.map((item: any, idx: number) => {
          const staffName = item.staff?.name || `Staff ${idx + 1}`;
          const reasonStr = item.reason || "Time off";
          const dateSub =
            item.start_date === item.end_date
              ? `${reasonStr} (${item.start_date})`
              : `${reasonStr} (${item.start_date} - ${item.end_date})`;
          return {
            id: String(item.staff?.id || idx + 1),
            name: staffName,
            role: "Staff Member",
            subtitle: dateSub,
            avatarUrl:
              item.staff?.image ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          };
        });
      }
      return [];
    }
    return DEFAULT_STAFF_TIME_OFF_LIST;
  }, [liveTimeOff]);

  const [timeOffList, setTimeOffList] =
    React.useState<StaffTimeOffItem[]>(initialTimeOffList);

  React.useEffect(() => {
    setTimeOffList(initialTimeOffList);
  }, [initialTimeOffList]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = useMemo(() => formatDateISO(new Date()), []);

  // Modal form states
  const [selectedStaff, setSelectedStaff] = useState("Isaac");
  const [selectedReason, setSelectedReason] = useState("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [isApproved, setIsApproved] = useState(false);

  // Pickers modal states
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
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

  const [selectedStaffItem, setSelectedStaffItem] =
    useState<StaffTimeOffItem | null>(null);

  const handleOpenCalendar = (target: "start" | "end") => {
    setCalendarTarget(target);
    setIsCalendarOpen(true);
  };

  const handleRowClick = (item: StaffTimeOffItem) => {
    setSelectedStaffItem(item);
    if (onSelectStaff) {
      onSelectStaff(item);
    } else if (onSelectTimeOff) {
      onSelectTimeOff(item);
    }
    setSelectedStaff(item.name || "Isaac");
    setFeedbackMessage(null);
    setIsModalOpen(true);
  };

  const handleFabClick = () => {
    if (onAddNewTimeOff) {
      onAddNewTimeOff();
    }
    setFeedbackMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    setFeedbackMessage(null);
    const targetDate = selectedDate || todayStr;
    const barberId = Number(selectedStaffItem?.id || 8);

    const breaksPayload = [
      {
        start_time: "13:00:00",
        end_time: "13:30:00",
        title: "Lunch Break",
      },
      {
        start_time: "16:00:00",
        end_time: "16:15:00",
        title: "Short Break",
      },
    ];

    const timeOffPayload = [
      {
        start_date: startDate,
        end_date: endDate,
        is_full_day: isAllDay,
        start_time: isAllDay ? undefined : "17:00:00",
        end_time: isAllDay ? undefined : "18:00:00",
        reason:
          selectedReason !== "Reason" ? selectedReason : "Personal appointment",
      },
    ];

    try {
      const payload = {
        barber: barberId,
        date: targetDate,
        shift: {
          start_time: "09:00:00",
          end_time: "19:00:00",
          is_off: false,
        },
        breaks: breaksPayload,
        time_off: timeOffPayload,
      };

      const res = await updateBarberSchedule(payload).unwrap();

      setFeedbackMessage({
        type: "success",
        text: res.details || "Barber schedule time off updated successfully.",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to update time off schedule.";
      setFeedbackMessage({ type: "error", text: errorText });
    }
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
          Time off Today
        </Text>

        <View className="w-10" />
      </View>

      {/* Main List */}
      <View className="flex-1 px-6 pt-2">
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={timeOffList}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-16 items-center justify-center">
              <Text className="font-medium text-sm text-gray-400">
                No staff member time off for this date
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
              onPress={() => handleRowClick(item)}
            >
              {/* Left Side: Avatar + Name + Subtitle */}
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
                    {item.subtitle}
                  </Text>
                </View>
              </View>

              {/* Right Side: Chevron */}
              <StyledIcons
                className="text-gray-900"
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-xl active:scale-95 overflow-hidden z-50"
        onPress={handleFabClick}
      >
        <Image
          contentFit="contain"
          source={triggerIcon}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>

      {/* Edit/Add Time Off Modal */}
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
              {/* Feedback Banner */}
              {feedbackMessage && (
                <View
                  className={`mb-4 rounded-2xl p-3 ${
                    feedbackMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold text-center ${
                      feedbackMessage.type === "success"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {feedbackMessage.text}
                  </Text>
                </View>
              )}

              {/* Modal Header Title */}
              <Text className="font-bold text-2xl text-gray-900 mb-4">
                Staff member time off
              </Text>

              {/* Staff Member Field */}
              <View className="mb-4">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Staff Member
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

              {/* Reason Field */}
              <View className="mb-5">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Reason
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
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
              </View>

              {/* All Day Checkbox Row */}
              <Pressable
                className="mb-5 flex-row items-center gap-3 active:opacity-80"
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

              {/* Date Range Section - Opens Calendar Directly */}
              <View className="mb-5 flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Start date
                  </Text>
                  <Pressable
                    className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                    onPress={() => handleOpenCalendar("start")}
                  >
                    <Text className="font-semibold text-sm text-gray-900">
                      {startDate}
                    </Text>
                    <StyledIcons
                      className="text-gray-500"
                      name="calendar"
                      size={18}
                    />
                  </Pressable>
                </View>

                <View className="flex-1">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    End date
                  </Text>
                  <Pressable
                    className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                    onPress={() => handleOpenCalendar("end")}
                  >
                    <Text className="font-semibold text-sm text-gray-900">
                      {endDate}
                    </Text>
                    <StyledIcons
                      className="text-gray-500"
                      name="calendar"
                      size={18}
                    />
                  </Pressable>
                </View>
              </View>

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

              {/* Save Button */}
              <Pressable
                className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
                disabled={isUpdating}
                onPress={handleSaveModal}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="font-bold text-base text-white">Save</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

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
            {MOCK_STAFF_OPTIONS.map((name) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedStaff === name
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={name}
                onPress={() => {
                  setSelectedStaff(name);
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedStaff === name
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {name}
                </Text>
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
                          isSelected ? "text-white font-bold" : "text-gray-900"
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
    </View>
  );
}
