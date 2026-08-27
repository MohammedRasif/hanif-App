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
  Switch,
  Text,
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

export interface ShiftViewProps {
  liveShifts?: any[] | null;
  onBack: () => void;
  onSelectShift?: (shift: StaffShiftItem) => void;
  selectedDate?: string;
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

function formatTimeStr(timeStr?: string) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2 || !parts[0]) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${strHours}:${minutes} ${ampm}`;
}

function convertTo24Hour(timeStr?: string): string {
  if (!timeStr) return "09:00:00";
  const trimmed = timeStr.trim().toLowerCase();
  const isPm = trimmed.includes("pm");
  const isAm = trimmed.includes("am");
  const clean = trimmed.replace(/(am|pm)/g, "").trim();
  const parts = clean.split(":");
  if (parts.length === 0 || !parts[0]) return "09:00:00";

  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1] || "0", 10) || 0;
  const seconds = parseInt(parts[2] || "0", 10) || 0;

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return `${hStr}:${mStr}:${sStr}`;
}

const VALID_TIME_OPTIONS = [
  "08:00 am",
  "08:30 am",
  "09:00 am",
  "09:30 am",
  "10:00 am",
  "10:30 am",
  "11:00 am",
  "11:30 am",
  "12:00 pm",
  "12:30 pm",
  "01:00 pm",
  "01:30 pm",
  "02:00 pm",
  "02:30 pm",
  "03:00 pm",
  "03:30 pm",
  "04:00 pm",
  "04:30 pm",
  "05:00 pm",
  "05:30 pm",
  "06:00 pm",
  "06:30 pm",
  "07:00 pm",
  "07:30 pm",
  "08:00 pm",
  "08:30 pm",
  "09:00 pm",
];

export function ShiftView({
  onBack,
  onSelectShift,
  liveShifts,
  selectedDate,
}: ShiftViewProps) {
  const [updateBarberSchedule, { isLoading: isUpdating }] =
    useUpdateBarberScheduleMutation();

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const initialShifts = React.useMemo(() => {
    if (liveShifts !== undefined && liveShifts !== null) {
      if (Array.isArray(liveShifts) && liveShifts.length > 0) {
        return liveShifts.map((item: any, idx: number) => {
          const staffName = item.staff?.name || `Staff ${idx + 1}`;
          const firstShift = item.shift_time?.[0];
          const startStr = formatTimeStr(firstShift?.start_time) || "09:00 am";
          const endStr = formatTimeStr(firstShift?.end_time) || "06:00 pm";
          const durMinutes = item.duration_minutes || 540;
          const hoursCount = Math.floor(durMinutes / 60);
          const minsCount = durMinutes % 60;
          return {
            id: String(item.staff?.id || idx + 1),
            name: staffName,
            duration: `${hoursCount}h:${minsCount < 10 ? "0" : ""}${minsCount} m`,
            hours: `${startStr} – ${endStr}`,
            avatarUrl: item.staff?.image || undefined,
          };
        });
      }
      return [];
    }
    return MOCK_SHIFTS;
  }, [liveShifts]);

  const [shifts, setShifts] = React.useState<StaffShiftItem[]>(initialShifts);

  React.useEffect(() => {
    setShifts(initialShifts);
  }, [initialShifts]);

  const [selectedShift, setSelectedShift] = useState<StaffShiftItem | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [isShiftEnabled, setIsShiftEnabled] = useState(true);
  const [startTime, setStartTime] = useState("10:00 am");
  const [endTime, setEndTime] = useState("05:30 pm");

  // Break states
  const [hasBreak, setHasBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState("01:00 pm");
  const [breakEndTime, setBreakEndTime] = useState("01:30 pm");

  // Staff member time off states
  const [hasTimeOff, setHasTimeOff] = useState(false);
  const [timeOffStartTime, setTimeOffStartTime] = useState("05:00 pm");
  const [timeOffEndTime, setTimeOffEndTime] = useState("06:00 pm");

  // Time picker modal targeting state
  const [timePickerTarget, setTimePickerTarget] = useState<
    | "start"
    | "end"
    | "breakStart"
    | "breakEnd"
    | "timeOffStart"
    | "timeOffEnd"
    | null
  >(null);

  const handleOpenShiftModal = (item: StaffShiftItem) => {
    setSelectedShift(item);
    setFeedbackMessage(null);
    setIsShiftEnabled(true);
    const parts = item.hours.split("–");
    const firstPart = parts[0];
    const secondPart = parts[1];
    if (firstPart && secondPart) {
      setStartTime(firstPart.trim());
      setEndTime(secondPart.trim());
    } else {
      setStartTime("10:00 am");
      setEndTime("05:30 pm");
    }

    if (item.breakHours) {
      setHasBreak(true);
      setBreakStartTime("01:00 pm");
      setBreakEndTime("01:30 pm");
    } else {
      setHasBreak(false);
      setBreakStartTime("01:00 pm");
      setBreakEndTime("01:30 pm");
    }

    setHasTimeOff(false);
    setTimeOffStartTime("05:00 pm");
    setTimeOffEndTime("06:00 pm");

    setIsModalOpen(true);
    onSelectShift?.(item);
  };

  const handleSaveModal = async () => {
    setFeedbackMessage(null);
    const barberId = Number(selectedShift?.id || 8);
    const targetDate = selectedDate || "2026-08-30";

    const breaksPayload = hasBreak
      ? [
          {
            start_time: convertTo24Hour(breakStartTime),
            end_time: convertTo24Hour(breakEndTime),
            title: "Lunch Break",
          },
        ]
      : [];

    const timeOffPayload = hasTimeOff
      ? [
          {
            start_date: targetDate,
            end_date: targetDate,
            is_full_day: false,
            start_time: convertTo24Hour(timeOffStartTime),
            end_time: convertTo24Hour(timeOffEndTime),
            reason: "Personal appointment",
          },
        ]
      : [];

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
        text: res.details || "Barber schedule updated successfully.",
      });

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

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedShift(null);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to update barber schedule.";
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
          ListEmptyComponent={
            <View className="py-16 items-center justify-center">
              <Text className="font-medium text-sm text-gray-400">
                No shift records for this date
              </Text>
            </View>
          }
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

              {/* Shift Time Range Row: [10:00 am] to [05:30 pm] */}
              <View className="mt-4 flex-row items-center justify-between gap-2.5">
                <Pressable
                  className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setTimePickerTarget("start")}
                >
                  <Text className="text-center font-semibold text-sm text-gray-900">
                    {startTime}
                  </Text>
                </Pressable>

                <Text className="font-medium text-sm text-gray-600 px-1">
                  to
                </Text>

                <Pressable
                  className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setTimePickerTarget("end")}
                >
                  <Text className="text-center font-semibold text-sm text-gray-900">
                    {endTime}
                  </Text>
                </Pressable>
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
                      <Pressable
                        className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                        onPress={() => setTimePickerTarget("breakStart")}
                      >
                        <Text className="text-center font-semibold text-sm text-gray-900">
                          {breakStartTime}
                        </Text>
                      </Pressable>

                      <Text className="font-medium text-sm text-gray-600 px-1">
                        to
                      </Text>

                      <Pressable
                        className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                        onPress={() => setTimePickerTarget("breakEnd")}
                      >
                        <Text className="text-center font-semibold text-sm text-gray-900">
                          {breakEndTime}
                        </Text>
                      </Pressable>
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
                      <Pressable
                        className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                        onPress={() => setTimePickerTarget("timeOffStart")}
                      >
                        <Text className="text-center font-semibold text-sm text-gray-900">
                          {timeOffStartTime}
                        </Text>
                      </Pressable>

                      <Text className="font-medium text-sm text-gray-600 px-1">
                        to
                      </Text>

                      <Pressable
                        className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                        onPress={() => setTimePickerTarget("timeOffEnd")}
                      >
                        <Text className="text-center font-semibold text-sm text-gray-900">
                          {timeOffEndTime}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              {/* Save Action Button */}
              <Pressable
                className="mt-6 h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
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

      {/* Valid Time Selection Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setTimePickerTarget(null)}
        transparent
        visible={timePickerTarget !== null}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm max-h-[70%] rounded-3xl bg-white p-5 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900 text-center">
              Select Time
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {VALID_TIME_OPTIONS.map((t) => (
                <Pressable
                  className="py-3 px-4 mb-1 rounded-xl flex-row items-center justify-between active:bg-gray-100"
                  key={t}
                  onPress={() => {
                    if (timePickerTarget === "start") setStartTime(t);
                    if (timePickerTarget === "end") setEndTime(t);
                    if (timePickerTarget === "breakStart") setBreakStartTime(t);
                    if (timePickerTarget === "breakEnd") setBreakEndTime(t);
                    if (timePickerTarget === "timeOffStart")
                      setTimeOffStartTime(t);
                    if (timePickerTarget === "timeOffEnd") setTimeOffEndTime(t);
                    setTimePickerTarget(null);
                  }}
                >
                  <Text className="font-semibold text-base text-gray-900">
                    {t}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
