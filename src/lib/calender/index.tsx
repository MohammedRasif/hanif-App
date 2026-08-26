import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { CalendarGridTimeline } from "./calendar-grid";
import { CalendarHeaderView } from "./calendar-header";
import { DEFAULT_DAYS } from "./mock-data";
import type { CalendarProps } from "./types";

export function CustomCalendar({
  activeDateStr: propsActiveDateStr,
  appointments = [],
  barbers = [],
  children,
  columnWidth = 165,
  days = DEFAULT_DAYS,
  endHour = 19,
  hourHeight = 120,
  onPressAppointment,
  onPressFab,
  onPressFilter,
  onPressListView,
  onSelectDate: propsOnSelectDate,
  renderEventCard,
  renderFab,
  showFab = true,
  startHour = 7,
  workingHoursLabel = "9.00 - 6.00 pm",
}: CalendarProps) {
  const [internalDateStr, setInternalDateStr] = useState("2026-07-18");

  const activeDateStr = propsActiveDateStr || internalDateStr;

  const handleSelectDate = (dayItem: any) => {
    setInternalDateStr(dayItem.fullDateStr);
    propsOnSelectDate?.(dayItem);
  };

  // Filter appointments for active date
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) =>
      appt.startTime.startsWith(activeDateStr),
    );
  }, [appointments, activeDateStr]);

  return (
    <View className="flex-1 bg-white">
      {/* Top Header & Day Bar */}
      <CalendarHeaderView
        activeDateStr={activeDateStr}
        days={days}
        onPressFilter={onPressFilter}
        onPressListView={onPressListView}
        onSelectDate={handleSelectDate}
        workingHoursLabel={workingHoursLabel}
      />

      {/* Main Sticky Grid & Timeline */}
      <CalendarGridTimeline
        appointments={filteredAppointments}
        barbers={barbers}
        columnWidth={columnWidth}
        endHour={endHour}
        hourHeight={hourHeight}
        onPressAppointment={onPressAppointment}
        onPressFab={onPressFab}
        renderEventCard={renderEventCard}
        renderFab={renderFab}
        showFab={showFab}
        startHour={startHour}
      >
        {children}
      </CalendarGridTimeline>
    </View>
  );
}

export * from "./appointment-card";
export * from "./calendar-grid";
export * from "./calendar-header";
export * from "./mock-data";
export * from "./types";
export default CustomCalendar;
