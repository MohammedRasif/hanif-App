export type AppointmentStatus =
  "completed" | "confirmed" | "pending" | "reservation";

export interface Barber {
  avatar: string;
  id: string;
  name: string;
  workingHours: string;
}

export interface Appointment {
  barberId: string;
  barberName: string;
  bgColor: string; // Hex or CSS color string (e.g. #FFFDE7, #EBF5FF, #F3F4F6)
  cardType: "appointment" | "reservation";
  durationMinutes: number;
  endTime: string; // ISO string e.g. 2026-07-18T10:40:00
  id: string;
  serviceName: string;
  startTime: string; // ISO string e.g. 2026-07-18T09:00:00
  status?: AppointmentStatus;
  subTitle?: string;
  timeDisplay: string; // e.g. "09:00 – 10:40"
  userName?: string;
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
  children?: React.ReactNode;
  columnWidth?: number;
  days?: DayItem[];
  endHour?: number;
  hourHeight?: number;
  onPressAppointment?: (appointment: Appointment) => void;
  onPressFab?: () => void;
  onSelectDate?: (day: DayItem) => void;
  renderEventCard?: (appointment: Appointment) => React.ReactNode;
  renderFab?: () => React.ReactNode;
  showFab?: boolean;
  startHour?: number;
  workingHoursLabel?: string;
}
