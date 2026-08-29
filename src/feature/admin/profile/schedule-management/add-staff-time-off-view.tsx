import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useGetShopBarbersQuery,
  useUpdateBarberScheduleMutation,
} from "@/Redux/feature/dashboard";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface AddStaffTimeOffViewProps {
  onBack: () => void;
  onSave?: (data: any) => void;
}

const MOCK_REASON_OPTIONS = [
  "Personal appointment",
  "Annual leave",
  "Vacation",
  "Sick leave",
  "Personal leave",
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

const TIME_OPTIONS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function convertTo24Hour(timeStr: string): string {
  if (!timeStr) return "09:00:00";
  const trimmed = timeStr.trim().toLowerCase();
  const isPm = trimmed.includes("pm");
  const isAm = trimmed.includes("am");
  const clean = trimmed.replace(/(am|pm)/g, "").trim();
  const parts = clean.split(":");
  if (parts.length === 0 || !parts[0]) return "09:00:00";

  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1] || "0", 10) || 0;

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");

  return `${hStr}:${mStr}:00`;
}

export function AddStaffTimeOffView({
  onBack,
  onSave,
}: AddStaffTimeOffViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 7;

  // 📡 GET /v1/barbers/?shop_id={shopId}
  const { data: barbersResponse } = useGetShopBarbersQuery(shopId);
  const barbersList = useMemo(() => {
    if (Array.isArray(barbersResponse?.data)) {
      return barbersResponse.data;
    }
    return [
      { id: 8, name: "Arif Hossain" },
      { id: 9, name: "Nabil Hasan" },
    ];
  }, [barbersResponse]);

  // 📡 PUT /v1/schedule/barber-schedule/
  const [updateBarberSchedule, { isLoading: isCreating }] =
    useUpdateBarberScheduleMutation();

  // Form State
  const [selectedBarberId, setSelectedBarberId] = useState<number | string>(
    barbersList[0]?.id || 8,
  );
  const [selectedStaffName, setSelectedStaffName] =
    useState<string>("staff meber");
  const [selectedReason, setSelectedReason] = useState<string>("Reason");

  const [isAllDay, setIsAllDay] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const todayStr = useMemo(() => formatDateISO(new Date()), []);

  // Time Range (Partial Day)
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [singleDate, setSingleDate] = useState(todayStr);
  const [repeatTillDate, setRepeatTillDate] = useState(todayStr);

  // Date Range (All Day)
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);

  const [isApproved, setIsApproved] = useState(false);

  // Pickers Modal States
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<
    "single" | "repeatTill" | "start" | "end"
  >("single");
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(
    new Date().getMonth(),
  );

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleOpenCalendar = (
    target: "single" | "repeatTill" | "start" | "end",
  ) => {
    setCalendarTarget(target);
    setIsCalendarOpen(true);
  };

  const handleSave = async () => {
    setFeedbackMessage(null);
    const barberId = Number(selectedBarberId || 8);

    const sDateStr = isAllDay ? startDate : singleDate;
    const eDateStr = isAllDay
      ? endDate
      : isRepeat
        ? repeatTillDate
        : singleDate;

    const payload = {
      barber: barberId,
      date: sDateStr,
      shift: {
        start_time: "09:00:00",
        end_time: "19:00:00",
        is_off: false,
      },
      breaks: [
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
      ],
      time_off: [
        {
          start_date: sDateStr,
          end_date: eDateStr,
          is_full_day: isAllDay,
          start_time: isAllDay ? undefined : convertTo24Hour(startTime),
          end_time: isAllDay ? undefined : convertTo24Hour(endTime),
          reason:
            selectedReason !== "Reason"
              ? selectedReason
              : "Personal appointment",
        },
      ],
    };

    try {
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
        text: res.details || "Time off created successfully.",
      });

      onSave?.(payload);

      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
      console.log(
        "❌ Error Response PUT /api/v1/schedule/barber-schedule/:",
        JSON.stringify(err, null, 2),
      );
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to create time off.";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
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
          Add staff member time off
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

      {/* Form Content */}
      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Member Picker Field */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Staff Member
          </Text>
          <Pressable
            className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
            onPress={() => setIsStaffPickerOpen(true)}
          >
            <Text className="font-semibold text-sm text-gray-900">
              {selectedStaffName}
            </Text>
            <StyledIcons
              className="text-gray-500"
              name="chevron-down"
              size={18}
            />
          </Pressable>
        </View>

        {/* Reason Picker Field */}
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
                selectedReason === "Reason" ? "text-gray-400" : "text-gray-900"
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

        {/* All Day Checkbox */}
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
              <StyledIcons className="text-white" name="checkmark" size={16} />
            )}
          </View>
          <Text className="font-semibold text-base text-gray-900">All day</Text>
        </Pressable>

        {/* Thin Divider */}
        <View className="mb-5 h-px w-full bg-gray-100" />

        {/* Dynamic Section based on All Day Toggle */}
        {!isAllDay ? (
          <>
            {/* PARTIAL DAY */}
            {/* Start time & End time row */}
            <View className="flex-row items-center justify-between gap-3 mb-4">
              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Start time
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsStartTimePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {startTime}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={18}
                  />
                </Pressable>
              </View>

              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  End time
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsEndTimePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {endTime}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={18}
                  />
                </Pressable>
              </View>
            </View>

            {/* Date row - Opens Calendar Modal Directly */}
            <View className="mb-5">
              <Text className="mb-1.5 font-medium text-sm text-gray-700">
                Date
              </Text>
              <Pressable
                className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                onPress={() => handleOpenCalendar("single")}
              >
                <Text className="font-semibold text-sm text-gray-900">
                  {singleDate}
                </Text>
                <StyledIcons
                  className="text-gray-500"
                  name="calendar"
                  size={18}
                />
              </Pressable>
            </View>

            {/* Repeat Checkbox */}
            <Pressable
              className="mb-4 flex-row items-center gap-3 active:opacity-80"
              onPress={() => setIsRepeat(!isRepeat)}
            >
              <View
                className={`h-6 w-6 items-center justify-center rounded-md ${
                  isRepeat ? "bg-black" : "border border-gray-300 bg-white"
                }`}
              >
                {isRepeat && (
                  <StyledIcons
                    className="text-white"
                    name="checkmark"
                    size={16}
                  />
                )}
              </View>
              <Text className="font-semibold text-base text-gray-900">
                Repeat
              </Text>
            </Pressable>

            {/* Repeat Each day till - Opens Calendar Modal Directly */}
            {isRepeat && (
              <View className="mb-5">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Repeat Each day till
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => handleOpenCalendar("repeatTill")}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {repeatTillDate}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="calendar"
                    size={18}
                  />
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            {/* ALL DAY */}
            <View className="flex-row items-center justify-between gap-3 mb-5">
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
          </>
        )}
      </ScrollView>

      {/* Bottom Section: Approved Checkbox & Save Button */}
      <View className="border-t border-gray-100 bg-white px-6 pt-4 pb-8">
        {/* Approved Checkbox Row */}
        <Pressable
          className="mb-5 flex-row items-start gap-3 active:opacity-80"
          onPress={() => setIsApproved(!isApproved)}
        >
          <View
            className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md ${
              isApproved ? "bg-black" : "border border-gray-300 bg-white"
            }`}
          >
            {isApproved && (
              <StyledIcons className="text-white" name="checkmark" size={16} />
            )}
          </View>

          <View className="flex-1">
            <Text className="font-bold text-base text-gray-900">Approved</Text>
            <Text className="font-medium text-xs text-gray-400 mt-0.5 leading-4">
              If you select this checkbox, the time will be include in staff
              member working time
            </Text>
          </View>
        </Pressable>

        {/* Save Button */}
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          disabled={isCreating}
          onPress={handleSave}
        >
          {isCreating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="font-bold text-base text-white">Save</Text>
          )}
        </Pressable>
      </View>

      {/* Staff Member Picker Modal */}
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
            {barbersList.map((item: any) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  String(selectedBarberId) === String(item.id)
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={item.id}
                onPress={() => {
                  setSelectedBarberId(item.id);
                  setSelectedStaffName(item.name || "Staff");
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    String(selectedBarberId) === String(item.id)
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {item.name}
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
            {MOCK_REASON_OPTIONS.map((reason) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedReason === reason
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={reason}
                onPress={() => {
                  setSelectedReason(reason);
                  setIsReasonPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedReason === reason
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Start Time Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStartTimePickerOpen(false)}
        transparent
        visible={isStartTimePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm max-h-[60%] rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Start Time
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TIME_OPTIONS.map((t) => (
                <Pressable
                  className={`py-3 px-4 mb-1 rounded-xl flex-row items-center justify-between ${
                    startTime === t ? "bg-amber-500/10" : "active:bg-gray-100"
                  }`}
                  key={t}
                  onPress={() => {
                    setStartTime(t);
                    setIsStartTimePickerOpen(false);
                  }}
                >
                  <Text
                    className={`font-semibold text-base ${
                      startTime === t
                        ? "text-[#FF9500] font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* End Time Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsEndTimePickerOpen(false)}
        transparent
        visible={isEndTimePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm max-h-[60%] rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select End Time
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TIME_OPTIONS.map((t) => (
                <Pressable
                  className={`py-3 px-4 mb-1 rounded-xl flex-row items-center justify-between ${
                    endTime === t ? "bg-amber-500/10" : "active:bg-gray-100"
                  }`}
                  key={t}
                  onPress={() => {
                    setEndTime(t);
                    setIsEndTimePickerOpen(false);
                  }}
                >
                  <Text
                    className={`font-semibold text-base ${
                      endTime === t
                        ? "text-[#FF9500] font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
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
                  calendarTarget === "single"
                    ? singleDate
                    : calendarTarget === "repeatTill"
                      ? repeatTillDate
                      : calendarTarget === "start"
                        ? startDate
                        : endDate;

                const isSelected = currentSelected === dateStr;

                return (
                  <Pressable
                    className="w-[14.28%] items-center justify-center py-2.5"
                    key={`day-${dayNum}`}
                    onPress={() => {
                      if (calendarTarget === "single") setSingleDate(dateStr);
                      if (calendarTarget === "repeatTill")
                        setRepeatTillDate(dateStr);
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
    </KeyboardAvoidingView>
  );
}
