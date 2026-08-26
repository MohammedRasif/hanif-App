import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export interface BookingListItem {
  amount: string;
  duration: string;
  id: string;
  serviceName: string;
  title: string;
}

export interface BookingGroup {
  appointmentCount: number;
  dateTitle: string;
  items: BookingListItem[];
  newClientCount: number;
  totalValue: string;
  workingHours: string;
}

const DEFAULT_BOOKING_GROUPS: BookingGroup[] = [
  {
    dateTitle: "Today",
    workingHours: "9.00 - 6.00 pm",
    totalValue: "$12.00",
    appointmentCount: 8,
    newClientCount: 2,
    items: [
      {
        id: "1",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
      {
        id: "2",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
      {
        id: "3",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
    ],
  },
  {
    dateTitle: "Thu,16 july",
    workingHours: "9.00 - 6.00 pm",
    totalValue: "$12.00",
    appointmentCount: 8,
    newClientCount: 2,
    items: [
      {
        id: "4",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
      {
        id: "5",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
      {
        id: "6",
        title: "Walk in clint",
        serviceName: "Hair cut",
        amount: "$12.00",
        duration: "40 min",
      },
    ],
  },
];

type BookingListViewProps = {
  groups?: BookingGroup[];
  onSwitchToCalendar: () => void;
};

export function BookingListView({
  onSwitchToCalendar,
  groups = DEFAULT_BOOKING_GROUPS,
}: BookingListViewProps) {
  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 px-5 pt-15"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group, index) => (
          <View className="mb-8" key={`${group.dateTitle}-${index}`}>
            {/* Group Header (Title & Calendar Switch Button for first group) */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="font-bold text-2xl text-gray-900 tracking-tight">
                  {group.dateTitle}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-400 font-normal">
                  {group.workingHours}
                </Text>
              </View>

              {index === 0 && (
                <Pressable
                  className="h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                  onPress={onSwitchToCalendar}
                >
                  <StyledIcons
                    className="text-gray-900"
                    name="calendar-outline"
                    size={20}
                  />
                </Pressable>
              )}
            </View>

            {/* Summary Metrics Card */}
            <View className="flex-row items-center justify-between rounded-3xl border border-gray-100 bg-[#F9FAFB] p-5 mb-5 shadow-2xs">
              <View className="flex-1 items-start">
                <Text className="text-xs font-medium text-gray-400">Value</Text>
                <Text className="mt-1 font-bold text-lg text-gray-900">
                  {group.totalValue}
                </Text>
              </View>

              <View className="h-8 w-px bg-gray-200 mx-2" />

              <View className="flex-1 items-start pl-2">
                <Text className="text-xs font-medium text-gray-400">
                  Appointment
                </Text>
                <Text className="mt-1 font-bold text-lg text-gray-900">
                  {group.appointmentCount}
                </Text>
              </View>

              <View className="h-8 w-px bg-gray-200 mx-2" />

              <View className="flex-1 items-start pl-2">
                <Text className="text-xs font-medium text-gray-400">
                  New clint
                </Text>
                <Text className="mt-1 font-bold text-lg text-gray-900">
                  {group.newClientCount}
                </Text>
              </View>
            </View>

            {/* Appointments List */}
            <View className="gap-5">
              {group.items.map((item) => (
                <View
                  className="flex-row items-center justify-between"
                  key={item.id}
                >
                  <View className="flex-row items-center gap-3">
                    {/* Left Orange Accent Indicator Line */}
                    <View className="h-10 w-1 rounded-full bg-[#FF9500]" />

                    {/* User Avatar Circle */}
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200">
                      <StyledIcons
                        className="text-gray-600"
                        name="person"
                        size={20}
                      />
                    </View>

                    {/* Title & Subtitle */}
                    <View>
                      <Text className="font-bold text-base text-gray-900">
                        {item.title}
                      </Text>
                      <Text className="text-xs font-medium text-gray-400 mt-0.5">
                        {item.serviceName}
                      </Text>
                    </View>
                  </View>

                  {/* Price & Duration */}
                  <View className="items-end">
                    <Text className="font-bold text-base text-gray-900">
                      {item.amount}
                    </Text>
                    <Text className="text-xs font-medium text-gray-400 mt-0.5">
                      {item.duration}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
}
