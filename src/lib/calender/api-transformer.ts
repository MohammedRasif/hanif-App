import type {
  ApiBarberGroup,
  ApiBookingItem,
} from "@/Redux/feature/bookingApi";
import type {
  BookingCalendarViewData,
  BookingListViewDay,
  CalendarAppointmentStatus,
} from "@/Redux/feature/bookingCalendarApi";
import { formatCalendarDate } from "@/Redux/feature/bookingCalendarApi";
import type {
  BookingGroup,
  BookingListItem,
} from "@/components/booking-management-calender/booking-list-view";
import {
  clampMinutes,
  minutesToClockLabel,
  minutesToIsoDateTime,
  minutesToShortTime,
  timeToMinutes,
} from "./date-utils";
import type {
  Appointment,
  AppointmentStatus,
  Barber,
  CalendarBlock,
  CalendarBlockKind,
} from "./types";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

// Grid bounds used when the API does not report business hours.
const DEFAULT_START_HOUR = 7;
const DEFAULT_END_HOUR = 19;

const COLOR_COMPLETED = "#FFFDE7";
const COLOR_SCHEDULED = "#EBF5FF";
const COLOR_MUTED = "#F3F4F6";

/** Everything the calendar screen needs for one day, derived from the API payload. */
export interface BookingCalendarViewModel {
  appointments: Appointment[];
  barbers: Barber[];
  blocks: CalendarBlock[];
  dateStr: string;
  endHour: number;
  shopName: string;
  startHour: number;
  workingHoursLabel: string;
}

function mapAppointmentStatus(status?: CalendarAppointmentStatus): {
  bgColor: string;
  status: AppointmentStatus;
} {
  switch (status) {
    case "completed":
      return { bgColor: COLOR_COMPLETED, status: "completed" };
    case "cancelled":
    case "no_show":
      return { bgColor: COLOR_MUTED, status: "pending" };
    case "pending":
      return { bgColor: COLOR_SCHEDULED, status: "pending" };
    default:
      return { bgColor: COLOR_SCHEDULED, status: "confirmed" };
  }
}

/** Working-hours label for a barber column header, e.g. `09:00–21:00`. */
function buildShiftLabel(shifts: { end_time: string; start_time: string }[]) {
  const starts = shifts
    .map((shift) => timeToMinutes(shift.start_time))
    .filter((value): value is number => value !== null);
  const ends = shifts
    .map((shift) => timeToMinutes(shift.end_time))
    .filter((value): value is number => value !== null);

  if (starts.length === 0 || ends.length === 0) {
    return "Off today";
  }
  return `${minutesToShortTime(Math.min(...starts))}–${minutesToShortTime(
    Math.max(...ends),
  )}`;
}

/**
 * Transforms the `display_mode=calendar` payload into the props the calendar grid
 * consumes: barber columns, appointment cards, and the break / time-off blocks.
 *
 * `selectedDateStr` wins over the echoed `data.date` so the grid keeps rendering the
 * date the user picked while a refetch is still in flight.
 */
