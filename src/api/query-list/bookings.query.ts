import { kyClient } from "@/lib/ky";

export interface Booking {
  id: string | number;
  shop_id: string | number;
  barber_id?: string | number;
  service_id?: string | number;
  customer_id?: string | number;
  date: string;
  start_time: string;
  end_time?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AvailableSlotFilters {
  shop_id: string | number;
  barber_id?: string | number;
  date: string;
  service_id?: string | number;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface CreateBookingData {
  shop_id: string | number;
  barber_id?: string | number;
  service_id?: string | number;
  date: string;
  start_time: string;
  notes?: string;
}

export interface UpdateBookingData {
  id: string | number;
  date?: string;
  start_time?: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
}

export interface CalendarLinkResponse {
  google_calendar_url?: string;
  ics_url?: string;
}

export const bookingsApi = {
  getAvailableSlots: (filters: AvailableSlotFilters) =>
    kyClient
      .get("v1/bookings/available-slots/", {
        searchParams: filters as unknown as Record<
          string,
          string | number | boolean
        >,
      })
      .json<AvailableSlot[]>(),

  create: (data: CreateBookingData) =>
    kyClient.post("v1/bookings/create/", { json: data }).json<Booking>(),

  update: ({ id, ...data }: UpdateBookingData) =>
    kyClient.patch(`v1/bookings/${id}/`, { json: data }).json<Booking>(),

  getCalendarLink: (id: string | number) =>
    kyClient
      .get(`v1/bookings/${id}/calendar-link/`)
      .json<CalendarLinkResponse>(),

  cancel: (id: string | number, reason?: string) =>
    kyClient
      .post(`v1/bookings/${id}/cancel/`, { json: { reason } })
      .json<Booking>(),
};
