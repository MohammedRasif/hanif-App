import { Container } from "@/components/container";
import { AppointmentCard } from "@/feature/calendar/appointment-card";
import { CalendarHeader } from "@/feature/calendar/calendar-header";
import {
  MOCK_APPOINTMENTS,
  MOCK_BARBERS,
} from "@/feature/calendar/calendar-mock-data";
import type { Appointment } from "@/feature/calendar/calendar-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

const START_HOUR = 7; // Timeline starts at 7:00 AM
const END_HOUR = 19; // Timeline ends at 7:00 PM (19:00)
const HOUR_HEIGHT = 120; // Height in px for 1 hour (30px per 15 min)

export default function CustomCalendarScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  // Hours array from 7 to 18
  const hours = useMemo(() => {
    const list = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      const period = h >= 12 ? "pm" : "am";
      const displayHour = h > 12 ? h - 12 : h;
      list.push({
        hourNum: h,
        label: `${displayHour}:00 ${period}`,
      });
    }
    return list;
  }, []);

  // Filter appointments for selected date
  const dayAppointments = useMemo(() => {
    return MOCK_APPOINTMENTS.filter((appt) => {
      return appt.startTime.startsWith(selectedDateStr);
    });
  }, [selectedDateStr]);

  // Helper to calculate top position and height for an appointment
  const getAppointmentLayout = (appt: Appointment) => {
    const startDate = new Date(appt.startTime);
    const endDate = new Date(appt.endTime);

    const startMinutesFromStart =
      (startDate.getHours() - START_HOUR) * 60 + startDate.getMinutes();
    const durationMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    const top = (startMinutesFromStart / 60) * HOUR_HEIGHT;
    const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 48); // Min height 48px

    return { top, height };
  };

  // Fixed red line position matching 8:45 AM in the mockup
  const redLineMinutes = (8 - START_HOUR) * 60 + 45; // 8:45 AM
  const redLineTop = (redLineMinutes / 60) * HOUR_HEIGHT;

  return (
    <Container className="bg-white flex-1">
      {/* Top Shared Header */}
      <CalendarHeader
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      />

      {/* Main Custom Timeline View */}
      <View className="flex-1 bg-white relative">
        <ScrollView
          contentContainerStyle={{
            height: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-1 relative">
            {/* Left Axis - Time Labels */}
            <View className="w-14 border-r border-gray-100 bg-white z-10">
              {hours.map((h, idx) => (
                <View
                  className="justify-between pt-1 pb-1 pr-2 items-end"
                  key={h.hourNum}
                  style={{ height: HOUR_HEIGHT }}
                >
                  <Text className="font-bold text-gray-700 text-xs tracking-tight">
                    {h.label}
                  </Text>
                  {idx < hours.length - 1 && (
                    <>
                      <Text className="text-gray-400 text-[10px]">15</Text>
                      <Text className="text-gray-400 text-[10px]">30</Text>
                      <Text className="text-gray-400 text-[10px]">45</Text>
                    </>
                  )}
                </View>
              ))}
            </View>

            {/* Right Schedule Grid (Barber Columns Area) */}
            <View className="flex-1 relative">
              {/* Background Grid Horizontal Lines for each Hour */}
              {hours.map((h) => (
                <View
                  className="w-full border-t border-gray-100 absolute left-0 right-0"
                  key={h.hourNum}
                  style={{
                    top: (h.hourNum - START_HOUR) * HOUR_HEIGHT,
                    height: HOUR_HEIGHT,
                  }}
                />
              ))}

              {/* Two Barber Columns Container */}
              <View className="flex-row flex-1 h-full">
                {MOCK_BARBERS.map((barber, barberIndex) => {
                  return (
                    <View
                      className={`flex-1 relative ${
                        barberIndex === 0 ? "border-r border-gray-100" : ""
                      }`}
                      key={barber.id}
                    >
                      {/* Render Appointments belonging to this barber column */}
                      {dayAppointments
                        .filter((a) => a.barberId === barber.id)
                        .map((appt) => {
                          const { top, height } = getAppointmentLayout(appt);
                          return (
                            <View
                              className="absolute left-1 right-1 z-10"
                              key={appt.id}
                              style={{
                                top,
                                height,
                              }}
                            >
                              <AppointmentCard appointment={appt} />
                            </View>
                          );
                        })}
                    </View>
                  );
                })}
              </View>

              {/* Red Current Time Indicator Line (Matching mockup at 8:45 AM) */}
              <View
                className="absolute left-0 right-0 z-20 flex-row items-center pointer-events-none"
                style={{ top: redLineTop }}
              >
                <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500" />
                <View className="flex-1 h-[2px] bg-red-500" />
                <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-red-500" />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Button (FAB) */}
        <Pressable className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg z-30 active:scale-95">
          <StyledIonicons className="text-white" name="add" size={28} />
        </Pressable>
      </View>
    </Container>
  );
}
