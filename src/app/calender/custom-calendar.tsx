import { Container } from "@/components/container";
import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";

export default function CustomCalendarScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  return (
    <Container className="bg-white flex-1">
      <CustomCalendar
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      />
    </Container>
  );
}
