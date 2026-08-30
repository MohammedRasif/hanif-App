export type AppointmentStatus =
  "completed" | "confirmed" | "pending" | "reservation";

export interface Barber {
  avatar: string;
  id: string;
  name: string;
  workingHours: string;
}

export interface Appointment {
  appointmentId?: number | string;
  barberAvatar?: string;
  barberId: string;
  barberName: string;
  bgColor: string; // Hex or CSS color string (e.g. #FFFDE7, #EBF5FF, #F3F4F6)
  bookingId?: number | string;
  cardType: "appointment" | "reservation";
  durationMinutes: number;
  endTime: string; // ISO string e.g. 2026-07-18T10:40:00
  id: string;
  price?: string;
  /** Untouched status from the API (e.g. "in_progress"), before UI mapping. */
  rawStatus?: string;
  serviceName: string;
  startTime: string; // ISO string e.g. 2026-07-18T09:00:00
  status?: AppointmentStatus;
  subTitle?: string;
  timeDisplay: string; // e.g. "09:00 – 10:40"
  userName?: string;
}

export type CalendarBlockKind = "break" | "closed" | "time-off";

/**
 * A non-bookable slice of the timeline: a barber break, a shop-wide break, or a
 * closure/time-off window.
 */
export interface CalendarBlock {
  /** `null` when the block is shop-wide and covers every barber column. */
  barberId: null | string;
  endTime: string; // ISO string e.g. 2026-07-18T14:00:00
  id: string;
  kind: CalendarBlockKind;
  label: string; // e.g. "Lunch Break"
  startTime: string; // ISO string e.g. 2026-07-18T13:00:00
  timeDisplay: string; // e.g. "13:00 – 14:00"
}

export interface DayItem {
  date: Date;
  dateNumber: number;
  dayName: string; // e.g. "Mon"
  fullDateStr: string; // YYYY-MM-DD
}

export interface CalendarProps {
  activeDateStr?: string;
  appointments?: Appointment[];
  barbers?: Barber[];
  blocks?: CalendarBlock[];
  children?: React.ReactNode;
  columnWidth?: number;
  days?: DayItem[];
  endHour?: number;
  hourHeight?: number;
  onPressAppointment?: (appointment: Appointment) => void;
  onPressFab?: () => void;
  onPressFilter?: () => void;
  onPressListView?: () => void;
  onSelectDate?: (day: DayItem) => void;
  renderEventCard?: (appointment: Appointment) => React.ReactNode;
  renderFab?: () => React.ReactNode;
  showFab?: boolean;
  startHour?: number;
  workingHoursLabel?: string;
}
