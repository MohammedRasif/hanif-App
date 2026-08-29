import { StyledIcons } from "@/lib";
import type {
  BookingBarber,
  BookingDetailsData,
} from "@/Redux/feature/bookingCalendarApi";
import { Image } from "expo-image";
import { Dialog } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export interface BookingEditPayload {
  /** `YYYY-MM-DD` */
  appointmentDate: string;
  barberId: number | string;
  /** `HH:MM:SS` */
  startTime: string;
}

export function barberDisplayName(barber: BookingBarber): string {
  return barber.user_details?.name || barber.user_name || `Staff #${barber.id}`;
}

type BookingEditModalProps = {
  barbers: BookingBarber[];
  booking: BookingDetailsData;
  isLoadingBarbers?: boolean;
  isOpen: boolean;
  isSaving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: BookingEditPayload) => void;
};

export function BookingEditModal({
  barbers,
  booking,
  isLoadingBarbers = false,
  isOpen,
  isSaving = false,
  onOpenChange,
  onSave,
}: BookingEditModalProps) {
  const firstAppointment = booking.appointments_details?.[0];
  const currentBarberId = booking.barber?.id ?? firstAppointment?.barber?.id;

  const [dateText, setDateText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [selectedBarberId, setSelectedBarberId] = useState<
    null | number | string
  >(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  // Reset the form to the booking's current values whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setDateText(firstAppointment?.appointment_date ?? "");
    setTimeText((firstAppointment?.start_time ?? "").slice(0, 5));
    setSelectedBarberId(currentBarberId ?? null);
    setSearchText("");
    setError("");
  }, [
    isOpen,
    firstAppointment?.appointment_date,
    firstAppointment?.start_time,
    currentBarberId,
  ]);

  const filteredBarbers = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return barbers;
    return barbers.filter((barber) => {
      const haystack = [
        barberDisplayName(barber),
        barber.specialty ?? "",
        barber.role ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [barbers, searchText]);

  const handleSave = () => {
    if (!DATE_PATTERN.test(dateText.trim())) {
      setError("Use the date format YYYY-MM-DD.");
      return;
    }
    if (!TIME_PATTERN.test(timeText.trim())) {
      setError("Use the 24-hour time format HH:MM.");
      return;
    }
    if (selectedBarberId === null || selectedBarberId === undefined) {
      setError("Select a staff member.");
      return;
    }
    setError("");
    onSave({
      appointmentDate: dateText.trim(),
      barberId: selectedBarberId,
      startTime: `${timeText.trim()}:00`,
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          <Pressable
            className="mb-3 flex-row items-center gap-1.5 self-start py-1"
            onPress={() => onOpenChange(false)}
          >
            <StyledIcons
              className="text-gray-700"
              name="arrow-back"
              size={20}
            />
            <Text className="font-medium text-base text-gray-700">Back</Text>
          </Pressable>

          <Dialog.Title className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
            Edit booking
          </Dialog.Title>
          <Text className="mb-5 text-gray-500 text-sm">
            Change the date, time or assigned staff.
          </Text>

          <ScrollView
            className="max-h-[26rem]"
            showsVerticalScrollIndicator={false}
          >
            {/* Date */}
            <View className="mb-4">
              <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                Date
              </Text>
              <View className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4">
                <TextInput
                  className="flex-1 text-gray-900 text-sm"
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  onChangeText={setDateText}
                  placeholder="2026-07-15"
                  placeholderTextColor="#9CA3AF"
                  value={dateText}
                />
                <StyledIcons
                  className="text-gray-500"
                  name="calendar-outline"
                  size={18}
                />
              </View>
            </View>

            {/* Start time */}
            <View className="mb-5">
              <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                Start time
              </Text>
              <View className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4">
                <TextInput
                  className="flex-1 text-gray-900 text-sm"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  onChangeText={setTimeText}
                  placeholder="10:00"
                  placeholderTextColor="#9CA3AF"
                  value={timeText}
                />
                <StyledIcons
                  className="text-gray-500"
                  name="time-outline"
                  size={18}
                />
              </View>
            </View>

            {/* Staff search + selection */}
            <Text className="mb-1.5 font-medium text-gray-700 text-sm">
              Staff
            </Text>
            <View className="mb-3 h-13 flex-row items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4">
              <StyledIcons className="text-gray-400" name="search" size={18} />
              <TextInput
                className="flex-1 text-gray-900 text-sm"
                onChangeText={setSearchText}
                placeholder="Search barber"
                placeholderTextColor="#9CA3AF"
                value={searchText}
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText("")}>
                  <StyledIcons
                    className="text-gray-400"
                    name="close-circle"
                    size={18}
                  />
                </Pressable>
              )}
            </View>

            {isLoadingBarbers ? (
              <View className="items-center py-8">
                <ActivityIndicator color="#111827" size="small" />
              </View>
            ) : filteredBarbers.length === 0 ? (
              <Text className="py-6 text-center text-gray-400 text-sm">
                No staff matched your search.
              </Text>
            ) : (
              filteredBarbers.map((barber) => {
                const isSelected =
                  String(selectedBarberId) === String(barber.id);
                return (
                  <Pressable
                    className={`mb-2.5 flex-row items-center justify-between rounded-2xl border p-3 ${
                      isSelected
                        ? "border-[#FF9500] bg-[#FF9500]/5"
                        : "border-gray-200 bg-white active:bg-gray-50"
                    }`}
                    key={String(barber.id)}
                    onPress={() => setSelectedBarberId(barber.id)}
                  >
                    <View className="flex-1 flex-row items-center gap-3">
                      {barber.user_details?.image ? (
                        <Image
                          contentFit="cover"
                          source={{ uri: barber.user_details.image }}
                          style={{ width: 38, height: 38, borderRadius: 19 }}
                        />
                      ) : (
                        <View className="h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-200">
                          <StyledIcons
                            className="text-gray-600"
                            name="person"
                            size={18}
                          />
                        </View>
                      )}
                      <View className="flex-1">
                        <Text
                          className="font-semibold text-gray-900 text-sm"
                          numberOfLines={1}
                        >
                          {barberDisplayName(barber)}
                        </Text>
                        <Text
                          className="text-gray-400 text-xs"
                          numberOfLines={1}
                        >
                          {barber.specialty || barber.role || "Barber"}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <StyledIcons
                        className="text-[#FF9500]"
                        name="checkmark-circle"
                        size={22}
                      />
                    )}
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          {!!error && (
            <Text className="mt-3 text-[#FF3B30] text-xs">{error}</Text>
          )}

          <View className="mt-5 flex-row items-center gap-3">
            <Pressable
              className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
              onPress={() => onOpenChange(false)}
            >
              <Text className="font-semibold text-base text-gray-700">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              className={`h-13 flex-1 flex-row items-center justify-center gap-2 rounded-2xl ${
                isSaving
                  ? "bg-[#FF9500]/60"
                  : "bg-[#FF9500] active:bg-[#e08300]"
              }`}
              disabled={isSaving}
              onPress={handleSave}
            >
              {isSaving && <ActivityIndicator color="#FFFFFF" size="small" />}
              <Text className="font-bold text-base text-white">Save</Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default BookingEditModal;
