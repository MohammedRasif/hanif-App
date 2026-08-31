import { CalendarHeaderView } from "@/lib/calender/calendar-header";
import type { DayItem } from "@/lib/calender/types";
import React from "react";

type Props = {
  activeDateStr?: string;
  onSelectDate?: (day: DayItem) => void;
};

const getCalendarDays = (): DayItem[] => {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index - 3);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const fullDateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      date,
      dateNumber: date.getDate(),
      dayName,
      fullDateStr,
    };
  });
};

export function CalendarHeader({ activeDateStr, onSelectDate }: Props) {
  const days = getCalendarDays();

  return (
    <CalendarHeaderView
      activeDateStr={activeDateStr}
      days={days}
      onSelectDate={onSelectDate}
    />
  );
}
