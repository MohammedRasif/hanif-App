import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useCreateStaffShiftMutation,
  useGetShopBarbersQuery,
  useGetStaffShiftsQuery,
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

export interface ShiftDisplayItem {
  barber: number | string;
  breakHours?: string;
  day: string;
  day_of_week: string;
  end_time: string;
  hours: string;
  id?: number | string;
  is_active: boolean;
  rawItem?: any;
  start_time: string;
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
  "08:30 pm",
  "09:00 pm",
];

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
  if (!timeStr) return "00:00:00";
  const trimmed = timeStr.trim().toLowerCase();
  const isPm = trimmed.includes("pm");
  const isAm = trimmed.includes("am");
  const clean = trimmed.replace(/(am|pm)/g, "").trim();
  const parts = clean.split(":");
  if (parts.length === 0 || !parts[0]) return "00:00:00";

  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1] || "0", 10) || 0;

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");

  return `${hStr}:${mStr}:00`;
}

interface StaffWorkingHoursViewProps {
  onBack: () => void;
  onSave?: () => void;
}

export function StaffWorkingHoursView({
  onBack,
  onSave,
}: StaffWorkingHoursViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 9;

  // 📡 GET /v1/barbers/?shop={shopId}
  const { data: barbersResponse, isLoading: isLoadingBarbers } =
    useGetShopBarbersQuery(shopId);

  const barbersList = useMemo(() => {
    if (
      Array.isArray(barbersResponse?.data) &&
      barbersResponse.data.length > 0
    ) {
      return barbersResponse.data.map((b: any) => ({
        id: b.id,
        name: b.user_details?.name || b.user_name || `Barber ${b.id}`,
        role: b.specialty || b.role || "Staff",
      }));
    }
    return [
      { id: 13, name: "Passa", role: "Sr. Barber" },
      { id: 14, name: "Rasif", role: "Staff" },
      { id: 12, name: "Test Barber", role: "Senior Barber" },
    ];
  }, [barbersResponse]);

  const [selectedBarberId, setSelectedBarberId] = useState<number | string>(
    barbersList[0]?.id || 13,
  );
  const [selectedStaffName, setSelectedStaffName] = useState<string>(
    barbersList[0]?.name || "Passa",
  );

  React.useEffect(() => {
    if (barbersList.length > 0 && !selectedBarberId && barbersList[0]) {
      setSelectedBarberId(barbersList[0].id);
      setSelectedStaffName(barbersList[0].name);
    }
  }, [barbersList, selectedBarberId]);

  // 📡 GET /v1/schedule/shifts/?barber={selectedBarberId}
  const {
    data: shiftsResponse,
    isLoading: isLoadingShifts,
    isFetching: isFetchingShifts,
    isError: isErrorShifts,
  } = useGetStaffShiftsQuery(selectedBarberId, {
    skip: !selectedBarberId,
    refetchOnMountOrArgChange: true,
  });

  const [createStaffShift, { isLoading: isUpdating }] =
    useCreateStaffShiftMutation();

  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [selectedShiftItem, setSelectedShiftItem] =
    useState<ShiftDisplayItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Shift Modal states
  const [isDayEnabled, setIsDayEnabled] = useState(true);
  const [startTime, setStartTime] = useState("10:50 am");
  const [endTime, setEndTime] = useState("05:30 pm");

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

  const shiftsList = useMemo<ShiftDisplayItem[]>(() => {
    if (
      !isErrorShifts &&
      Array.isArray(shiftsResponse?.data) &&
      shiftsResponse.data.length > 0
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

      const itemsMap = new Map<string, ShiftDisplayItem>();
      shiftsResponse.data.forEach((s: any) => {
        const dayKey = s.day_of_week?.toLowerCase() || "monday";
        const dayCapitalized = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);

        const isClosed =
          !s.is_active ||
          (s.start_time === "00:00:00" && s.end_time === "00:00:00");

        const openFormatted = formatDisplayTime(s.start_time);
        const closeFormatted = formatDisplayTime(s.end_time);

        const hoursText = isClosed
          ? "Closed"
          : `${openFormatted} – ${closeFormatted}`;

        itemsMap.set(dayKey, {
          id: s.id,
          barber: s.barber,
          day: dayCapitalized,
          day_of_week: dayKey,
          start_time: s.start_time,
          end_time: s.end_time,
          is_active: s.is_active,
          hours: hoursText,
          rawItem: s,
        });
      });

      const sortedList: ShiftDisplayItem[] = [];
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
    return [];
  }, [shiftsResponse, isErrorShifts]);

  const handleOpenEditModal = (item: ShiftDisplayItem) => {
    setSelectedShiftItem(item);
    setFeedbackMessage(null);
    setIsDayEnabled(item.is_active);

    if (!item.is_active || item.hours === "Closed") {
      setStartTime("10:50 am");
      setEndTime("05:30 pm");
      setHasBreak(false);
    } else {
      setStartTime(formatDisplayTime(item.start_time) || "10:50 am");
      setEndTime(formatDisplayTime(item.end_time) || "05:30 pm");
      setHasBreak(false);
    }

    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    setFeedbackMessage(null);
    const dayOfWeek = (
      selectedShiftItem?.day_of_week || "saturday"
    ).toLowerCase();

    const openTime24 = isDayEnabled ? convertTo24Hour(startTime) : "00:00:00";
    const closeTime24 = isDayEnabled ? convertTo24Hour(endTime) : "00:00:00";

    try {
      const payload = {
        barber: selectedBarberId,
        day_of_week: dayOfWeek,
        shift_date: null,
        start_time: openTime24,
        end_time: closeTime24,
        is_active: isDayEnabled,
      };

      console.log(
        "▶️ Hitting POST /v1/schedule/shifts/ Payload:",
        JSON.stringify(payload, null, 2),
      );

      const res = await createStaffShift(payload).unwrap();

      setFeedbackMessage({
        type: "success",
        text: res.details || "Shift updated successfully.",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedShiftItem(null);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      const errorText =
        err?.data?.details || err?.data?.message || "Failed to update shift.";
      setFeedbackMessage({ type: "error", text: errorText });
    }
  };

  const handleSave = () => {
    onSave ? onSave() : onBack();
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
          Staff member working hours
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Selector */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Select Staff Member
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

        {/* Section Heading */}
        <Text className="font-bold text-lg text-gray-900 mt-2 mb-2">
          Working Hours
        </Text>

        {/* Schedule Rows */}
        <View className="mb-6">
          {isLoadingShifts || isFetchingShifts || isLoadingBarbers ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator color="#FF9500" size="large" />
            </View>
          ) : shiftsList.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <Text className="font-semibold text-base text-gray-400">
                No data here
              </Text>
            </View>
          ) : (
            shiftsList.map((item, index) => (
              <Pressable
                className="py-4.5 flex-row items-center justify-between border-b border-gray-100/90 active:bg-gray-50/50"
                key={`${item.day}-${index}`}
                onPress={() => handleOpenEditModal(item)}
              >
                {/* Day Name */}
                <Text className="font-bold text-base text-gray-900">
                  {item.day}
                </Text>

                {/* Hours + Chevron */}
                <View className="flex-row items-center gap-3">
                  <View className="items-end">
                    <Text
                      className={`font-semibold text-sm ${
                        item.hours === "Closed"
                          ? "text-gray-400"
                          : "text-gray-900"
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
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View className="px-6 pb-8 pt-3 bg-white border-t border-gray-100">
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          onPress={handleSave}
        >
          <Text className="font-bold text-base text-white">Save</Text>
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
            {barbersList.map((st) => (
              <Pressable
                className={`py-3.5 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedBarberId === st.id
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={st.id}
                onPress={() => {
                  setSelectedBarberId(st.id);
                  setSelectedStaffName(st.name);
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text
                  className={`font-semibold text-base ${
                    selectedBarberId === st.id
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {st.name}
                </Text>
                {selectedBarberId === st.id && (
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
            <View className="w-full rounded-4xl bg-white p-6 shadow-2xl">
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

              {/* Modal Header: Day Name + Switch */}
              <View className="flex-row items-start justify-between">
                <Text className="font-bold text-2xl text-gray-900">
                  {selectedShiftItem?.day || "Saturday"}
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

              {/* Time Range Row: [10:50 am] to [05:30 pm] */}
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

              {/* Save Button */}
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

      {/* Time Options Picker Modal */}
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
