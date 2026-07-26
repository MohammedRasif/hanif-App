import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { withUniwind } from "uniwind";
import type { Appointment } from "./calendar-types";

const StyledIonicons = withUniwind(Ionicons);

type Props = {
  appointment: Appointment;
  onPress?: () => void;
};

export function AppointmentCard({ appointment }: Props) {
  const isCompleted = appointment.status === "completed";
  const isReservation = appointment.cardType === "reservation";

  return (
    <View
      className="flex-1 rounded-2xl p-3 shadow-xs"
      style={{ backgroundColor: appointment.bgColor }}
    >
      {/* Top Header: Time or Title */}
      <View className="flex-row items-center justify-between mb-1">
        <Text className="font-bold text-gray-900 text-sm tracking-tight">
          {appointment.timeDisplay}
        </Text>
        {isCompleted && (
          <StyledIonicons
            className="text-emerald-600"
            name="checkmark-circle"
            size={18}
          />
        )}
      </View>

      {/* Body Content */}
      {isReservation ? (
        <Text className="mt-0.5 text-gray-600 text-xs font-medium">
          {appointment.serviceName}
        </Text>
      ) : (
        <View className="mt-0.5">
          {appointment.userName && (
            <Text className="text-gray-700 text-xs font-medium">
              {appointment.userName}
            </Text>
          )}
          <Text className="mt-0.5 text-gray-600 text-xs">
            {appointment.serviceName}
          </Text>
          {appointment.subTitle && (
            <Text className="mt-1 text-gray-500 text-[11px]">
              {appointment.subTitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