export function transformBookingCalendarView(
  data?: BookingCalendarViewData,
  selectedDateStr?: string,
): BookingCalendarViewModel {
  const dateStr = selectedDateStr || data?.date || formatCalendarDate();
  const businessHours = data?.business_hours;

  const openMinutes = timeToMinutes(businessHours?.open_time);
  const closeMinutes = timeToMinutes(businessHours?.close_time);

  const startHour =
    openMinutes === null ? DEFAULT_START_HOUR : Math.floor(openMinutes / 60);
  const endHour = Math.max(
    closeMinutes === null ? DEFAULT_END_HOUR : Math.ceil(closeMinutes / 60) - 1,
    startHour + 1,
  );

  // The grid draws a full row for `endHour`, so it spans up to `endHour + 1`.
  const gridStart = startHour * 60;
  const gridEnd = (endHour + 1) * 60;

  const barbers: Barber[] = [];
  const appointments: Appointment[] = [];
  const blocks: CalendarBlock[] = [];

  const pushBlock = (
    id: string,
    barberId: null | string,
    kind: CalendarBlockKind,
    label: string,
    startTime?: null | string,
    endTime?: null | string,
  ) => {
    const from = clampMinutes(
      timeToMinutes(startTime) ?? gridStart,
      gridStart,
      gridEnd,
    );
    const to = clampMinutes(
      timeToMinutes(endTime) ?? gridEnd,
      gridStart,
      gridEnd,
    );
    if (to <= from) {
      return;
    }
    blocks.push({
      barberId,
      endTime: minutesToIsoDateTime(dateStr, to),
      id,
      kind,
      label,
      startTime: minutesToIsoDateTime(dateStr, from),
      timeDisplay: `${minutesToShortTime(from)} – ${minutesToShortTime(to)}`,
    });
  };

  // Shop-wide closure / time off spans every barber column.
  if (businessHours?.is_closed || businessHours?.time_off?.is_off) {
    pushBlock(
      "shop-closed",
      null,
      "closed",
      businessHours?.is_closed ? "Shop closed" : "Shop time off",
      businessHours?.time_off?.start_time ?? businessHours?.open_time,
      businessHours?.time_off?.end_time ?? businessHours?.close_time,
    );
  }

  // Shop-wide breaks (business_hours.breaks) also span every barber column.
  for (const shopBreak of businessHours?.breaks ?? []) {
    pushBlock(
      `shop-break-${shopBreak.id}`,
      null,
      "break",
      "Shop break",
      shopBreak.start_time,
      shopBreak.end_time,
    );
  }

  (data?.barbers ?? []).forEach((column, index) => {
    const barberId = String(column.barber?.id ?? `barber-${index + 1}`);
    const barberName = column.barber?.name || `Barber ${index + 1}`;
    const avatar =
      column.barber?.avatar || column.barber?.image || FALLBACK_AVATAR;

    barbers.push({
      avatar,
      id: barberId,
      name: barberName,
      workingHours: buildShiftLabel(column.shifts ?? []),
    });

    for (const appointment of column.appointments ?? []) {
      const startMinutes = timeToMinutes(appointment.start_time);
      const endMinutes = timeToMinutes(appointment.end_time);
      if (startMinutes === null || endMinutes === null) {
        continue;
      }

      const { bgColor, status } = mapAppointmentStatus(appointment.status);

      appointments.push({
        appointmentId: appointment.appointment_id,
        barberAvatar: avatar,
        barberId,
        barberName,
        bgColor,
        bookingId: appointment.booking_id,
        cardType: "appointment",
        durationMinutes: Math.max(endMinutes - startMinutes, 0),
        endTime: minutesToIsoDateTime(dateStr, endMinutes),
        id: String(appointment.appointment_id ?? appointment.booking_id),
        rawStatus: appointment.status,
        serviceName: appointment.service_name || "Service",
        startTime: minutesToIsoDateTime(dateStr, startMinutes),
        status,
        timeDisplay: `${minutesToShortTime(startMinutes)} – ${minutesToShortTime(
          endMinutes,
        )}`,
        userName: appointment.customer_name || "Customer",
      });
    }

    // Per-barber breaks (e.g. lunch) only block that barber's column.
    for (const barberBreak of column.breaks ?? []) {
      pushBlock(
        `barber-${barberId}-break-${barberBreak.id}`,
        barberId,
        "break",
        barberBreak.title || "Break",
        barberBreak.start_time,
        barberBreak.end_time,
      );
    }

    for (const timeOff of column.time_off ?? []) {
      const isFullDay =
        timeOff.is_full_day || !(timeOff.start_time || timeOff.end_time);
      pushBlock(
        `barber-${barberId}-time-off-${timeOff.id}`,
        barberId,
        "time-off",
        timeOff.title || timeOff.reason || "Time off",
        isFullDay ? null : timeOff.start_time,
        isFullDay ? null : timeOff.end_time,
      );
    }
  });

  let workingHoursLabel = "";
  if (businessHours?.is_closed) {
    workingHoursLabel = "Closed today";
  } else if (openMinutes !== null && closeMinutes !== null) {
    workingHoursLabel = `${minutesToClockLabel(
      openMinutes,
      false,
    )} - ${minutesToClockLabel(closeMinutes)}`;
  }

  return {
    appointments,
    barbers,
    blocks,
    dateStr,
    endHour,
    shopName: data?.shop?.name ?? "",
    startHour,
    workingHoursLabel,
  };
}

/* -------------------------------------------------------------------------- */
/*  List view (`display_mode=list`)                                           */
/* -------------------------------------------------------------------------- */

/** `Wed, 26 August` — the exact label format the list-view API returns. */
function formatListDayLabel(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${`${date.getDate()}`.padStart(2, "0")} ${month}`;
}

/** `09:00:00` + `18:00:00` -> `9.00 - 6.00 pm`, matching the calendar header. */
function buildShopHoursLabel(
  startTime?: null | string,
  endTime?: null | string,
): string {
  const open = timeToMinutes(startTime);
  const close = timeToMinutes(endTime);
  if (open === null || close === null) {
    return "";
  }
  return `${minutesToClockLabel(open, false)} - ${minutesToClockLabel(close)}`;
}

function formatMoney(value?: null | number | string): string {
  const amount = Number(value ?? 0);
  return `$${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

function formatListDuration(minutes: number): string {
  if (minutes <= 0) {
    return "—";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins} min`;
  }
  return mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Card",
  cash: "Cash",
  online: "Online",
};

/**
 * Transforms the `display_mode=list` payload into the day sections the list view
 * renders. The API pre-formats `date` (e.g. `Wed, 26 August`), so today's section
 * is detected by rebuilding that same label locally.
 */
export function transformBookingListView(
  days: BookingListViewDay[] = [],
): BookingGroup[] {
  const todayLabel = formatListDayLabel(new Date());

  return days.map((day) => {
    const items: BookingListItem[] = (day.appointments ?? []).map((booking) => {
      const details = booking.appointments_details ?? [];
      const first = details[0];
      const last = details[details.length - 1];

      // A booking can hold several services — bill the whole span as one row
      const durationMinutes = details.reduce((total, detail) => {
        const start = timeToMinutes(detail.start_time);
        const end = timeToMinutes(detail.end_time);
        if (start === null || end === null || end <= start) {
          return total;
        }
        return total + (end - start);
      }, 0);

      const startMinutes = timeToMinutes(first?.start_time);
      const endMinutes = timeToMinutes(last?.end_time);
      const method = (booking.payment_method ?? "").toLowerCase();

      return {
        amount: formatMoney(booking.total_amount),
        barberId:
          first?.barber_id === undefined ? undefined : String(first.barber_id),
        barberName: first?.barber?.name || undefined,
        bookingId: booking.id,
        duration: formatListDuration(durationMinutes),
        durationMinutes,
        id: String(booking.id),
        paymentMethod:
          PAYMENT_METHOD_LABELS[method] || booking.payment_method || "",
        // The list payload carries the customer id only, never a name
        serviceName:
          details
            .map((detail) => detail.service_name)
            .filter(Boolean)
            .join(", ") || "Service",
        status: booking.status ? String(booking.status) : "",
        timeLabel:
          startMinutes === null || endMinutes === null
            ? ""
            : `${minutesToShortTime(startMinutes)} – ${minutesToShortTime(
                endMinutes,
              )}`,
        title: booking.booking_code || `Booking #${booking.id}`,
      };
    });

    return {
      appointmentCount: day.appointment_count ?? items.length,
      dateTitle: day.date === todayLabel ? "Today" : day.date || "",
      isToday: day.date === todayLabel,
      items,
      newClientCount: day.new_client_count ?? 0,
      totalValue: formatMoney(day.total_ammount),
      workingHours: buildShopHoursLabel(day.shop_start_time, day.shop_end_time),
    };
  });
}

