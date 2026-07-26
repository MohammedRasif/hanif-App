import { Container } from "@/components/container";
import { AppointmentCard } from "@/feature/calendar/appointment-card";
import { CalendarHeader } from "@/feature/calendar/calendar-header";
import { MOCK_APPOINTMENTS } from "@/feature/calendar/calendar-mock-data";
import type { Appointment } from "@/feature/calendar/calendar-types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import WeekView from "react-native-week-view";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export default function WeekViewScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  // Format events for react-native-week-view
  const events = MOCK_APPOINTMENTS.map((appt) => ({
    id: appt.id,
    description: appt.serviceName,
    startDate: new Date(appt.startTime),
    endDate: new Date(appt.endTime),
    color: appt.bgColor,
    raw: appt,
  })) as any;

  const EventComponent = ({ event }: { event: any }) => {
    const rawAppt: Appointment = event.raw || {
      id: String(event.id || "week-view-evt"),
      barberId: "barber-1",
      barberName: "Mike Johnson",
      startTime: event.startDate
        ? event.startDate.toISOString()
        : "2026-07-18T09:00:00",
      endTime: event.endDate
        ? event.endDate.toISOString()
        : "2026-07-18T10:40:00",
      timeDisplay: "09:00 – 10:40",
      serviceName: event.description || "Service",
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

      {/* Week View Calendar Body */}
      <View className="flex-1 bg-white relative">
        <WeekView
          EventComponent={EventComponent}
          events={events}
          headerStyle={{ display: "none" }} // Hide default header since we use CalendarHeader
          hoursInDisplay={6}
          key={selectedDateStr}
          numberOfDays={3}
          selectedDate={new Date(selectedDateStr)}
          startHour={7}
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
