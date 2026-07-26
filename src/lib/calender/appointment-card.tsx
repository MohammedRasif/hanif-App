import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import type { Appointment } from "./types";

const StyledIonicons = withUniwind(Ionicons);

type Props = {
  appointment: Appointment;
  onPress?: (appointment: Appointment) => void;
};

export function CalendarAppointmentCard({ appointment, onPress }: Props) {
  const isCompleted = appointment.status === "completed";
  const isReservation = appointment.cardType === "reservation";

  return (
    <Pressable
      className="flex-1 rounded-2xl p-2.5 shadow-xs overflow-hidden active:opacity-80"
      onPress={() => onPress?.(appointment)}
      style={{ backgroundColor: appointment.bgColor }}
    >
      {/* Top Header: Time or Title */}
      <View className="flex-row items-center justify-between mb-0.5">
        <Text
          className="font-bold text-gray-900 text-xs tracking-tight"
          numberOfLines={1}
        >
          {appointment.timeDisplay}
        </Text>
        {isCompleted && (
          <StyledIonicons
            className="text-emerald-600"
            name="checkmark-circle"
            size={16}
          />
        )}
      </View>

      {/* Body Content */}
      {isReservation ? (
        <Text
          className="mt-0.5 text-gray-600 text-[11px] font-medium"
          numberOfLines={2}
        >
          {appointment.serviceName}
        </Text>
      ) : (
        <View className="mt-0.5">
          {appointment.userName && (
            <Text
              className="text-gray-900 text-xs font-semibold"
              numberOfLines={1}
            >
              {appointment.userName}
            </Text>
          )}
          <Text className="mt-0.5 text-gray-600 text-[11px]" numberOfLines={2}>
            {appointment.serviceName}
          </Text>
          {appointment.subTitle && (
            <Text
              className="mt-0.5 text-gray-400 text-[10px]"
              numberOfLines={1}
            >
              {appointment.subTitle}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
