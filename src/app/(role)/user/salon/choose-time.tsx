import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useGetAvailableSlotsQuery } from "@/Redux/feature/shop";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FALLBACK_TIME_SLOTS = [
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
];

export default function ChooseTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    shopId?: string;
    barberId?: string;
    barberUserId?: string;
    barberName?: string;
    barberImage?: string;
    serviceId?: string;
    selectedServices?: string;
  }>();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState("10:00:00");

  const formattedDate = useMemo(() => {
    const yearStr = currentYear.toString();
    const monthStr = String(currentMonthIndex + 1).padStart(2, "0");
    const dayStr = String(selectedDay).padStart(2, "0");
    return `${yearStr}-${monthStr}-${dayStr}`;
  }, [currentYear, currentMonthIndex, selectedDay]);

  const { data: slotsResponse, isLoading } = useGetAvailableSlotsQuery(
    {
      barber_id: params.barberId || "2",
      date: formattedDate,
      services: params.serviceId || "1",
    },
    { skip: !params.barberId && !params.serviceId },
  );

  const availableSlots: string[] = useMemo(() => {
    if (slotsResponse?.data) {
      if (Array.isArray(slotsResponse.data)) {
        return slotsResponse.data.map((item: any) =>
          typeof item === "string"
            ? item
            : item?.start_time || item?.time || String(item),
        );
      }
    }
    return FALLBACK_TIME_SLOTS;
  }, [slotsResponse]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  // Helper to generate days matrix
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  const monthName = MONTH_NAMES[currentMonthIndex] || "July";
  const shortMonthName = monthName.substring(0, 3);
  const selectedDateLabel = `${shortMonthName} ${selectedDay}`;

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return "";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const parts = timeStr.split(":");
    if (parts.length >= 2 && parts[0] !== undefined && parts[1] !== undefined) {
      let hour = Number.parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minutes} ${ampm}`;
    }
    return timeStr;
  };

  const handleBookNow = () => {
    router.push({
      pathname: "/(role)/user/salon/confirm",
      params: {
        shopId: params.shopId || "1",
        barberId: params.barberId || "1",
        serviceId: params.serviceId || "1",
        barberName: params.barberName || "Esther Howard",
        barberImage: params.barberImage || "",
        selectedServices: params.selectedServices || "[]",
        appointment_date: formattedDate,
        start_time: selectedTime,
        selectedDateLabel: `${selectedDay} ${monthName} ${currentYear}`,
        selectedTimeLabel: formatDisplayTime(selectedTime),
      },
    } as Href);
  };

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-6 pb-28">
        {/* Top Header */}
        <View className="flex-row items-center pb-6">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={() => router.back()}
          >
            <StyledIcons
              className="text-gray-900"
              name="chevron-back"
              size={22}
            />
          </Pressable>
          <Text className="flex-1 text-center pr-10 font-poppins-bold text-xl text-gray-900">
            Choose a Time
          </Text>
        </View>

        {/* Calendar Card */}
        <View className="rounded-3xl bg-gray-50/70 p-5 border border-gray-100/60 mb-6">
          {/* Month Header Navigation */}
          <View className="flex-row items-center justify-between mb-5 px-2">
            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              onPress={handlePrevMonth}
            >
              <StyledIcons
                className="text-gray-800"
                name="chevron-back"
                size={18}
              />
            </Pressable>

            <Text className="font-poppins-bold text-lg text-gray-900">
              {monthName} {currentYear}
            </Text>

            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              onPress={handleNextMonth}
            >
              <StyledIcons
                className="text-gray-800"
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          </View>

          {/* Days of Week Row */}
          <View className="flex-row items-center justify-between mb-3">
            {DAYS_OF_WEEK.map((day) => (
              <Text
                className="w-[13%] text-center font-poppins-medium text-xs text-gray-400"
                key={day}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Dates Grid */}
          <View className="flex-row flex-wrap justify-start">
            {daysGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <View className="w-[14.28%] h-10 mb-1" key={`empty-${idx}`} />
                );
              }
              const isSelected = selectedDay === day;
              return (
                <Pressable
                  className={`w-[14.28%] h-10 items-center justify-center mb-1 rounded-xl ${
                    isSelected ? "bg-black" : "bg-transparent"
                  }`}
                  key={`day-${day}`}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    className={`font-poppins-semibold text-xs ${
                      isSelected ? "text-white font-bold" : "text-gray-800"
                    }`}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Available Times Heading */}
        <Text className="mb-4 font-poppins-bold text-base text-gray-900">
          Available Times for ({selectedDateLabel})
        </Text>

        {/* Dynamic Time Slots Grid */}
        {isLoading ? (
          <View className="py-6 items-center justify-center">
            <ActivityIndicator color="#F0B100" size="small" />
            <Text className="mt-2 font-poppins text-xs text-gray-400">
              Loading available slots...
            </Text>
          </View>
        ) : (
          <>
            {availableSlots.length > 0 ? (
              <ScrollView
                contentContainerStyle={{ gap: 13, paddingBottom: 60 }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <Pressable
                      className={`rounded-full max-h-11 px-5 py-3 border ${
                        isSelected
                          ? "bg-black border-black"
                          : "bg-gray-50 border-gray-100 active:bg-gray-100"
                      }`}
                      key={time}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        className={`font-poppins-semibold text-xs ${
                          isSelected ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {formatDisplayTime(time)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View className="w-full mt-10 flex items-center">
                <Text className="text-2xl text-orange-400 font-medium">
                  No Available Time
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Bottom Sticky Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-4 flex-row items-center justify-end shadow-lg">
        <Pressable
          className="w-full rounded-2xl bg-main-primary py-4 items-center active:opacity-90"
          onPress={handleBookNow}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Book Now
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
