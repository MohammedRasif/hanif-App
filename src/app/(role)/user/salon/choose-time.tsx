import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function ChooseTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    barberId?: string;
    barberName?: string;
    barberImage?: string;
    selectedServices?: string;
  }>();

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // July (0-indexed 6)
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

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

  const shortMonthName = MONTH_NAMES[currentMonthIndex].substring(0, 3);
  const selectedDateLabel = `${shortMonthName} ${selectedDay}`;

  const handleBookNow = () => {
    router.push({
      pathname: "/(role)/user/salon/confirm",
      params: {
        barberName: params.barberName || "Esther Howard",
        barberImage: params.barberImage || "",
        selectedServices: params.selectedServices || "[]",
        selectedDate: `${selectedDay} ${MONTH_NAMES[currentMonthIndex]} ${currentYear}`,
        selectedTime,
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
            Choose a time
          </Text>
        </View>

        {/* Calendar Card (Image 4) */}
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
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
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

        {/* Time Slots Grid */}
        <ScrollView
          contentContainerStyle={{ gap: 13, paddingBottom: 150 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <Pressable
                className={`rounded-full px-5 py-3 border ${
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
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Sticky Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-4 flex-row items-center justify-end shadow-lg">
        <Pressable
          className="w-full rounded-2xl bg-[#FE9A00] py-4 items-center active:opacity-90"
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
