import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import { useUpdateBusinessHoursDateMutation } from "@/Redux/feature/dashboard";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

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

function parseOptionToDate(option: string, customDateStr?: string): Date {
  const today = new Date();
  if (option === "Today") return today;
  if (option === "Tomorrow") {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }
  if (option === "This Weekend") {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
    d.setDate(d.getDate() + diff);
    return d;
  }
  if (option === "Next Monday") {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const diff = (8 - dayOfWeek) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
  }
  if (option === "Custom Date" && customDateStr) {
    const parts = customDateStr.split("-");
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10),
      );
    }
  }
  return today;
}

export function AddBusinessDaysOffView({
  onBack,
  onSave,
}: AddBusinessDaysOffViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 7;

  const [updateBusinessHoursDate, { isLoading: isUpdating }] =
    useUpdateBusinessHoursDateMutation();

  const [fromDateOption, setFromDateOption] = useState("Today");
  const [toDateOption, setToDateOption] = useState("Today");

  const [customFromDate, setCustomFromDate] = useState<string>(
    formatDateISO(new Date()),
  );
  const [customToDate, setCustomToDate] = useState<string>(
    formatDateISO(new Date()),
  );

  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);

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

  const startDateObj = useMemo(
    () => parseOptionToDate(fromDateOption, customFromDate),
    [fromDateOption, customFromDate],
  );
  const endDateObj = useMemo(
    () => parseOptionToDate(toDateOption, customToDate),
    [toDateOption, customToDate],
  );

  const formattedFromStr = useMemo(
    () => formatDateISO(startDateObj),
    [startDateObj],
  );
  const formattedToStr = useMemo(() => formatDateISO(endDateObj), [endDateObj]);

  // Dynamic duration calculation
  const durationText = useMemo(() => {
    const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }, [startDateObj, endDateObj]);

  const handleSelectFromOption = (opt: string) => {
    setFromDateOption(opt);
    setIsFromPickerOpen(false);
    if (opt === "Custom Date") {
      setCalendarTarget("from");
      setIsCalendarOpen(true);
    }
  };

  const handleSelectToOption = (opt: string) => {
    setToDateOption(opt);
    setIsToPickerOpen(false);
    if (opt === "Custom Date") {
      setCalendarTarget("to");
      setIsCalendarOpen(true);
    }
  };

  const handleSave = async () => {
    setFeedbackMessage(null);
    try {
      const payload = {
        shopId,
        date: formattedFromStr,
        open_time: "10:00:00",
        close_time: "18:00:00",
        is_closed: true,
        breaks: [],
      };

      console.log(
        "▶️ Hitting PUT /api/v1/schedule/business-hours/" +
          shopId +
          "/date/ Payload:",
        JSON.stringify(payload, null, 2),
      );

      // 📡 PUT /api/v1/schedule/business-hours/{shop_id}/date/
      const res = await updateBusinessHoursDate(payload).unwrap();

      console.log(
        "✅ Success Response PUT /api/v1/schedule/business-hours/" +
          shopId +
          "/date/:",
        JSON.stringify(res, null, 2),
      );

      setFeedbackMessage({
        type: "success",
        text: res.details || "Business days off added successfully.",
      });

      onSave?.({
        from: formattedFromStr,
        to: formattedToStr,
        duration: durationText,
      });

      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
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
        {/* From Date Dropdown */}
        <Pressable
          className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsFromPickerOpen(true)}
        >
          <Text className="font-semibold text-sm text-gray-900">
            {fromDateOption === "Custom Date" ? customFromDate : fromDateOption}
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
          <Text className="font-semibold text-sm text-gray-900">
            {toDateOption === "Custom Date" ? customToDate : toDateOption}
          </Text>
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
                  fromDateOption === opt
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => handleSelectFromOption(opt)}
              >
                <Text
                  className={`font-semibold text-base ${
                    fromDateOption === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {fromDateOption === opt && (
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
                  toDateOption === opt
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => handleSelectToOption(opt)}
              >
                <Text
                  className={`font-semibold text-base ${
                    toDateOption === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
                {toDateOption === opt && (
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

      {/* Calendar Modal for Custom Date */}
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
