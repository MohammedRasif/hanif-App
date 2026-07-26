import { Container } from "@/components/container";
import { AppointmentCard } from "@/feature/calendar/appointment-card";
import { CalendarHeader } from "@/feature/calendar/calendar-header";
import { MOCK_APPOINTMENTS } from "@/feature/calendar/calendar-mock-data";
import type { Appointment } from "@/feature/calendar/calendar-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export default function BigCalendarScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");
  const screenHeight = Dimensions.get("window").height;

  // Convert appointments to Date format required by react-native-big-calendar
  const events = MOCK_APPOINTMENTS.map((appt) => ({
    title: appt.serviceName,
    start: new Date(appt.startTime),
    end: new Date(appt.endTime),
    raw: appt,
  }));

  const renderEvent = (event: any) => {
    const rawAppt: Appointment = event.raw || {
      id: "big-cal-event",
      barberId: "barber-1",
      barberName: "Mike Johnson",
      startTime: event.start.toISOString(),
      endTime: event.end.toISOString(),
      timeDisplay: "09:00 – 10:40",
      serviceName: event.title,
      cardType: "appointment",
      bgColor: "#EBF5FF",
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

      {/* Big Calendar Body */}
      <View className="flex-1 bg-white relative">
        <Calendar
          date={new Date(selectedDateStr)}
          events={events}
          height={screenHeight - 220}
          key={selectedDateStr}
          mode="day"
          renderEvent={renderEvent}
          showTime={true}
        />

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
