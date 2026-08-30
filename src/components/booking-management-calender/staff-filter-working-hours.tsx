import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { BookingBarber } from "@/Redux/feature/bookingCalendarApi";
import { Image } from "expo-image";
import { Dialog, useToast } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { barberDisplayName } from "./booking-edit-modal";

export interface StaffFilterItem {
  avatar?: string;
  checked: boolean;
  id: string;
  name: string;
  role: string;
}

export interface DayWorkingHour {
  breakEndTime?: string;
  breakStartTime?: string;
  dayName: string;
  enabled: boolean;
  endTime: string;
  hasBreak: boolean;
  id: string;
  startTime: string;
}

const DEFAULT_WORKING_DAYS: DayWorkingHour[] = [
  {
    id: "sat",
    dayName: "Saturday",
    enabled: true,
    startTime: "10:00 am",
    endTime: "05:00 pm",
    hasBreak: true,
    breakStartTime: "02:00 pm",
    breakEndTime: "03:00 pm",
  },
  {
    id: "mon",
    dayName: "Monday",
    enabled: true,
    startTime: "10:00 am",
    endTime: "05:00 pm",
    hasBreak: false,
  },
  {
    id: "thu1",
    dayName: "Thusday",
    enabled: true,
    startTime: "10:00 am",
    endTime: "05:00 pm",
    hasBreak: false,
  },
  {
    id: "thu2",
    dayName: "Thusday",
    enabled: true,
    startTime: "10:00 am",
    endTime: "05:00 pm",
    hasBreak: false,
  },
  {
    id: "thu3",
    dayName: "Thusday",
    enabled: false,
    startTime: "10:00 am",
    endTime: "05:00 pm",
    hasBreak: false,
  },
];

{
  /* 1. Staff Member Filter Bottom Sheet / Dialog (Image 2) */
}
type StaffFilterBottomSheetProps = {
  /** Every barber of the shop, from `GET /v1/barbers/?shop=`. */
  barbers: BookingBarber[];
  isLoading?: boolean;
  isOpen: boolean;
  /** Emits the barber ids whose columns should stay on the calendar. */
  onChangeSelected: (ids: string[]) => void;
  onOpenChange: (open: boolean) => void;
  onSelectStaffHours: (staff: StaffFilterItem) => void;
  selectedIds: string[];
  /** Ids that actually have a column on the active date. */
  workingBarberIds?: string[];
};