/**
 * Transforms Calendar API data into Barber[] and Appointment[] for CustomCalendar
 */ export function transformCalendarApiData(
  groups: ApiBarberGroup[] = [],
  dateStr?: string,
): { appointments: Appointment[]; barbers: Barber[] } {
  const activeDate = dateStr || new Date().toISOString().split("T")[0];
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return { barbers: [], appointments: [] };
  }

  const barbers: Barber[] = [];
  const appointments: Appointment[] = [];

  groups.forEach((group, index) => {
    const barberId = String(group.barber.id || `barber-${index + 1}`);
    const barberName = group.barber.name || `Barber ${index + 1}`;
    const avatar =
      group.barber.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

    barbers.push({
      id: barberId,
      name: barberName,
      avatar,
      workingHours: "09:00–18:00",
    });

    if (group.appointments && Array.isArray(group.appointments)) {
      group.appointments.forEach((appt) => {
        const startTimeClean = appt.start_time.includes(":")
          ? appt.start_time.split(":").length === 2
            ? `${appt.start_time}:00`
            : appt.start_time
          : `${appt.start_time}:00:00`;

        const endTimeClean = appt.end_time.includes(":")
          ? appt.end_time.split(":").length === 2
            ? `${appt.end_time}:00`
            : appt.end_time
          : `${appt.end_time}:00:00`;

        const fullStartIso = `${activeDate}T${startTimeClean}`;
        const fullEndIso = `${activeDate}T${endTimeClean}`;

        const isCompleted =
          appt.status === "completed" || appt.status === "confirmed";

        appointments.push({
          id: String(appt.appointment_id || appt.booking_id || Math.random()),
          barberId,
          barberName,
          startTime: fullStartIso,
          endTime: fullEndIso,
          timeDisplay: `${appt.start_time} – ${appt.end_time}`,
          userName: appt.customer_name || "Customer",
          serviceName: appt.service_name || "Service",
          cardType: "appointment",
          status: isCompleted ? "completed" : "pending",
          bgColor: isCompleted ? "#FFFDE7" : "#EBF5FF",
          durationMinutes: 45,
          price: "$12.00",
          bookingId: appt.booking_id,
        } as any);
      });
    }
  });

  return { barbers, appointments };
}

/**
 * Transforms List View API Data into BookingGroup[] format matching Screenshot 1
 */
export function transformListApiData(
  apiData: {
    bookings: ApiBookingItem[];
    metrics: {
      appointment_count: number;
      new_client_count: number;
      total_value: number;
    };
  },
  _dateStr?: string,
): BookingGroup[] {
  if (!apiData) return [];

  const metrics = apiData.metrics || {
    total_value: 0,
    appointment_count: 0,
    new_client_count: 0,
  };

  const bookings = apiData.bookings || [];

  const items: BookingListItem[] = bookings.map((b, idx) => {
    const detail = b.appointments_details?.[0];
    const serviceName = detail?.service_name || "Hair cut";
    const amount = `$${b.total_amount || "12.00"}`;

    return {
      id: String(b.id || idx + 1),
      title: "Walk in clint",
      serviceName,
      amount,
      duration: "40 min",
    };
  });

  return [
    {
      dateTitle: "Today",
      isToday: true,
      workingHours: "9.00 - 6.00 pm",
      totalValue: `$${metrics.total_value?.toFixed(2) || "0.00"}`,
      appointmentCount: metrics.appointment_count || 0,
      newClientCount: metrics.new_client_count || 0,
      items,
    },
  ];
}
