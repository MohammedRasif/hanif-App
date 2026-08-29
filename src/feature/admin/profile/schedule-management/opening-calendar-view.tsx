import triggerIcon from "@/assets/calender-trigger.png";
import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useGetOpeningCalendarQuery,
  useUpdateBusinessHoursDateMutation,
} from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
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

interface OpeningCalendarViewProps {
  onBack: () => void;
  onNavigateToAddBusinessDaysOff?: () => void;
  onNavigateToAddStaffTimeOff?: () => void;
  onNavigateToBusinessHours?: (dateStr?: string) => void;
  onNavigateToShift?: (shiftsData?: any[], dateStr?: string) => void;
  onNavigateToTimeOff?: (timeOffData?: any[], dateStr?: string) => void;
  selectedDate?: string;
  onDateChange?: (dateStr: string) => void;
}

const VALID_TIME_OPTIONS = [
  "08:00 am",
  "08:30 am",
  "09:00 am",
  "09:30 am",
  "10:00 am",
  "10:30 am",
  "10:50 am",
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
];

// Helper to format time (e.g. "10:00:00" -> "10:00 am", "18:00:00" -> "06:00 pm")
function formatDisplayTime(timeStr?: string) {
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

export function OpeningCalendarView({
  onBack,
  onNavigateToTimeOff,
  onNavigateToShift,
  onNavigateToBusinessHours: _onNavigateToBusinessHours,
  onNavigateToAddBusinessDaysOff,
  onNavigateToAddStaffTimeOff,
  onDateChange,
}: OpeningCalendarViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 7;

  // Active date selection state (defaults to today's date)
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  // Formatted date string for API query: YYYY-MM-DD
  const selectedDateStr = useMemo(() => {
    const y = currentYear;
    const m = String(currentMonthIndex + 1).padStart(2, "0");
    const d = String(selectedDay).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [currentYear, currentMonthIndex, selectedDay]);

  React.useEffect(() => {
    onDateChange?.(selectedDateStr);
  }, [selectedDateStr, onDateChange]);

  // 📡 GET /api/v1/schedule/opening-calendar/?shop={shopId}&date={selectedDateStr}
  const { data: calendarResponse, isLoading } = useGetOpeningCalendarQuery(
    { shop: shopId, date: selectedDateStr },
    { refetchOnMountOrArgChange: true },
  );

  const [updateBusinessHoursDate, { isLoading: isUpdatingBusinessHours }] =
    useUpdateBusinessHoursDateMutation();

  const calendarData = calendarResponse?.data;
  const shopHours = calendarData?.shop_hours;
  const staffShifts = calendarData?.staff_shifts || [];
  const staffTimeOff = calendarData?.staff_time_off || [];

  // Edit Business Hours Modal State
  const [isBusinessHoursModalOpen, setIsBusinessHoursModalOpen] =
    useState(false);
  const [isClosedToggle, setIsClosedToggle] = useState(true); // true = open (is_closed: false)
  const [modalOpenTime, setModalOpenTime] = useState("10:50 am");
  const [modalCloseTime, setModalCloseTime] = useState("05:30 pm");
  const [hasModalBreak, setHasModalBreak] = useState(false);
  const [modalBreakStartTime, setModalBreakStartTime] = useState("01:00 pm");
  const [modalBreakEndTime, setModalBreakEndTime] = useState("01:30 pm");
  const [timePickerTarget, setTimePickerTarget] = useState<
    "open" | "close" | "breakStart" | "breakEnd" | null
  >(null);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleOpenBusinessHoursModal = () => {
    setFeedbackMessage(null);
    if (shopHours) {
      setIsClosedToggle(!shopHours.is_closed);
      setModalOpenTime(formatDisplayTime(shopHours.open_time) || "10:50 am");
      setModalCloseTime(formatDisplayTime(shopHours.close_time) || "05:30 pm");
      if (Array.isArray(shopHours.breaks) && shopHours.breaks.length > 0) {
        setHasModalBreak(true);
        const firstBreak = shopHours.breaks[0];
        setModalBreakStartTime(
          formatDisplayTime(firstBreak?.start_time) || "01:00 pm",
        );
        setModalBreakEndTime(
          formatDisplayTime(firstBreak?.end_time) || "01:30 pm",
        );
      } else {
        setHasModalBreak(false);
      }
    } else {
      setIsClosedToggle(true);
      setModalOpenTime("10:50 am");
      setModalCloseTime("05:30 pm");
      setHasModalBreak(false);
    }
    setIsBusinessHoursModalOpen(true);
  };

  const handleSaveBusinessHoursModal = async () => {
    setFeedbackMessage(null);
    const convertTo24H = (tStr: string) => {
      if (!tStr) return "10:00:00";
      const trimmed = tStr.trim().toLowerCase();
      const isPm = trimmed.includes("pm");
      const isAm = trimmed.includes("am");
      const clean = trimmed.replace(/(am|pm)/g, "").trim();
      const parts = clean.split(":");
      let hours = parseInt(parts[0] || "10", 10);
      const minutes = parseInt(parts[1] || "0", 10);
      if (isPm && hours < 12) hours += 12;
      if (isAm && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:00`;
    };

    const payload = {
      shopId,
      date: selectedDateStr,
      open_time: convertTo24H(modalOpenTime),
      close_time: convertTo24H(modalCloseTime),
      is_closed: !isClosedToggle,
      breaks: hasModalBreak
        ? [
            {
              start_time: convertTo24H(modalBreakStartTime),
              end_time: convertTo24H(modalBreakEndTime),
            },
          ]
        : [],
    };

    try {
      console.log(
        "▶️ Hitting PUT /api/v1/schedule/business-hours/" +
          shopId +
          "/date/ Payload:",
        JSON.stringify(payload, null, 2),
      );
      const res = await updateBusinessHoursDate(payload).unwrap();
      console.log(
        "✅ Success Response PUT /api/v1/schedule/business-hours/:",
        JSON.stringify(res, null, 2),
      );
      setFeedbackMessage({
        type: "success",
        text: res.details || "Business hours updated successfully.",
      });
      setTimeout(() => {
        setIsBusinessHoursModalOpen(false);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      console.log(
        "❌ Error Response PUT /api/v1/schedule/business-hours/:",
        JSON.stringify(err, null, 2),
      );
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to update business hours.";
      setFeedbackMessage({ type: "error", text: errorText });
    }
  };

  // Month Display Name
  const monthName = useMemo(() => {
    const d = new Date(currentYear, currentMonthIndex, 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentYear, currentMonthIndex]);

  // Check if selected date is Today
  const isSelectedToday = useMemo(() => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonthIndex &&
      today.getDate() === selectedDay
    );
  }, [today, currentYear, currentMonthIndex, selectedDay]);

  // Selected Day Weekday label (e.g. "Thu", "Sun")
  const selectedDayLabel = useMemo(() => {
    const d = new Date(currentYear, currentMonthIndex, selectedDay);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }, [currentYear, currentMonthIndex, selectedDay]);

  // Dynamic Opening Hours text
  const openingHoursText = useMemo(() => {
    if (!shopHours) {
      return "09:00 am – 05:30 pm";
    }
    if (shopHours.is_closed) {
      return "Closed";
    }
    const openStr = formatDisplayTime(shopHours.open_time) || "09:00 am";
    const closeStr = formatDisplayTime(shopHours.close_time) || "06:00 pm";
    return `${openStr} – ${closeStr}`;
  }, [shopHours]);

  // Calendar Grid Rows calculation
  const calendarRows = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0,
    ).getDate();
    const daysInPrevMonth = new Date(
      currentYear,
      currentMonthIndex,
      0,
    ).getDate();

    const cells: { day: number; isCurrentMonth: boolean }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, isCurrentMonth: true });
    }

    // Next month filler days to complete 35 cells (5 rows) or 42 cells (6 rows)
    const totalNeeded = cells.length > 35 ? 42 : 35;
    let nextDay = 1;
    while (cells.length < totalNeeded) {
      cells.push({ day: nextDay++, isCurrentMonth: false });
    }

    // Split into 7-day rows
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [currentYear, currentMonthIndex]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
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
          Opening calendar
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Card */}
        <View className="mb-4 rounded-3xl bg-[#F8F9FA] p-5">
          {/* Month Switcher Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/90 active:bg-gray-200"
              onPress={handlePrevMonth}
            >
              <StyledIcons
                className="text-gray-700"
                name="chevron-back"
                size={18}
              />
            </Pressable>

            <Text className="font-bold text-lg text-gray-900">{monthName}</Text>

            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/90 active:bg-gray-200"
              onPress={handleNextMonth}
            >
              <StyledIcons
                className="text-gray-700"
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          </View>

          {/* Weekday Labels */}
          <View className="mb-3 flex-row justify-between">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text
                className="w-10 text-center font-medium text-xs text-gray-400"
                key={day}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View className="gap-2">
            {calendarRows.map((row, rIdx) => (
              <View className="flex-row justify-between" key={rIdx}>
                {row.map((cell, cIdx) => {
                  const isSelected =
                    cell.isCurrentMonth && cell.day === selectedDay;

                  return (
                    <Pressable
                      className={`h-10 w-10 items-center justify-center rounded-2xl ${
                        isSelected
                          ? "bg-black shadow-xs"
                          : "active:bg-gray-200/60"
                      }`}
                      key={cIdx}
                      onPress={() => {
                        if (cell.isCurrentMonth) {
                          setSelectedDay(cell.day);
                        }
                      }}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "font-bold text-white"
                            : !cell.isCurrentMonth
                              ? "font-normal text-gray-300"
                              : "font-medium text-gray-900"
                        }`}
                      >
                        {cell.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Loading Spinner */}
        {isLoading && (
          <View className="py-2 items-center justify-center mb-3">
            <ActivityIndicator color="#FF9500" size="small" />
          </View>
        )}

        {/* Selected Day Info Card - Opens Edit Popup Modal */}
        <Pressable
          className="mb-6 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={handleOpenBusinessHoursModal}
        >
          <View>
            <Text className="font-bold text-base text-gray-900">
              {selectedDayLabel}
            </Text>
            <Text className="font-medium text-xs text-gray-400 mt-0.5">
              {isSelectedToday ? "Today" : selectedDateStr}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-sm text-gray-900">
              {openingHoursText}
            </Text>
            <StyledIcons
              className="text-gray-900"
              name="chevron-forward"
              size={18}
            />
          </View>
        </Pressable>

        {/* Section: Staff Management */}
        <Text className="font-bold text-lg text-gray-900 mb-3">
          Staff management
        </Text>

        {/* Shift Card */}
        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={() => onNavigateToShift?.(staffShifts, selectedDateStr)}
        >
          <Text className="font-bold text-base text-gray-900">
            Shift {staffShifts.length > 0 ? `(${staffShifts.length})` : ""}
          </Text>
          <StyledIcons
            className="text-gray-900"
            name="chevron-forward"
            size={18}
          />
        </Pressable>

        {/* Time off Card */}
        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={() => onNavigateToTimeOff?.(staffTimeOff, selectedDateStr)}
        >
          <Text className="font-bold text-base text-gray-900">
            Time off{" "}
            {staffTimeOff.length > 0 ? `(${staffTimeOff.length})` : "(0)"}
          </Text>
          <StyledIcons
            className="text-gray-900"
            name="chevron-forward"
            size={18}
          />
        </Pressable>
      </ScrollView>

      {/* Edit Business Hours Popup Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsBusinessHoursModalOpen(false)}
        transparent
        visible={isBusinessHoursModalOpen}
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
                <Text className="font-bold text-2xl text-gray-900">
                  {isSelectedToday ? "Today" : selectedDayLabel}
                </Text>

                <View className="items-center">
                  <Switch
                    ios_backgroundColor="#e5e7eb"
                    onValueChange={setIsClosedToggle}
                    thumbColor="#ffffff"
                    trackColor={{ false: "#d1d5db", true: "#10B981" }}
                    value={isClosedToggle}
                  />
                  <Text className="font-medium text-xs text-gray-500 mt-1 text-center">
                    Enable
                  </Text>
                </View>
              </View>

              {/* Time Range Row: [10:50 am] to [05:30 pm] */}
              <View className="mt-4 flex-row items-center justify-between gap-2.5">
                <Pressable
                  className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setTimePickerTarget("open")}
                >
                  <Text className="text-center font-semibold text-sm text-gray-900">
                    {modalOpenTime}
                  </Text>
                </Pressable>

                <Text className="font-medium text-sm text-gray-600 px-1">
                  to
                </Text>

                <Pressable
                  className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                  onPress={() => setTimePickerTarget("close")}
                >
                  <Text className="text-center font-semibold text-sm text-gray-900">
                    {modalCloseTime}
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
                    onPress={() => setHasModalBreak(!hasModalBreak)}
                  >
                    <StyledIcons
                      className="text-gray-900"
                      name={hasModalBreak ? "remove" : "add"}
                      size={20}
                    />
                    <Text className="font-bold text-sm text-gray-900">
                      Add break
                    </Text>
                  </Pressable>

                  {hasModalBreak && (
                    <View className="mt-3 flex-row items-center justify-between gap-2.5">
                      <Pressable
                        className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
                        onPress={() => setTimePickerTarget("breakStart")}
                      >
                        <Text className="text-center font-semibold text-sm text-gray-900">
                          {modalBreakStartTime}
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
                          {modalBreakEndTime}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              {/* Save Action Button */}
              <Pressable
                className="mt-6 h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
                disabled={isUpdatingBusinessHours}
                onPress={handleSaveBusinessHoursModal}
              >
                {isUpdatingBusinessHours ? (
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
                    if (timePickerTarget === "open") setModalOpenTime(t);
                    if (timePickerTarget === "close") setModalCloseTime(t);
                    if (timePickerTarget === "breakStart")
                      setModalBreakStartTime(t);
                    if (timePickerTarget === "breakEnd")
                      setModalBreakEndTime(t);
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

      {/* Backdrop overlay to dismiss speed dial when open */}
      {isSpeedDialOpen && (
        <Pressable
          className="absolute inset-0 z-40 bg-black/10"
          onPress={() => setIsSpeedDialOpen(false)}
        />
      )}

      {/* Floating Action Menu Container */}
      <View className="absolute bottom-8 right-6 items-end z-50">
        {/* Speed Dial Menu Items */}
        {isSpeedDialOpen && (
          <View className="items-end mb-3 gap-2.5">
            {/* Option 1: Add business full days off */}
            <Pressable
              className="active:scale-95"
              onPress={() => {
                setIsSpeedDialOpen(false);
                onNavigateToAddBusinessDaysOff?.();
              }}
            >
              <View className="rounded-full bg-black px-5 py-3 shadow-xl">
                <Text className="font-bold text-sm text-white">
                  Add business full days off
                </Text>
              </View>
            </Pressable>

            {/* Option 2: Add staff member time off */}
            <Pressable
              className="active:scale-95"
              onPress={() => {
                setIsSpeedDialOpen(false);
                onNavigateToAddStaffTimeOff?.();
              }}
            >
              <View className="rounded-full bg-black px-5 py-3 shadow-xl">
                <Text className="font-bold text-sm text-white">
                  Add staff member time off
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Floating Action Button (FAB) */}
        <Pressable
          className="h-14 w-14 items-center justify-center rounded-full bg-black shadow-xl active:scale-95 overflow-hidden"
          onPress={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
        >
          {isSpeedDialOpen ? (
            <StyledIcons className="text-white" name="close" size={26} />
          ) : (
            <Image
              contentFit="contain"
              source={triggerIcon}
              style={{ width: 30, height: 30 }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
