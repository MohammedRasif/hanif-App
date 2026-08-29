import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import { useCreateBusinessOffMutation } from "@/Redux/feature/dashboard";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

interface AddBusinessDaysOffViewProps {
  onBack: () => void;
  onSave?: (data: { duration: string; from: string; to: string }) => void;
}

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

export function AddBusinessDaysOffView({
  onBack,
  onSave,
}: AddBusinessDaysOffViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 7;

  const [createBusinessOff, { isLoading: isUpdating }] =
    useCreateBusinessOffMutation();

  const [customFromDate, setCustomFromDate] = useState<string>(
    formatDateISO(new Date()),
  );
  const [customToDate, setCustomToDate] = useState<string>(
    formatDateISO(new Date()),
  );

  // Custom Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"from" | "to">("from");
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(
    new Date().getMonth(),
  );

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Dynamic duration calculation
  const durationText = useMemo(() => {
    const parseDate = (str: string) => {
      const parts = str.split("-");
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        return new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10),
        );
      }
      return new Date();
    };
    const sObj = parseDate(customFromDate);
    const eObj = parseDate(customToDate);
    const diffTime = Math.abs(eObj.getTime() - sObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }, [customFromDate, customToDate]);

  const handleOpenFromCalendar = () => {
    setCalendarTarget("from");
    setIsCalendarOpen(true);
  };

  const handleOpenToCalendar = () => {
    setCalendarTarget("to");
    setIsCalendarOpen(true);
  };

  const handleSave = async () => {
    setFeedbackMessage(null);
    try {
      const payload = {
        shop: shopId,
        start_date: customFromDate,
        end_date: customToDate,
        is_full_day: true,
      };

      console.log(
        "▶️ Hitting POST /api/v1/schedule/business/off/ Payload:",
        JSON.stringify(payload, null, 2),
      );

      // 📡 POST /api/v1/schedule/business/off/
      const res = await createBusinessOff(payload).unwrap();

      console.log(
        "✅ Success Response POST /api/v1/schedule/business/off/:",
        JSON.stringify(res, null, 2),
      );

      setFeedbackMessage({
        type: "success",
        text: res.details || "Business days off added successfully.",
      });

      onSave?.({
        from: customFromDate,
        to: customToDate,
        duration: durationText,
      });

      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
      console.log(
        "❌ Error Response POST /api/v1/schedule/business/off/:",
        JSON.stringify(err, null, 2),
      );
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to save business days off.";
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
          Add business full days off
        </Text>

        <View className="w-10" />
      </View>

      {/* Feedback Message Banner */}
      {feedbackMessage && (
        <View className="px-6 py-2">
          <View
            className={`rounded-2xl p-3 ${
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
        </View>
      )}

      {/* Date Range Selection Row */}
      <View className="px-6 pt-4 flex-row items-center justify-between gap-2.5">
        {/* From Date Button */}
        <Pressable
          className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={handleOpenFromCalendar}
        >
          <Text className="font-semibold text-sm text-gray-900">
            {customFromDate}
          </Text>
          <StyledIcons className="text-gray-500" name="calendar" size={18} />
        </Pressable>

        <Text className="font-medium text-sm text-gray-600 px-1">to</Text>

        {/* To Date Button */}
        <Pressable
          className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={handleOpenToCalendar}
        >
          <Text className="font-semibold text-sm text-gray-900">
            {customToDate}
          </Text>
          <StyledIcons className="text-gray-500" name="calendar" size={18} />
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
          {durationText}
        </Text>

        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          disabled={isUpdating}
          onPress={handleSave}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="font-bold text-base text-white">Save</Text>
          )}
        </Pressable>
      </View>

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

                const isSelected =
                  calendarTarget === "from"
                    ? customFromDate === dateStr
                    : customToDate === dateStr;

                return (
                  <Pressable
                    className="w-[14.28%] items-center justify-center py-2.5"
                    key={`day-${dayNum}`}
                    onPress={() => {
                      if (calendarTarget === "from") {
                        setCustomFromDate(dateStr);
                      } else {
                        setCustomToDate(dateStr);
                      }
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
