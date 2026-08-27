import triggerIcon from "@/assets/calender-trigger.png";
import { StyledIcons } from "@/lib";
import { useUpdateBarberScheduleMutation } from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import React, { useState } from "react";
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

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "30 july 2026",
  "Next Monday",
  "Custom Date",
];

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

  // Modal form states
  const [selectedStaff, setSelectedStaff] = useState("Isaac");
  const [selectedReason, setSelectedReason] = useState("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState("Today");
  const [endDate, setEndDate] = useState("Today");
  const [isApproved, setIsApproved] = useState(false);

  // Pickers modal states
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const handleRowClick = (item: StaffTimeOffItem) => {
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
    const targetDate = selectedDate || "2026-08-30";
    const barberId = 8;

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
        start_date: targetDate,
        end_date: targetDate,
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
        breaks: breaksPayload,
        time_off: timeOffPayload,
      };

      console.log(
        "▶️ Hitting PUT /api/v1/schedule/barber-schedule/ Payload:",
        JSON.stringify(payload, null, 2),
      );

      // 📡 PUT /api/v1/schedule/barber-schedule/
      const res = await updateBarberSchedule(payload).unwrap();

      console.log(
        "✅ Success Response PUT /api/v1/schedule/barber-schedule/:",
        JSON.stringify(res, null, 2),
      );

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
                No time off records for this date
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
              onPress={() => handleRowClick(item)}
            >
              <View className="flex-row items-center gap-3.5">
                <Image
                  className="h-12 w-12 rounded-full bg-gray-200"
                  contentFit="cover"
                  source={{ uri: item.avatarUrl }}
                />
                <View>
                  <Text className="font-bold text-base text-gray-900 capitalize">
                    {item.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    {item.subtitle}
                  </Text>
                </View>
              </View>

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
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-xl active:scale-95 z-20 overflow-hidden"
        onPress={handleFabClick}
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
              {/* Header Feedback Banner */}
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

              {/* Modal Title */}
              <Text className="font-bold text-xl text-gray-900 text-center mb-5">
                Add time off
              </Text>

              {/* Staff Card */}
              <Pressable
                className="mb-4 flex-row items-center gap-3.5 rounded-2xl bg-[#F8F9FA] p-3.5 active:bg-gray-100"
                onPress={() => setIsStaffPickerOpen(true)}
              >
                <Image
                  className="h-12 w-12 rounded-full bg-gray-200"
                  contentFit="cover"
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                  }}
                />

                <View className="flex-1">
                  <Text className="font-bold text-base text-gray-900">
                    {selectedStaff}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    manager
                  </Text>
                </View>

                <StyledIcons
                  className="text-gray-400"
                  name="chevron-down"
                  size={18}
                />
              </Pressable>

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
                    If you select this checkbox, the time will be include in
                    staff member working time
                  </Text>
                </View>
              </Pressable>

              {/* Save Action Button */}
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
