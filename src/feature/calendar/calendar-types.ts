export interface Barber {
  avatar: string;
  id: string;
  name: string;
  workingHours: string;
}

export type AppointmentStatus =
  "completed" | "confirmed" | "pending" | "reservation";

export interface Appointment {
  barberId: string;
  barberName: string;
  bgColor: string; // Hex or CSS color string
  cardType: "appointment" | "reservation";
  durationMinutes: number;
  endTime: string; // ISO string e.g. 2026-07-26T10:40:00.000Z
  id: string;
  serviceName: string;
  startTime: string; // ISO string e.g. 2026-07-26T09:00:00.000Z
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
