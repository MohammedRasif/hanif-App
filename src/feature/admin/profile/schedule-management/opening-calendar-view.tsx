import triggerIcon from "@/assets/calender-trigger.png";
import { getUserData } from "@/lib/storage";
import { StyledIcons } from "@/lib";
import { useGetOpeningCalendarQuery } from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface OpeningCalendarViewProps {
  onBack: () => void;
  onNavigateToAddBusinessDaysOff?: () => void;
  onNavigateToAddStaffTimeOff?: () => void;
  onNavigateToBusinessHours?: (dateStr?: string) => void;
  onNavigateToShift?: (shiftsData?: any[]) => void;
  onNavigateToTimeOff?: (timeOffData?: any[]) => void;
}

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
  onNavigateToBusinessHours,
  onNavigateToAddBusinessDaysOff,
  onNavigateToAddStaffTimeOff,
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

  // 📡 GET /api/v1/schedule/opening-calendar/?shop={shopId}&date={selectedDateStr}
  const { data: calendarResponse, isLoading } = useGetOpeningCalendarQuery(
    { shop: shopId, date: selectedDateStr },
    { refetchOnMountOrArgChange: true },
  );

  const calendarData = calendarResponse?.data;
  const shopHours = calendarData?.shop_hours;
  const staffShifts = calendarData?.staff_shifts || [];
  const staffTimeOff = calendarData?.staff_time_off || [];

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

        {/* Selected Day Info Card */}
        <Pressable
          className="mb-6 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
          onPress={() => onNavigateToBusinessHours?.(selectedDateStr)}
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
          onPress={() => onNavigateToShift?.(staffShifts)}
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
          onPress={() => onNavigateToTimeOff?.(staffTimeOff)}
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
