import { baseApi } from "./baseApi";

export interface ApiAppointmentItem {
  appointment_id: number | string;
  booking_id: number | string;
  customer_name: string;
  end_time: string;
  service_name: string;
  start_time: string;
  status: string;
}

export interface ApiBarberGroup {
  appointments: ApiAppointmentItem[];
  barber: {
    avatar?: string | null;
    id: number | string;
    name: string;
  };
}

export interface CalendarViewApiResponse {
  code: string;
  data: ApiBarberGroup[];
  details: string;
  status: boolean;
}

export interface ApiBookingDetailItem {
  appointment_date: string;
  barber_id?: number | string;
  end_time: string;
  id: number | string;
  service_id?: number | string;
  service_name: string;
  start_time: string;
}

export interface ApiBookingItem {
  appointments_details: ApiBookingDetailItem[];
  booking_code: string;
  created_at: string;
  customer: string;
  id: number | string;
  payment_method: string;
  payment_status: string;
  shop: number;
  shop_details?: {
    location?: string;
    name: string;
    phone?: string;
  };
  status: string;
  tip_amount: string;
  total_amount: string;
  updated_at: string;
}

export interface ListViewApiResponse {
  code: string;
  data: {
    bookings: ApiBookingItem[];
    metrics: {
      appointment_count: number;
      new_client_count: number;
      total_value: number;
    };
  };
  details: string;
  status: boolean;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Shared Endpoint: GET /v1/booking/ (Supports both display_mode=calendar and display_mode=list)
    getBookingData: builder.query<
      any,
      {
        date?: string;
        display_mode?: "calendar" | "list";
        shop_id?: number | string;
        view_type?: "admin" | "staff" | string;
      }
    >({
      query: ({
        date,
        display_mode = "calendar",
        shop_id = 1,
        view_type = "admin",
      }) => {
        const formattedDate = date || new Date().toISOString().split("T")[0];
        return `v1/booking/?view_type=${view_type}&display_mode=${display_mode}&shop_id=${shop_id}&date=${formattedDate}`;
      },
      providesTags: ["Booking"],
    }),

    // Available Time Slots: GET /v1/bookings/available-slots/
    getAvailableSlots: builder.query<
      { code: string; data: string[]; details: string; status: boolean },
      { barber_id: number | string; date: string; services: string }
    >({
      query: ({ barber_id, date, services }) =>
        `v1/bookings/available-slots/?barber_id=${barber_id}&date=${date}&services=${services}`,
      providesTags: ["Booking"],
    }),

    // Create New Booking: POST /v1/bookings/create/
    createBooking: builder.mutation<
      { code: string; data: any; details: string; status: boolean },
      any
    >({
      query: (body) => ({
        url: "v1/bookings/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Dashboard"],
    }),

    // Cancel Booking: POST /v1/bookings/:id/cancel/
    cancelBooking: builder.mutation<
      { code: string; data: any; details: string; status: boolean },
      { id: number | string }
    >({
      query: ({ id }) => ({
        url: `v1/bookings/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: ["Booking", "Dashboard"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBookingDataQuery,
  useGetAvailableSlotsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} = bookingApi;
