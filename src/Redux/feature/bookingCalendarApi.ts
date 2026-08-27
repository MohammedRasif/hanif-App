import { baseApi } from "./baseApi";

export type BookingCalendarViewType = "admin" | "staff";

export type CalendarAppointmentStatus =
  | "cancelled"
  | "completed"
  | "confirmed"
  | "in_progress"
  | "no_show"
  | "pending"
  | "scheduled";

/** Weekday keys returned by the API for recurring shifts and breaks. */
export type CalendarDayOfWeek =
  | "friday"
  | "monday"
  | "saturday"
  | "sunday"
  | "thursday"
  | "tuesday"
  | "wednesday";

/** Returns a local-timezone `YYYY-MM-DD` string (avoids the UTC shift of `toISOString`). */
export function formatCalendarDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface BookingCalendarViewParams {
  /** `YYYY-MM-DD`. Defaults to today when omitted. */
  date?: string;
  shop_id: number | string;
  /** Defaults to `admin`. */
  view_type?: BookingCalendarViewType;
  display_mode: "calendar" | "list";
}

export interface CalendarShop {
  id: number | string;
  name: string;
}

/** Shop-wide closure window for the requested date. */
export interface CalendarBusinessTimeOff {
  end_time: null | string;
  is_off: boolean;
  start_time: null | string;
}

/** Shop-wide break (applies to every barber column). */
export interface CalendarBusinessBreak {
  end_time: string;
  id: number | string;
  start_time: string;
}

export interface CalendarBusinessHours {
  breaks: CalendarBusinessBreak[];
  close_time: null | string;
  is_closed: boolean;
  open_time: null | string;
  /** `recurring` when derived from weekly hours, otherwise a date-specific override. */
  source: string;
  time_off: CalendarBusinessTimeOff;
}

export interface CalendarBarber {
  avatar: null | string;
  id: number | string;
  image: null | string;
  name: string;
}

/** Working window for the barber. `shift_date` is set only for date-specific overrides. */
export interface CalendarBarberShift {
  day_of_week: CalendarDayOfWeek | null;
  end_time: string;
  id: number | string;
  shift_date: null | string;
  start_time: string;
}

/** Per-barber break (e.g. lunch). `break_date` is set only for date-specific overrides. */
export interface CalendarBarberBreak {
  break_date: null | string;
  day_of_week: CalendarDayOfWeek | null;
  end_time: string;
  id: number | string;
  start_time: string;
  title: null | string;
}

/**
 * Per-barber time off. The sample response returns an empty array, so every field
 * beyond `id` is optional until the backend shape is confirmed.
 */
export interface CalendarBarberTimeOff {
  end_date?: null | string;
  end_time?: null | string;
  id: number | string;
  is_full_day?: boolean;
  reason?: null | string;
  start_date?: null | string;
  start_time?: null | string;
  title?: null | string;
}

export interface CalendarAppointment {
  appointment_id: number | string;
  booking_id: number | string;
  customer_name: string;
  /** `HH:MM` */
  end_time: string;
  service_name: string;
  /** `HH:MM` */
  start_time: string;
  status: CalendarAppointmentStatus;
}

/** One column of the calendar grid. */
export interface CalendarBarberColumn {
  appointments: CalendarAppointment[];
  barber: CalendarBarber;
  breaks: CalendarBarberBreak[];
  shifts: CalendarBarberShift[];
  time_off: CalendarBarberTimeOff[];
}

export interface BookingCalendarViewData {
  barbers: CalendarBarberColumn[];
  business_hours: CalendarBusinessHours;
  /** `YYYY-MM-DD` echoed back by the API. */
  date: string;
  shop: CalendarShop;
}

export interface BookingCalendarViewResponse {
  code: string;
  data: BookingCalendarViewData;
  details: string;
  status_code: number;
  success: boolean;
}

export const bookingCalendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/booking/?view_type=&shop_id=&date=&display_mode=calendar
    getBookingCalendarView: builder.query<
      BookingCalendarViewResponse,
      BookingCalendarViewParams
    >({
      query: ({
        date,
        shop_id,
        view_type = "admin",
        display_mode = "calendar",
      }) => {
        const targetDate = date || formatCalendarDate();
        return (
          `v1/booking/?view_type=${encodeURIComponent(view_type)}` +
          `&shop_id=${encodeURIComponent(String(shop_id))}` +
          `&date=${encodeURIComponent(targetDate)}` +
          `&display_mode=${display_mode}`
        );
      },
      providesTags: ["BookingCalendar"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBookingCalendarViewQuery,
  useLazyGetBookingCalendarViewQuery,
} = bookingCalendarApi;
