import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useCreateStaffTimeOffMutation,
  useGetShopBarbersQuery,
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

const DATE_OPTIONS = [
  "Today",
  "Tomorrow",
  "This Weekend",
  "Next Monday",
  "Custom Date",
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

function parseOptionToDate(option: string): Date {
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
  return today;
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

  // 📡 POST /api/v1/schedule/time-off/
  const [createStaffTimeOff, { isLoading: isCreating }] =
    useCreateStaffTimeOffMutation();

  // Form State
  const [selectedBarberId, setSelectedBarberId] = useState<number | string>(
    barbersList[0]?.id || 8,
  );
  const [selectedStaffName, setSelectedStaffName] =
    useState<string>("staff meber");
  const [selectedReason, setSelectedReason] = useState<string>("Reason");

  const [isAllDay, setIsAllDay] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Time Range (Partial Day)
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [singleDate, setSingleDate] = useState("Today");
  const [repeatTillDate, setRepeatTillDate] = useState("Today");

  // Date Range (All Day)
  const [startDate, setStartDate] = useState("Today");
  const [endDate, setEndDate] = useState("Today");

  const [isApproved, setIsApproved] = useState(false);

  // Pickers Modal States
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [isSingleDatePickerOpen, setIsSingleDatePickerOpen] = useState(false);
  const [isRepeatTillPickerOpen, setIsRepeatTillPickerOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setFeedbackMessage(null);
    const barberId = Number(selectedBarberId || 8);

    let payload: any = {};

    if (isAllDay) {
      const sDateObj = parseOptionToDate(startDate);
      const eDateObj = parseOptionToDate(endDate);
      payload = {
        barber: barberId,
        start_date: formatDateISO(sDateObj),
        end_date: formatDateISO(eDateObj),
        is_full_day: true,
        reason: selectedReason !== "Reason" ? selectedReason : "Annual leave",
      };
    } else {
      const sDateObj = parseOptionToDate(singleDate);
      const eDateObj = isRepeat
        ? parseOptionToDate(repeatTillDate)
        : parseOptionToDate(singleDate);

      payload = {
        barber: barberId,
        start_date: formatDateISO(sDateObj),
        end_date: formatDateISO(eDateObj),
        is_full_day: false,
        start_time: convertTo24Hour(startTime),
        end_time: convertTo24Hour(endTime),
        reason:
          selectedReason !== "Reason" ? selectedReason : "Personal appointment",
      };
    }

    try {
      console.log(
        "▶️ Hitting POST /api/v1/schedule/time-off/ Payload:",
        JSON.stringify(payload, null, 2),
      );

      // 📡 POST /api/v1/schedule/time-off/
      const res = await createStaffTimeOff(payload).unwrap();

      console.log(
        "✅ Success Response POST /api/v1/schedule/time-off/:",
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
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to create time off.";
      setFeedbackMessage({ type: "error", text: errorText });
    }
  };

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
          Add time off
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

      {/* Main Form Content */}
      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Staff Member Dropdown */}
        <Pressable
          className="mb-3.5 h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
          onPress={() => setIsStaffPickerOpen(true)}
        >
          <Text
            className={`font-semibold text-sm ${
              selectedStaffName === "staff meber"
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            {selectedStaffName}
          </Text>
          <StyledIcons
            className="text-gray-500"
            name="chevron-down"
            size={18}
          />
        </Pressable>

        {/* 2. Reason Dropdown */}
        <Pressable
          className="mb-5 h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
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

        {/* 3. All Day Checkbox Row */}
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
            {/* PARTIAL DAY (Screenshots 1 & 2) */}
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

            {/* Date row */}
            <View className="mb-5">
              <Text className="mb-1.5 font-medium text-sm text-gray-700">
                Date
              </Text>
              <Pressable
                className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                onPress={() => setIsSingleDatePickerOpen(true)}
              >
                <Text className="font-semibold text-sm text-gray-900">
                  {singleDate}
                </Text>
                <StyledIcons
                  className="text-gray-500"
                  name="chevron-down"
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

            {/* Repeat Each day till Dropdown (Screenshot 2) */}
            {isRepeat && (
              <View className="mb-5">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Repeat Each day till
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsRepeatTillPickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {repeatTillDate}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={18}
                  />
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            {/* ALL DAY (Screenshot 3) */}
            <View className="flex-row items-center justify-between gap-3 mb-5">
              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Start date
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsStartDatePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {startDate}
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
                  End date
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsEndDatePickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {endDate}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
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
            {barbersList.map((b: any) => (
              <Pressable
                className={`py-3.5 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedBarberId === b.id
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={b.id}
                onPress={() => {
                  setSelectedBarberId(b.id);
                  setSelectedStaffName(b.name || `Staff ${b.id}`);
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedBarberId === b.id
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {b.name || `Staff ${b.id}`}
                </Text>
                {selectedBarberId === b.id && (
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

      {/* Start Time Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStartTimePickerOpen(false)}
        transparent
        visible={isStartTimePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Start Time
            </Text>
            {TIME_OPTIONS.map((t) => (
              <Pressable
                className={`py-2.5 px-3 mb-1 rounded-xl flex-row items-center justify-between ${
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
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select End Time
            </Text>
            {TIME_OPTIONS.map((t) => (
              <Pressable
                className={`py-2.5 px-3 mb-1 rounded-xl flex-row items-center justify-between ${
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
                    endTime === t ? "text-[#FF9500] font-bold" : "text-gray-900"
                  }`}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Single Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsSingleDatePickerOpen(false)}
        transparent
        visible={isSingleDatePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Date
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  singleDate === opt ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setSingleDate(opt);
                  setIsSingleDatePickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    singleDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Repeat Till Date Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsRepeatTillPickerOpen(false)}
        transparent
        visible={isRepeatTillPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Repeat Each Day Till
            </Text>
            {DATE_OPTIONS.map((opt) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  repeatTillDate === opt
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={opt}
                onPress={() => {
                  setRepeatTillDate(opt);
                  setIsRepeatTillPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    repeatTillDate === opt
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {opt}
                </Text>
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
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
