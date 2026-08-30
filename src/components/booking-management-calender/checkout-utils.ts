import type { BookingAppointmentService } from "@/Redux/feature/bookingCalendarApi";

/** Preset tip amounts offered on the checkout screen. */
export const TIP_PRESETS = [5, 10, 20, 30];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parses the string amounts the API returns (`"35.00"`) into a safe number. */
export function toAmount(value?: null | number | string): number {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value?: null | number | string): string {
  return `$${toAmount(value).toFixed(2)}`;
}

/** Drops trailing zero cents so totals read `$65` instead of `$65.00`. */
export function formatMoneyShort(value?: null | number | string): string {
  const amount = toAmount(value);
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/** `"09:30:00"` -> minutes since midnight. */
export function timeStringToMinutes(time?: null | string): null | number {
  if (!time) return null;
  const segments = time.split(":");
  const hours = Number(segments[0]);
  const minutes = Number(segments[1]);
  if (!Number.isFinite(hours)) return null;
  return hours * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

/** `"15:00:00"` -> `"3 pm"`, `"15:30:00"` -> `"3:30 pm"`. */
export function formatClockLabel(time?: null | string): string {
  const total = timeStringToMinutes(time);
  if (total === null) return "";
  const hours24 = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  const period = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return minutes === 0
    ? `${hours12} ${period}`
    : `${hours12}:${`${minutes}`.padStart(2, "0")} ${period}`;
}

/** `"2026-07-15"` -> `"Wed, 15 Jul 2026"` (parsed as a local date, never UTC). */
export function formatShortDate(dateStr?: null | string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!(year && month && day)) return dateStr;
  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_LABELS[date.getDay()]}, ${day} ${MONTH_LABELS[month - 1]} ${year}`;
}

/** `"Wed, 15 Jul 2026, 3 pm"` — the line under each service name in the design. */
export function formatAppointmentWhen(appointment: {
  appointment_date?: null | string;
  start_time?: null | string;
}): string {
  const datePart = formatShortDate(appointment.appointment_date);
  const timePart = formatClockLabel(appointment.start_time);
  return [datePart, timePart].filter(Boolean).join(", ");
}

export function appointmentDurationMinutes(
  appointment: Pick<BookingAppointmentService, "end_time" | "start_time">,
): null | number {
  const start = timeStringToMinutes(appointment.start_time);
  const end = timeStringToMinutes(appointment.end_time);
  if (start === null || end === null) return null;
  const diff = end - start;
  return diff > 0 ? diff : null;
}

export function formatDurationLabel(minutes?: null | number): string {
  return minutes ? `${minutes} min` : "";
}
