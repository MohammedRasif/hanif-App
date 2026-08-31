import triggerIcon from "@/assets/calender-trigger.png";
import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useCreateStaffTimeOffMutation,
  useGetOpeningCalendarQuery,
} from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
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
  avatarUrl?: string | null;
  end_date?: string;
  id: string | number;
  name: string;
  reason?: string;
  role?: string;
  start_date?: string;
  subtitle?: string;
  timeOffRecords?: Array<{
    date: string;
    end_date?: string;
    id: string;
    reason: string;
    start_date?: string;
  }>;
}

interface StaffTimeOffViewProps {
  liveTimeOff?: any[] | null;
  onAddNewTimeOff?: () => void;
  onBack: () => void;
  onSelectStaff?: (item: StaffTimeOffItem) => void;
  onSelectTimeOff?: (item: StaffTimeOffItem) => void;
  selectedDate?: string;
}

const MOCK_REASON_OPTIONS = [
  "Personal appointment",
  "Sick day",
  "Vacation",
  "Personal emergency",
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

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function StaffTimeOffView({
  onBack,
  onAddNewTimeOff,
  onSelectStaff,
  onSelectTimeOff,
  liveTimeOff,
  selectedDate,
}: StaffTimeOffViewProps) {
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 9;

  const todayStr = useMemo(() => formatDateISO(new Date()), []);
  const targetDateStr = selectedDate || todayStr;

  // 📡 Query opening calendar API: GET /v1/schedule/opening-calendar/?shop={shopId}&date={targetDateStr}
  const { data: calendarResponse, isLoading } = useGetOpeningCalendarQuery(
    { shop: shopId, date: targetDateStr },
    { refetchOnMountOrArgChange: true },
  );

  const [createStaffTimeOff, { isLoading: isCreating }] =
    useCreateStaffTimeOffMutation();

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const timeOffList = useMemo<StaffTimeOffItem[]>(() => {
    const rawList = calendarResponse?.data?.staff_time_off || liveTimeOff || [];
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item: any, idx: number) => {
        const staff = item.staff || {};
        const staffName = staff.name || `Staff ${idx + 1}`;
        const staffRole = staff.role || "barber";
        const reasonStr = item.reason || "Personal appointment";
        const startDate = item.start_date || targetDateStr;
        const endDate = item.end_date || targetDateStr;
        const dateSub =
          startDate === endDate ? startDate : `${startDate} - ${endDate}`;

        return {
          id: staff.id || idx + 1,
          name: staffName,
          role: staffRole,
          subtitle: staffRole,
          reason: reasonStr,
          avatarUrl: staff.image || null,
          start_date: startDate,
          end_date: endDate,
          timeOffRecords: [
            {
              id: `${staff.id}-${startDate}-${idx}`,
              reason: reasonStr,
              date: dateSub,
              start_date: startDate,
              end_date: endDate,
            },
          ],
        };
      });
    }
    return [];
  }, [calendarResponse, liveTimeOff, targetDateStr]);

  const availableBarbers = useMemo(() => {
    const list: Array<{ id: number | string; name: string }> = [];
    const addedIds = new Set();

    if (Array.isArray(calendarResponse?.data?.staff_shifts)) {
      calendarResponse.data.staff_shifts.forEach((s: any) => {
        if (s.staff?.id && !addedIds.has(s.staff.id)) {
          addedIds.add(s.staff.id);
          list.push({ id: s.staff.id, name: s.staff.name });
        }
      });
    }

    if (Array.isArray(calendarResponse?.data?.staff_time_off)) {
      calendarResponse.data.staff_time_off.forEach((t: any) => {
        if (t.staff?.id && !addedIds.has(t.staff.id)) {
          addedIds.add(t.staff.id);
          list.push({ id: t.staff.id, name: t.staff.name });
        }
      });
    }

    if (list.length === 0) {
      return [
        { id: 14, name: "Rasif" },
        { id: 13, name: "Passa" },
        { id: 12, name: "Test Barber" },
      ];
    }

    return list;
  }, [calendarResponse]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states for Add Time Off
  const [selectedStaff, setSelectedStaff] = useState<string>(
    availableBarbers[0]?.name || "Passa",
  );
  const [selectedBarberId, setSelectedBarberId] = useState<number | string>(
    availableBarbers[0]?.id || 13,
  );

  React.useEffect(() => {
    if (
      availableBarbers.length > 0 &&
      availableBarbers[0] &&
      !selectedBarberId
    ) {
      setSelectedBarberId(availableBarbers[0].id);
      setSelectedStaff(availableBarbers[0].name);
    }
  }, [availableBarbers, selectedBarberId]);

  const [selectedReason, setSelectedReason] = useState("Reason");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [isApproved, setIsApproved] = useState(false);

  // Pickers modal states
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [isReasonPickerOpen, setIsReasonPickerOpen] = useState(false);

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<"start" | "end">(
    "start",
  );
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonthIndex, setCalendarMonthIndex] = useState(
    new Date().getMonth(),
  );

  const handleOpenCalendar = (target: "start" | "end") => {
    setCalendarTarget(target);
    setIsCalendarOpen(true);
  };

  const handleRowClick = (item: StaffTimeOffItem) => {
    if (onSelectStaff) {
      onSelectStaff(item);
    } else if (onSelectTimeOff) {
      onSelectTimeOff(item);
    }
  };

  const handleFabClick = () => {
    if (onAddNewTimeOff) {
      onAddNewTimeOff();
    } else {
      setSelectedReason("Reason");
      setStartDate(todayStr);
      setEndDate(todayStr);
      setIsAllDay(true);
      setFeedbackMessage(null);
      setIsModalOpen(true);
    }
  };

  const handleSaveModal = async () => {
    setFeedbackMessage(null);
    try {
      const payload = {
        barber: Number(selectedBarberId),
        start_date: startDate,
        end_date: endDate,
        is_full_day: isAllDay,
        reason:
          selectedReason !== "Reason" ? selectedReason : "Personal appointment",
      };

      const res = await createStaffTimeOff(payload).unwrap();

      setFeedbackMessage({
        type: "success",
        text: res.details || "Staff member time off added successfully.",
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      const errorText =
        err?.data?.details ||
        err?.data?.message ||
        "Failed to create staff time off.";
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
          Staff member time off
        </Text>

        <View className="w-10" />
      </View>

      {/* Main List */}
      <View className="flex-1 px-6 pt-2">
        {isLoading ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator color="#FF9500" size="large" />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={timeOffList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ListEmptyComponent={
              <View className="py-16 items-center justify-center">
                <Text className="font-medium text-sm text-gray-400">
                  No staff member time off found
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
                onPress={() => handleRowClick(item)}
              >
                {/* Left Side: Avatar + Name + Subtitle/Role */}
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
                      {item.role || item.subtitle || "barber"}
                    </Text>
                  </View>
                </View>

                {/* Right Side: Chevron */}
                <StyledIcons
                  className="text-gray-900"
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-xl active:scale-95 overflow-hidden z-50"
        onPress={handleFabClick}
      >
        <Image
          contentFit="contain"
          source={triggerIcon}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>

      {/* Edit/Add Time Off Modal */}
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

              {/* Modal Header Title */}
              <Text className="font-bold text-2xl text-gray-900 mb-4">
                Staff member time off
              </Text>

              {/* Staff Member Field */}
              <View className="mb-4">
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Staff Member
                </Text>
                <Pressable
                  className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
                  onPress={() => setIsStaffPickerOpen(true)}
                >
                  <Text className="font-semibold text-sm text-gray-900">
                    {selectedStaff}
                  </Text>
                  <StyledIcons
                    className="text-gray-500"
                    name="chevron-down"
                    size={18}
                  />
                </Pressable>
              </View>

              {/* Reason Field */}
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
                      selectedReason === "Reason"
                        ? "text-gray-400"
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
              </View>

              {/* All Day Checkbox Row */}
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

              {/* Date Range Section */}
              <View className="mb-5 flex-row items-center justify-between gap-3">
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

              {/* Save Button */}
              <Pressable
                className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
                disabled={isCreating}
                onPress={handleSaveModal}
              >
                {isCreating ? (
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
            {availableBarbers.map((b) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedBarberId === b.id
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={b.id}
                onPress={() => {
                  setSelectedStaff(b.name);
                  setSelectedBarberId(b.id);
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
                  {b.name}
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
            {MOCK_REASON_OPTIONS.map((r) => (
              <Pressable
                className={`py-3 px-4 mb-1.5 rounded-xl flex-row items-center justify-between ${
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
              </Pressable>
            ))}
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
                  calendarTarget === "start" ? startDate : endDate;

                const isSelected = currentSelected === dateStr;

                return (
                  <Pressable
                    className="w-[14.28%] items-center justify-center py-2.5"
                    key={`day-${dayNum}`}
                    onPress={() => {
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
    </View>
  );
}
