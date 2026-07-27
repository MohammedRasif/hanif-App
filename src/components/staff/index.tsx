import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export interface StaffMetric {
  id: string;
  label: string;
  value: string;
}

export interface UpcomingAppointment {
  clientAvatar?: string;
  clientName: string;
  duration: string;
  id: string;
  serviceName: string;
  time: string;
}

const DEFAULT_METRICS: StaffMetric[] = [
  { id: "1", label: "Booking", value: "25" },
  { id: "2", label: "Completed", value: "25" },
  { id: "3", label: "Revenue", value: "$8788" },
];

const DEFAULT_APPOINTMENTS: UpcomingAppointment[] = [
  {
    id: "1",
    clientName: "Jhon",
    serviceName: "Hair cut",
    time: "10:30",
    duration: "40 min",
  },
  {
    id: "2",
    clientName: "Jhon",
    serviceName: "Hair cut",
    time: "10:30",
    duration: "40 min",
  },
  {
    id: "3",
    clientName: "Alex Rivera",
    serviceName: "Beard trim & lineup",
    time: "11:15",
    duration: "30 min",
  },
  {
    id: "4",
    clientName: "Michael Scott",
    serviceName: "Executive Haircut & Shave",
    time: "14:00",
    duration: "60 min",
  },
];

export function StaffHeader({
  staffName = "Maïa",
  greeting = "Good after noon",
  avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  onPressNotification,
}: {
  avatarUrl?: string;
  greeting?: string;
  onPressNotification?: () => void;
  staffName?: string;
}) {
  return (
    <View className="flex-row items-center justify-between pt-12 pb-6 px-6 bg-white">
      {/* Staff Profile & Greeting */}
      <View className="flex-row items-center gap-3">
        <Image
          contentFit="cover"
          source={{ uri: avatarUrl }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="font-bold text-xl text-gray-900 tracking-tight">
            Welcome, {staffName}
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">{greeting}</Text>
        </View>
      </View>

      {/* Notification Bell Button */}
      <Pressable
        className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:opacity-75"
        onPress={onPressNotification}
      >
        <StyledIonicons
          className="text-gray-800"
          name="notifications"
          size={20}
        />
      </Pressable>
    </View>
  );
}

export function StaffTodayMetrics({
  metrics = DEFAULT_METRICS,
}: {
  metrics?: StaffMetric[];
}) {
  return (
    <View className="px-6 mb-6">
      <Text className="font-bold text-xl text-[#525252] mb-3 tracking-tight">
        Today
      </Text>
      <View className="flex-row gap-3">
        {metrics.map((metric) => (
          <View
            className="flex-1 bg-[#FAFAFA]! p-4 rounded-2xl border border-gray-100/60"
            key={metric.id}
          >
            <Text className="text-gray-400 text-xs font-medium">
              {metric.label}
            </Text>
            <Text className="font-bold text-lg text-gray-900 mt-1">
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function StaffNextAppointments({
  appointments = DEFAULT_APPOINTMENTS,
  onPressItem,
}: {
  appointments?: UpcomingAppointment[];
  onPressItem?: (item: UpcomingAppointment) => void;
}) {
  return (
    <View className="px-6 mb-6">
      <Text className="font-bold text-xl text-[#525252] mb-3 tracking-tight">
        Next appointment
      </Text>
      <View className="gap-3">
        {appointments.map((item) => (
          <Pressable
            className="flex-row items-center justify-between bg-[#FAFAFA] p-4 rounded-2xl active:opacity-80 border border-gray-100/60"
            key={item.id}
            onPress={() => onPressItem?.(item)}
          >
            {/* Left: Avatar & Details */}
            <View className="flex-row items-center gap-3">
              {item.clientAvatar ? (
                <Image
                  contentFit="cover"
                  source={{ uri: item.clientAvatar }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200">
                  <StyledIonicons
                    className="text-gray-500"
                    name="person"
                    size={20}
                  />
                </View>
              )}
              <View>
                <Text className="font-bold text-base text-[#262626]">
                  {item.clientName}
                </Text>
                <Text className="text-[#737373] text-xs mt-0.5">
                  {item.serviceName}
                </Text>
              </View>
            </View>

            {/* Right: Time & Duration */}
            <View className="items-end">
              <Text className="font-bold text-base text-[#262626]">
                {item.time}
              </Text>
              <Text className="text-[#737373] text-xs mt-0.5">
                {item.duration}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function StaffDashboardComponent() {
  return (
    <View className="flex-1 bg-white">
      <StaffHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StaffTodayMetrics />
        <StaffNextAppointments />
      </ScrollView>
    </View>
  );
}

export default StaffDashboardComponent;