export function StaffFilterBottomSheet({
  barbers,
  isLoading = false,
  isOpen,
  onChangeSelected,
  onOpenChange,
  onSelectStaffHours,
  selectedIds,
  workingBarberIds = [],
}: StaffFilterBottomSheetProps) {
  const allIds = useMemo(
    () => barbers.map((barber) => String(barber.id)),
    [barbers],
  );

  // Only staff scheduled for the active date can be narrowed down to
  const workingIds = useMemo(() => {
    const working = new Set(workingBarberIds.map(String));
    return allIds.filter((id) => working.has(id));
  }, [allIds, workingBarberIds]);

  const staffList = useMemo<StaffFilterItem[]>(() => {
    const selected = new Set(selectedIds.map(String));
    return barbers.map((barber) => ({
      avatar: barber.user_details?.image ?? undefined,
      checked: selected.has(String(barber.id)),
      id: String(barber.id),
      name: barberDisplayName(barber),
      role: barber.specialty || barber.role || "Barber",
    }));
  }, [barbers, selectedIds]);

  const selectedCount = staffList.filter((staff) => staff.checked).length;
  const isAllMode = allIds.length > 0 && selectedCount === allIds.length;
  // const isWorkingMode =
  //   !isAllMode &&
  //   workingIds.length > 0 &&
  //   selectedCount === workingIds.length &&
  //   workingIds.every((id) =>
  //     staffList.some((staff) => staff.id === id && staff.checked),
  //   );

  const toggleStaffCheck = (id: string) => {
    const selected = new Set(selectedIds.map(String));
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    // Keep the API order so the columns never reshuffle
    onChangeSelected(allIds.filter((item) => selected.has(item)));
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-full max-w-md rounded-t-4xl bg-white p-6 shadow-2xl self-end mb-0 pb-8">
          {/* Handle bar */}
          <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-gray-200" />

          {/* Top Options: Working staff member vs Select All */}
          <View className="mb-6 gap-3.5 px-1">
            <Pressable
              className="flex-row items-center gap-3"
              onPress={() => onChangeSelected(workingIds)}
            >
              {/* <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  isWorkingMode
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isWorkingMode && (
                  <View className="h-2 w-2 rounded-full bg-white" />
                )}
              </View> */}
              <Text className="font-bold text-base text-gray-900">
                Working staff member
              </Text>
            </Pressable>

            <Pressable
              className="flex-row items-center gap-3"
              onPress={() => onChangeSelected(allIds)}
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded-full border ${
                  isAllMode
                    ? "border-black bg-black"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isAllMode && (
                  <View className="h-2 w-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="font-medium text-base text-gray-700">
                Select All
              </Text>
            </Pressable>
          </View>

          {/* Staff Member List Cards */}
          {isLoading && staffList.length === 0 ? (
            <View className="items-center py-10">
              <ActivityIndicator color="#111827" size="small" />
            </View>
          ) : staffList.length === 0 ? (
            <Text className="py-10 text-center text-gray-400 text-sm">
              No staff added to this shop yet.
            </Text>
          ) : (
            <ScrollView
              className="mb-2 max-h-96"
              contentContainerStyle={{ gap: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {staffList.map((staff) => (
                <Pressable
                  className="flex-row items-center justify-between rounded-3xl border border-gray-100/80 bg-[#F9FAFB] p-4 shadow-2xs active:bg-gray-100"
                  key={staff.id}
                  onPress={() => {
                    onOpenChange(false);
                    onSelectStaffHours(staff);
                  }}
                >
                  <View className="flex-1 flex-row items-center gap-3.5">
                    <Pressable
                      className={`h-6 w-6 items-center justify-center rounded-md border ${
                        staff.checked
                          ? "border-black bg-black"
                          : "border-gray-300 bg-white"
                      }`}
                      hitSlop={8}
                      onPress={() => toggleStaffCheck(staff.id)}
                    >
                      {staff.checked && (
                        <StyledIcons
                          className="text-white"
                          name="checkmark"
                          size={14}
                        />
                      )}
                    </Pressable>

                    {staff.avatar ? (
                      <Image
                        contentFit="cover"
                        source={{ uri: staff.avatar }}
                        style={{ width: 44, height: 44, borderRadius: 22 }}
                      />
                    ) : (
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200">
                        <StyledIcons
                          className="text-gray-600"
                          name="person"
                          size={22}
                        />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text
                        className="font-bold text-base text-gray-900"
                        numberOfLines={1}
                      >
                        {staff.name}
                      </Text>
                      <Text
                        className="text-xs text-gray-400 font-medium"
                        numberOfLines={1}
                      >
                        {staff.role}
                      </Text>
                    </View>
                  </View>

                  <StyledIcons
                    className="text-gray-400"
                    name="chevron-forward"
                    size={20}
                  />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

{
  /* 2. Staff Working Hours Full-Screen Page (Image 3) */
}
type StaffWorkingHoursPageProps = {
  onBack: () => void;
  onSaveAll: () => void;
  staffName?: string;
};

export function StaffWorkingHoursPage({
  onBack,
  onSaveAll,
  staffName = "Isaac",
}: StaffWorkingHoursPageProps) {
  const { toast } = useToast();
  const [workingDays, setWorkingDays] =
    useState<DayWorkingHour[]>(DEFAULT_WORKING_DAYS);
  const [editingDay, setEditingDay] = useState<DayWorkingHour | null>(null);

  const handleUpdateDay = (updatedDay: DayWorkingHour) => {
    setWorkingDays((prev) =>
      prev.map((d) => (d.id === updatedDay.id ? updatedDay : d)),
    );
    setEditingDay(null);
  };

  const handleSave = () => {
    toast.show({
      label: "Working hours saved!",
      description: `Schedule for ${staffName} has been updated.`,
      variant: "success",
      placement: "top",
    });
    onSaveAll();
  };

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-5 pt-12 pb-4 bg-white">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons className="text-gray-900" name="arrow-back" size={24} />
        </Pressable>
        <Text className="font-bold text-xl text-gray-900">Working hours</Text>
        <View className="w-10" />
      </View>

      {/* Days List */}
      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {workingDays.map((day) => (
            <Pressable
              className="flex-row items-center justify-between py-2.5 border-b border-gray-100 active:opacity-70"
              key={day.id}
              onPress={() => setEditingDay(day)}
            >
              <Text className="font-bold text-base text-gray-900">
                {day.dayName}
              </Text>

              <View className="flex-row items-center gap-2">
                <View className="items-end">
                  <Text className="font-bold text-sm text-gray-800">
                    {day.enabled
                      ? `${day.startTime} - ${day.endTime}`
                      : "Not working"}
                  </Text>
                  {day.enabled && day.hasBreak && day.breakStartTime && (
                    <Text className="text-xs text-gray-400 mt-0.5 font-medium">
                      Break: {day.breakStartTime} -{day.breakEndTime}
                    </Text>
                  )}
                </View>
                <StyledIcons
                  className="text-gray-400"
                  name="chevron-forward"
                  size={18}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Pinned Bottom Save Button */}
      <View className="border-t border-gray-100 bg-white px-5 pt-3 pb-8">
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300] shadow-md"
          onPress={handleSave}
        >
          <Text className="font-bold text-base text-white">Save</Text>
        </Pressable>
      </View>

      {/* Edit Day Working Hours Popup Dialog (Image 4) */}
      {editingDay && (
        <EditDayHoursDialog
          dayData={editingDay}
          isOpen={Boolean(editingDay)}
          onOpenChange={(open) => {
            if (!open) setEditingDay(null);
          }}
          onSave={handleUpdateDay}
        />
      )}
    </Container>
  );
}

{
  /* 3. Edit Day Working Hours Dialog (Image 4) */
}
type EditDayHoursDialogProps = {
  dayData: DayWorkingHour;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedDay: DayWorkingHour) => void;
};

export function EditDayHoursDialog({
  isOpen,
  onOpenChange,
  dayData,
  onSave,
}: EditDayHoursDialogProps) {
  const [enabled, setEnabled] = useState(dayData.enabled);
  const [startTime, setStartTime] = useState(dayData.startTime || "10:50 am");
  const [endTime, setEndTime] = useState(dayData.endTime || "05:30 pm");
  const [hasBreak, setHasBreak] = useState(dayData.hasBreak);
  const [breakStartTime, setBreakStartTime] = useState(
    dayData.breakStartTime || "02:00 pm",
  );
  const [breakEndTime, setBreakEndTime] = useState(
    dayData.breakEndTime || "03:00 pm",
  );

  const handleSave = () => {
    onSave({
      ...dayData,
      enabled,
      startTime,
      endTime,
      hasBreak,
      breakStartTime: hasBreak ? breakStartTime : undefined,
      breakEndTime: hasBreak ? breakEndTime : undefined,
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Day Title & Enable Switch */}
          <View className="mb-6 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-2xl text-gray-900 tracking-tight">
              {dayData.dayName}
            </Dialog.Title>
            <View className="flex-row items-center gap-2">
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#00C853" }}
                value={enabled}
                onValueChange={setEnabled}
              />
              <Text className="font-medium text-xs text-gray-500">Enable</Text>
            </View>
          </View>

          {enabled && (
            <View className="mb-6 gap-5">
              {/* Working Hours Time Inputs: [ 10:50 am ] to [ 05:30 pm ] */}
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                  <TextInput
                    className="text-sm font-medium text-gray-900"
                    onChangeText={setStartTime}
                    placeholder="10:50 am"
                    value={startTime}
                  />
                </View>

                <Text className="font-medium text-sm text-gray-500">to</Text>

                <View className="flex-1 h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                  <TextInput
                    className="text-sm font-medium text-gray-900"
                    onChangeText={setEndTime}
                    placeholder="05:30 pm"
                    value={endTime}
                  />
                </View>
              </View>

              {/* Break Section */}
              <View>
                <Text className="mb-2 font-bold text-base text-gray-900">
                  Break
                </Text>

                {!hasBreak ? (
                  <Pressable
                    className="h-13 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 active:bg-gray-100"
                    onPress={() => setHasBreak(true)}
                  >
                    <StyledIcons
                      className="text-gray-700"
                      name="add"
                      size={18}
                    />
                    <Text className="font-semibold text-sm text-gray-800">
                      Add break
                    </Text>
                  </Pressable>
                ) : (
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-1 h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                        <TextInput
                          className="text-sm font-medium text-gray-900"
                          onChangeText={setBreakStartTime}
                          placeholder="02:00 pm"
                          value={breakStartTime}
                        />
                      </View>

                      <Text className="font-medium text-sm text-gray-500">
                        to
                      </Text>

                      <View className="flex-1 h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                        <TextInput
                          className="text-sm font-medium text-gray-900"
                          onChangeText={setBreakEndTime}
                          placeholder="03:00 pm"
                          value={breakEndTime}
                        />
                      </View>

                      <Pressable
                        className="h-11 w-11 items-center justify-center rounded-full bg-red-50 active:bg-red-100"
                        onPress={() => setHasBreak(false)}
                      >
                        <StyledIcons
                          className="text-red-500"
                          name="trash-outline"
                          size={18}
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Save Button */}
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300] shadow-md"
            onPress={handleSave}
          >
            <Text className="font-bold text-base text-white">Save</Text>
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
