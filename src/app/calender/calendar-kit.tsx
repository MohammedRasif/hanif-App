import { Container } from "@/components/container";
import { AppointmentCard } from "@/feature/calendar/appointment-card";
import { CalendarHeader } from "@/feature/calendar/calendar-header";
import { MOCK_APPOINTMENTS } from "@/feature/calendar/calendar-mock-data";
import type { Appointment } from "@/feature/calendar/calendar-types";
import { Ionicons } from "@expo/vector-icons";
import { CalendarBody, CalendarContainer } from "@howljs/calendar-kit";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export default function CalendarKitScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  // Transform appointments for @howljs/calendar-kit format
  const calendarEvents = MOCK_APPOINTMENTS.map((appt) => ({
    id: appt.id,
    title: appt.serviceName,
    start: { dateTime: appt.startTime },
    end: { dateTime: appt.endTime },
    color: appt.bgColor,
    raw: appt,
  }));

  const renderEvent = (event: any) => {
    const rawAppt: Appointment = event.raw || {
      id: event.id,
      barberId: "barber-1",
      barberName: "Mike Johnson",
      startTime: event.start,
      endTime: event.end,
      timeDisplay: "09:00 – 10:40",
      serviceName: event.title,
      cardType: "appointment",
      bgColor: event.color || "#EBF5FF",
      durationMinutes: 60,
    };

    return <AppointmentCard appointment={rawAppt} />;
  };

  return (
    <Container className="bg-white flex-1">
      {/* Top Shared Header */}
      <CalendarHeader
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      />

      {/* Calendar Timeline Body */}
      <View className="flex-1 bg-white relative">
        <CalendarContainer
          events={calendarEvents}
          initialDate={selectedDateStr}
          key={selectedDateStr}
          numberOfDays={2}
        >
          <CalendarBody renderEvent={renderEvent} />
        </CalendarContainer>

        {/* Custom Red Time Indicator Line (Matching mockup at 8:45 AM) */}
        <View className="absolute top-[280px] left-0 right-0 z-20 flex-row items-center pointer-events-none">
          <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500" />
          <View className="flex-1 h-[2px] bg-red-500" />
          <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-red-500" />
        </View>

        {/* Floating Action Button (FAB) */}
        <Pressable className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg z-30 active:scale-95">
          <StyledIonicons className="text-white" name="add" size={28} />
        </Pressable>
      </View>
    </Container>
  );
}
