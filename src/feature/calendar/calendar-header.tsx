import { CalendarHeaderView } from "@/lib/calender/calendar-header";
import { DEFAULT_DAYS } from "@/lib/calender/mock-data";
import type { DayItem } from "@/lib/calender/types";
import React from "react";

type Props = {
  activeDateStr?: string;
  onSelectDate?: (day: DayItem) => void;
};

export function CalendarHeader({ activeDateStr, onSelectDate }: Props) {
  return (
    <CalendarHeaderView
      activeDateStr={activeDateStr}
      days={DEFAULT_DAYS}
      onSelectDate={onSelectDate}
    />
  );
}
