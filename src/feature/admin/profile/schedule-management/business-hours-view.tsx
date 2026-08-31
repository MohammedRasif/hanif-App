import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useGetBusinessHoursQuery,
  useUpdateBusinessHoursDateMutation,
} from "@/Redux/feature/dashboard";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

export interface DayScheduleItem {
  breakHours?: string;
  day: string;
  hours: string;
  isClosed: boolean;
}

export const MOCK_BUSINESS_HOURS: DayScheduleItem[] = [
  {
    day: "Monday",
    hours: "10:00 – 06:00 pm",
    isClosed: false,
    breakHours: "Break: 1:00 pm - 2:00 pm",
  },
  {
    day: "Tuesday",
    hours: "10:00 – 06:00 pm",
    isClosed: false,
  },
  {
    day: "Wednesday",
    hours: "10:00 – 06:00 pm",
    isClosed: false,
  },
  {
    day: "Thursday",
    hours: "10:00 – 06:00 pm",
    isClosed: false,
  },
  {
    day: "Friday",
    hours: "10:00 – 06:00 pm",
    isClosed: false,
  },
  {
    day: "Saturday",
    hours: "Closed",
    isClosed: true,
  },
  {
    day: "Sunday",
    hours: "Closed",
    isClosed: true,
  },
];

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

interface BusinessHoursViewProps {
  onBack: () => void;
  onSave?: () => void;
  selectedDate?: string;
}

function formatDisplayTime(timeStr?: string | null): string {
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

export function BusinessHoursView({
  onBack,
  selectedDate,
}: BusinessHoursViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 9;

  // 📡 GET /v1/schedule/business-hours/{shopId}/
  const { data: businessHoursResponse, isLoading } = useGetBusinessHoursQuery(
    shopId,
    { refetchOnMountOrArgChange: true },
  );

  const [updateBusinessHours, { isLoading: isUpdating }] =
    useUpdateBusinessHoursDateMutation();

  const scheduleList = useMemo<DayScheduleItem[]>(() => {
    if (
      Array.isArray(businessHoursResponse?.data) &&
      businessHoursResponse.data.length > 0
    ) {
      const dayOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      const itemsMap = new Map<string, DayScheduleItem>();
      businessHoursResponse.data.forEach((item) => {
        const dayKey = item.day_of_week?.toLowerCase();
        const dayCapitalized =
          item.day_of_week.charAt(0).toUpperCase() +
          item.day_of_week.slice(1).toLowerCase();

        const isClosed = item.is_closed || !item.open_time || !item.close_time;
        const openFormatted = formatDisplayTime(item.open_time);
        const closeFormatted = formatDisplayTime(item.close_time);
        const hoursText = isClosed
          ? "Closed"
          : `${openFormatted} – ${closeFormatted}`;

        let breakText: string | undefined;
        if (Array.isArray(item.breaks) && item.breaks.length > 0) {
          const firstBreak = item.breaks[0];
          if (firstBreak?.start_time && firstBreak?.end_time) {
            breakText = `Break: ${formatDisplayTime(
              firstBreak.start_time,
            )} - ${formatDisplayTime(firstBreak.end_time)}`;
          }
        }

        itemsMap.set(dayKey, {
          day: dayCapitalized,
          hours: hoursText,
          isClosed,
          breakHours: breakText,
        });
      });

      const sortedList: DayScheduleItem[] = [];
      dayOrder.forEach((dKey) => {
        if (itemsMap.has(dKey)) {
          sortedList.push(itemsMap.get(dKey)!);
        }
      });

      itemsMap.forEach((val, key) => {
        if (!dayOrder.includes(key)) {
          sortedList.push(val);
        }
      });

      return sortedList;
    }

    return MOCK_BUSINESS_HOURS;
  }, [businessHoursResponse]);

  const [selectedDayItem, setSelectedDayItem] =
    useState<DayScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDayEnabled, setIsDayEnabled] = useState(true);
  const [startTime, setStartTime] = useState("10:00 am");
  const [endTime, setEndTime] = useState("06:00 pm");

  const [hasBreak, setHasBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState("01:00 pm");
  const [breakEndTime, setBreakEndTime] = useState("02:00 pm");

  const [timePickerTarget, setTimePickerTarget] = useState<
    "start" | "end" | "breakStart" | "breakEnd" | null
  >(null);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleOpenEditModal = (item: DayScheduleItem) => {
    setSelectedDayItem(item);
    setFeedbackMessage(null);
    setIsDayEnabled(!item.isClosed);

    if (item.isClosed) {
      setStartTime("10:00 am");
      setEndTime("06:00 pm");
      setHasBreak(false);
    } else {
      const parts = item.hours.split("–");
      setStartTime(parts[0]?.trim() || "10:00 am");
      setEndTime(parts[1]?.trim() || "06:00 pm");

      if (item.breakHours) {
        setHasBreak(true);
        setBreakStartTime("01:00 pm");
        setBreakEndTime("02:00 pm");
      } else {
        setHasBreak(false);
      }
    }

    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    setFeedbackMessage(null);
    const openTime24 = convertTo24Hour(startTime);
    const closeTime24 = convertTo24Hour(endTime);

    const breaksPayload = hasBreak
      ? [
          {
            start_time: convertTo24Hour(breakStartTime),
            end_time: convertTo24Hour(breakEndTime),
          },
        ]
      : [];

    const targetDate = selectedDate || "2026-08-30";

    try {
      const payload = {
        shopId,
        date: targetDate,
        open_time: openTime24,
        close_time: closeTime24,
        is_closed: !isDayEnabled,
        breaks: breaksPayload,
      };

      const res = await updateBusinessHours(payload).unwrap();

      setFeedbackMessage({
        type: "success",
        text: res.details || "Shop date hours updated successfully.",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedDayItem(null);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to update business hours for selected date.";
      setFeedbackMessage({ type: "error", text: errorText });
    }
  };

  return (
    <View className="flex-1 bg-white">
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

      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#FF9500" size="large" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-2"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {scheduleList.map((item) => (
            <Pressable
              className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
              key={item.day}
              onPress={() => handleOpenEditModal(item)}
            >
              <View>
                <Text className="font-bold text-base text-gray-900">
                  {item.day}
                </Text>
                <Text
                  className={`font-medium text-xs mt-0.5 ${
                    item.isClosed ? "text-gray-400" : "text-gray-500"
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
            </Pressable>
          ))}
        </ScrollView>
      )}

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
            <View className="w-full rounded-4xl bg-white p-6 shadow-2xl">
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

              <View className="mt-4 flex-row items-center justify-between gap-2.5">
                <Pressable
                  className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  disabled={!isDayEnabled}
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
                  disabled={!isDayEnabled}
                  onPress={() => setTimePickerTarget("end")}
                >
                  <Text className="text-center font-semibold text-sm text-gray-900">
                    {endTime}
                  </Text>
                </Pressable>
              </View>

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
