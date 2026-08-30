import { formatCalendarDate } from "@/Redux/feature/bookingCalendarApi";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { CalendarGridTimeline } from "./calendar-grid";
import { CalendarHeaderView } from "./calendar-header";
import { buildWeekDays } from "./date-utils";
import type { CalendarProps } from "./types";

export function CustomCalendar({
  activeDateStr: propsActiveDateStr,
  appointments = [],
  barbers = [],
  blocks = [],
  children,
  columnWidth = 165,
  days: propsDays,
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
  const [internalDateStr, setInternalDateStr] = useState(() =>
    formatCalendarDate(),
  );

  const activeDateStr = propsActiveDateStr || internalDateStr;

  // Fall back to the real Mon–Sun week around the active date
  const days = useMemo(
    () => propsDays ?? buildWeekDays(activeDateStr),
    [propsDays, activeDateStr],
  );

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
        activeDateStr={activeDateStr}
        appointments={filteredAppointments}
        barbers={barbers}
        blocks={blocks}
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
export * from "./date-utils";
export * from "./mock-data";
export * from "./types";
export default CustomCalendar;
