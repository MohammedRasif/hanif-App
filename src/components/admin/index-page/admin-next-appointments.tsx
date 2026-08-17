import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface UpcomingBooking {
  clientAvatar?: string;
  clientName: string;
  duration: string;
  id: string;
  price: string;
  serviceName: string;
  time: string;
}

const DEFAULT_BOOKINGS: UpcomingBooking[] = [
  {
    id: "1",
    clientName: "Mike Johnson",
    serviceName: "Hair cut",
    price: "$12.00",
    duration: "40 min",
    time: "09:30",
  },
  {
    id: "2",
    clientName: "Mike Johnson",
    serviceName: "Hair cut",
    price: "$12.00",
    duration: "40 min",
    time: "10:30",
  },
  {
    id: "3",
    clientName: "Mike Johnson",
    serviceName: "Hair cut",
    price: "$12.00",
    duration: "40 min",
    time: "9:30",
  },
];

export function AdminNextAppointments({
  bookings = DEFAULT_BOOKINGS,
  onPressItem,
}: {
  bookings?: UpcomingBooking[];
  onPressItem?: (item: UpcomingBooking) => void;
}) {
  return (
    <View className="px-6 mt-4 mb-6">
      <Text className="font-poppins-bold text-lg text-foreground mb-4">
        upcoming Booking
      </Text>

      <View className="gap-4">
        {bookings.map((item) => (
          <Pressable
            className="flex-row items-center justify-between py-1 active:opacity-80"
            key={item.id}
            onPress={() => onPressItem?.(item)}
          >
            {/* Left Section: Orange Accent Bar + Avatar + Client/Service */}
            <View className="flex-row items-center flex-1 pr-2">
              {/* Orange Accent Vertical Bar */}
              <View className="h-10 w-1 rounded-full bg-[#f0b100] mr-3" />

              {/* Client Avatar */}
              {item.clientAvatar ? (
                <Image
                  contentFit="cover"
                  source={{ uri: item.clientAvatar }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#e5e7eb] mr-3">
                  <StyledIcons color="#9ca3af" name="person" size={22} />
                </View>
              )}

              {/* Name & Service */}
              <View className="flex-1">
                <Text className="font-poppins-bold text-base text-foreground">
                  {item.clientName}
                </Text>
                <Text className="font-poppins text-default-400 text-sm mt-0.5">
                  {item.serviceName}
                </Text>
              </View>
            </View>

            {/* Middle Section: Price & Duration */}
            <View className="items-end">
              <Text className="font-poppins-bold text-base text-foreground">
                {item.price}
              </Text>
              <Text className="font-poppins text-default-400 text-xs mt-0.5">
                {item.duration}
              </Text>
            </View>

            {/* Vertical Divider */}
            <View className="mx-3 h-8 w-px bg-gray-200" />

            {/* Right Section: Time Capsule */}
            <View className="min-w-15.5 items-center justify-center rounded-2xl bg-[#fff8ee] border border-amber-100/60 py-3 px-3.5">
              <Text className="font-poppins-semibold text-xs text-foreground">
                {item.time}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
