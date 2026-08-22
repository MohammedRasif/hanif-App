import type { BookingItem } from "@/Redux/feature/shop.types";
import { StyledIcons } from "@/lib";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export interface Appointment {
  id: string;
  shopName: string;
  location: string;
  avatarUrl: string;
  service: string;
  barberName: string;
  date: {
    month: string;
    day: string;
    time: string;
  };
  status?: string;
  rawBooking?: BookingItem;
}

export interface AppointmentCardProps {
  appointment: Appointment;
  showBookAgain?: boolean;
  onBookAgain?: (appointment: Appointment) => void;
  onPress?: (appointment: Appointment) => void;
}

export function AppointmentCard({
  appointment,
  showBookAgain = false,
  onBookAgain,
  onPress,
}: AppointmentCardProps) {
  const getStatusBadge = () => {
    if (!appointment.status) return null;

    const lowerStatus = appointment.status.toLowerCase();
    const isCancelled = lowerStatus.includes("cancel");
    const isCompleted =
      lowerStatus.includes("complet") ||
      lowerStatus.includes("finish") ||
      lowerStatus.includes("past");

    return (
      <View
        className={`rounded-full px-3.5 py-1 ${
          isCancelled
            ? "bg-rose-50"
            : isCompleted
              ? "bg-gray-100"
              : "bg-emerald-50"
        }`}
      >
        <Text
          className={`font-poppins-semibold text-xs capitalize ${
            isCancelled
              ? "text-rose-500"
              : isCompleted
                ? "text-gray-600"
                : "text-emerald-600"
          }`}
        >
          {appointment.status}
        </Text>
      </View>
    );
  };

  return (
    <Pressable
      className="mb-4 rounded-[26px] border border-gray-100 bg-[#fbfbfc] p-5 shadow-xs active:opacity-95"
      onPress={() => onPress?.(appointment)}
    >
      {/* Top Row: Avatar + Shop Info + Status Badge */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            className="h-12 w-12 rounded-full"
            source={{ uri: appointment.avatarUrl }}
          />
          <View>
            <Text className="font-poppins-bold text-base text-foreground">
              {appointment.shopName}
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <StyledIcons color="#9ca3af" name="location-outline" size={13} />
              <Text className="font-poppins text-default-400 text-xs">
                {appointment.location}
              </Text>
            </View>
          </View>
        </View>

        {getStatusBadge()}
      </View>

      {/* Bottom Row: Service details & Date block */}
      <View className="mt-4 flex-row items-center justify-between">
        {/* Left: Service info and Optional 'Book Again' button */}
        <View className="flex-1 pr-3">
          <Text className="font-poppins-bold text-foreground text-lg">
            {appointment.service}
          </Text>
          <Text className="mt-0.5 font-poppins text-default-400 text-sm">
            With{" "}
            <Text className="font-poppins-semibold text-default-600">
              {appointment.barberName}
            </Text>
          </Text>

          {showBookAgain && (
            <Pressable
              className="mt-3 self-start rounded-xl bg-[#f0b100] px-4 py-2 active:opacity-85"
              onPress={(e) => {
                e.stopPropagation?.();
                onBookAgain?.(appointment);
              }}
            >
              <Text className="font-poppins-semibold text-sm text-white">
                Book Again
              </Text>
            </Pressable>
          )}
        </View>

        {/* Vertical Divider */}
        <View className="h-12 w-px bg-default-200" />

        {/* Right: Date & Time */}
        <View className="min-w-18.5 items-center justify-center pl-4">
          <Text className="font-poppins-medium text-default-400 text-xs">
            {appointment.date.month}
          </Text>
          <Text className="my-0.5 font-poppins-bold text-2xl text-foreground leading-none">
            {appointment.date.day}
          </Text>
          <Text className="font-poppins-medium text-default-400 text-[11px]">
            {appointment.date.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
