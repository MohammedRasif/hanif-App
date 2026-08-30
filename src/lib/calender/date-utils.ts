import { formatCalendarDate } from "@/Redux/feature/bookingCalendarApi";
import type { DayItem } from "./types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parses `HH:MM` / `HH:MM:SS` into minutes past midnight, or `null` when unusable. */
export function timeToMinutes(time?: null | string): null | number {
  if (!time) {
    return null;
  }
  const [rawHours, rawMinutes] = time.split(":");
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes ?? "0");
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

/** Minutes past local midnight for a `Date`. */
export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Minutes past midnight -> `09:05`. */
export function minutesToShortTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${`${hours}`.padStart(2, "0")}:${`${mins}`.padStart(2, "0")}`;
}

/**
 * Minutes past midnight -> local ISO date-time (no timezone suffix) so `new Date()`
 * reads it back in the device timezone instead of shifting it to UTC.
 */
export function minutesToIsoDateTime(dateStr: string, minutes: number): string {
  return `${dateStr}T${minutesToShortTime(minutes)}:00`;
}

/** Minutes past midnight -> `9.00 am`, matching the calendar header label format. */
export function minutesToClockLabel(
  minutes: number,
  withPeriod = true,
): string {
  const hours24 = Math.floor(minutes / 60) % 24;
  const mins = Math.round(minutes % 60);
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const label = `${hours12}.${`${mins}`.padStart(2, "0")}`;
  if (!withPeriod) {
    return label;
  }
  return `${label} ${hours24 >= 12 ? "pm" : "am"}`;
}

/** Local-midnight `Date` for a `YYYY-MM-DD` string (`new Date(str)` would parse as UTC). */
export function parseDateStr(dateStr?: null | string): Date {
  if (!dateStr) {
    return new Date();
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!(year && month && day)) {
    return new Date();
  }
  return new Date(year, month - 1, day);
}

/** The Monday→Sunday week containing `activeDateStr`, for the day carousel. */
export function buildWeekDays(activeDateStr?: null | string): DayItem[] {
  const active = parseDateStr(activeDateStr);
  const weekday = active.getDay();
  const offsetToMonday = weekday === 0 ? -6 : 1 - weekday;

  return Array.from({ length: 7 }, (_unused, index) => {
    const date = new Date(
      active.getFullYear(),
      active.getMonth(),
      active.getDate() + offsetToMonday + index,
    );
    return {
      date,
      dateNumber: date.getDate(),
      dayName: WEEKDAY_LABELS[date.getDay()] ?? "",
      fullDateStr: formatCalendarDate(date),
    };
  });
}

/** Keeps a minute value inside the grid's visible range. */
export function clampMinutes(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
