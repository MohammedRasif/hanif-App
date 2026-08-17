import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface UpcomingAppointment {
  clientAvatar?: string;
  clientName: string;
  duration: string;
  id: string;
  serviceName: string;
  time: string;
}

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
                  <StyledIcons
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
