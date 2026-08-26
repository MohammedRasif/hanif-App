import type {
  ApiBarberGroup,
  ApiBookingItem,
} from "@/Redux/feature/bookingApi";
import type {
  BookingGroup,
  BookingListItem,
} from "@/components/booking-management-calender/booking-list-view";
import type { Appointment, Barber } from "./types";

/**
 * Transforms Calendar API data into Barber[] and Appointment[] for CustomCalendar
 */
export function transformCalendarApiData(
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
      workingHours: "9.00 - 6.00 pm",
      totalValue: `$${metrics.total_value?.toFixed(2) || "0.00"}`,
      appointmentCount: metrics.appointment_count || 0,
      newClientCount: metrics.new_client_count || 0,
      items,
    },
  ];
}
