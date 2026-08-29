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

/* -------------------------------------------------------------------------- */
/*  Booking details, edit, cancel, staff & service pickers                    */
/* -------------------------------------------------------------------------- */

export type BookingPaymentStatus = "failed" | "paid" | "pending" | "refunded";

export type BookingStatus =
  | "cancelled"
  | "completed"
  | "confirmed"
  | "in_progress"
  | "no_show"
  | "pending"
  | "scheduled";

/** Values the backend accepts for `payment_method` on `PATCH /v1/bookings/:id/`. */
export type BookingPaymentMethod = "cash" | "online";

export interface BookingCustomer {
  id: string;
  image: null | string;
  name: string;
}

export interface BookingDetailsShop {
  id: number | string;
  location: null | string;
  name: string;
  phone: null | string;
}

export interface BookingDetailsBarber {
  id: number | string;
  image: null | string;
  name: string;
  role: null | string;
  specialty: null | string;
}

/** Barber stub attached to each appointment row. */
export interface BookingAppointmentBarber {
  id: number | string;
  image: null | string;
  name: string;
}

/** One billable service inside an appointment. */
export interface BookingAppointmentService {
  /** `HH:MM:SS` */
  end_time: string;
  /** Row id of the service on this appointment (not the service id). */
  id: number | string;
  price: number | string;
  service_id: number | string;
  service_name: string;
  /** `HH:MM:SS` */
  start_time: string;
  status: BookingStatus | string;
}

export interface BookingAppointmentDetail {
  /** `YYYY-MM-DD` */
  appointment_date: string;
  barber: BookingAppointmentBarber | null;
  /** `HH:MM:SS` */
  end_time: string;
  id: number | string;
  services: BookingAppointmentService[];
  /** `HH:MM:SS` */
  start_time: string;
  status: BookingStatus | string;
}

/** Present only once a payment has been logged against the booking. */
export interface BookingPaymentInfo {
  amount: null | number | string;
  payment_created_at: null | string;
  payment_method: null | string;
  payment_status: null | string;
}

export interface BookingDetailsData {
  appointments_details: BookingAppointmentDetail[];
  barber: BookingDetailsBarber | null;
  booking_code: string;
  created_at: string;
  customer: BookingCustomer | null;
  discount_amount: null | number | string;
  id: number | string;
  payment_info: BookingPaymentInfo | null;
  payment_method: null | string;
  payment_status: BookingPaymentStatus | string;
  shop: BookingDetailsShop | null;
  status: BookingStatus | string;
  tip_amount?: null | number | string;
  total_amount: null | number | string;
  updated_at: string;
}

export interface BookingDetailsResponse {
  code: string;
  data: BookingDetailsData;
  details: string;
  status_code: number;
  success: boolean;
}

/** Body of `PATCH /v1/bookings/:id/` — every field is optional. */
export interface UpdateBookingPayload {
  /** `YYYY-MM-DD` */
  appointment_date?: string;
  barber?: number | string;
  /** Flat amount, never a percentage. */
  discount?: number | string;
  payment_method?: BookingPaymentMethod | string;
  services?: Array<number | string>;
  shop?: number | string;
  /** `HH:MM:SS` */
  start_time?: string;
  /** Sending `completed` marks the appointment as complete. */
  status?: BookingStatus | string;
  tip_amount?: number | string;
}

export interface UpdateBookingArgs {
  body: UpdateBookingPayload;
  id: number | string;
}

/** Shared envelope for the update and cancel mutations. */
export interface BookingMutationResponse {
  code?: string;
  data: BookingDetailsData;
  details?: string;
  status?: boolean;
  success?: boolean;
}

export interface BookingBarberAssignedService {
  duration_minutes: number;
  id: number | string;
  name: string;
  price: number | string;
}

export interface BookingBarber {
  assigned_services?: BookingBarberAssignedService[];
  calendar_access?: boolean;
  client_details_access?: boolean;
  experience_years?: number;
  id: number | string;
  is_available?: boolean;
  review?: null | { average_rating: number; count: number };
  role?: null | string;
  shop?: number | string;
  shop_name?: null | string;
  specialty?: null | string;
  user?: null | string;
  user_details?: null | {
    email: null | string;
    id: string;
    image: null | string;
    name: string;
    phone: null | string;
  };
  user_name?: null | string;
}

export interface BookingBarbersResponse {
  data: BookingBarber[];
  success?: boolean;
}

export interface BookingServiceOption {
  duration_minutes: number;
  id: number | string;
  name: string;
  price: number | string;
}

export interface BookingServicesResponse {
  data: BookingServiceOption[];
  success?: boolean;
}

export interface BookingBarbersParams {
  shop: number | string;
}

export interface BookingServicesParams {
  barber?: number | string;
  shop: number | string;
}

/* -------------------------------------------------------------------------- */
/*  Customer (Contact) Types                                                  */
/* -------------------------------------------------------------------------- */

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  image: null | string;
  address: string;
  role: string;
  status: number;
  last_active_at: string;
  date_joined: string;
}

export interface GetCustomersParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface GetCustomersResponse {
  success: boolean;
  details: string;
  code: string;
  status_code: number;
  data: Customer[];
}

export interface CreateCustomerPayload {
  full_name: string;
  email: string;
  phone: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  details: string;
  code: string;
  status_code: number;
  data: Customer;
}

/* -------------------------------------------------------------------------- */
/*  Create Booking Types                                                      */
/* -------------------------------------------------------------------------- */

export type PaymentMethod = "cash" | "card";

export interface CreateBookingPayload {
  customer_id: string;
  shop: number | string;
  barber: number | string;
  services: number[] | string[];
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  payment_method: PaymentMethod;
  tip_amount?: number | string;
}

export interface ShopDetails {
  name: string;
  location: string;
  phone: string;
}

export interface BarberDetails {
  id: number | string;
  name: string;
  image: null | string;
}

export interface AppointmentDetails {
  id: number | string;
  service_id: number | string;
  service_name: string;
  barber_id: number | string;
  barber: BarberDetails;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface CreateBookingData {
  id: number | string;
  booking_code: string;
  customer: string;
  shop: number | string;
  shop_details: ShopDetails;
  total_amount: string;
  tip_amount: string;
  discount_amount: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  appointments_details: AppointmentDetails[];
  payment_url: null | string;
}

export interface CreateBookingResponse {
  success: boolean;
  details: string;
  code: string;
  status_code: number;
  data: CreateBookingData;
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
      providesTags: ["Booking", "BookingCalendar"],
    }),

    // GET /v1/bookings/{id}/
    getBookingDetails: builder.query<BookingDetailsResponse, number | string>({
      query: (id) => `v1/bookings/${id}/`,
      providesTags: ["BookingDetails"],
    }),

    // GET /v1/barbers/?shop={shop id}
    getBookingBarbers: builder.query<
      BookingBarbersResponse,
      BookingBarbersParams
    >({
      query: ({ shop }) =>
        `v1/barbers/?shop=${encodeURIComponent(String(shop))}`,
      providesTags: ["Barbar"],
    }),

    // GET /v1/services/?barber={barber id}&shop={shop id}
    getBookingServices: builder.query<
      BookingServicesResponse,
      BookingServicesParams
    >({
      query: ({ barber, shop }) => {
        const parts = [`shop=${encodeURIComponent(String(shop))}`];
        if (barber !== undefined && barber !== null && barber !== "") {
          parts.push(`barber=${encodeURIComponent(String(barber))}`);
        }
        return `v1/services/?${parts.join("&")}`;
      },
      providesTags: ["Service"],
    }),

    // POST /v1/bookings/create/
    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingPayload
    >({
      query: (body) => ({
        url: "v1/bookings/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "BookingDetails",
        "Booking",
        "BookingCalendar",
        "Customer",
      ],

      // (result, error, { shop }) => [
      //   { type: "BookingCalendar", id: "LIST" },
      //   { type: "Booking" },
      //   { type: "Dashboard" },
      // ],
    }),

    // PATCH /v1/bookings/{id}/ — edit staff/date/time, add tip & discount, complete
    updateBookingById: builder.mutation<
      BookingMutationResponse,
      UpdateBookingArgs
    >({
      query: ({ body, id }) => ({
        url: `v1/bookings/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        "BookingDetails",
        "Booking",
        "BookingCalendar",
        "Customer",
      ],

      // (_result, _error, { id }) => [
      //   { type: "BookingDetails", id: String(id) },
      //   { type: "BookingCalendar", id: "LIST" },
      //   { type: "Booking" },
      //   { type: "Dashboard" },
      // ],
    }),

    // POST /v1/bookings/{id}/cancel/
    cancelBookingById: builder.mutation<
      BookingMutationResponse,
      number | string
    >({
      query: (id) => ({
        url: `v1/bookings/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: [
        "BookingDetails",
        "Booking",
        "BookingCalendar",
        "Customer",
      ],
      // (_result, _error, id) => [
      //   { type: "BookingDetails", id: String(id) },
      //   { type: "BookingCalendar", id: "LIST" },
      //   { type: "Booking" },
      //   { type: "Dashboard" },
      // ],
    }),

    // GET /v1/contact/list/
    getCustomers: builder.query<GetCustomersResponse, GetCustomersParams>({
      query: ({ search = "", page = 1, page_size = 20 }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("page", String(page));
        params.append("page_size", String(page_size));
        return `v1/contact/list/?${params.toString()}`;
      },
      providesTags: (result) => [
        { type: "Customer", id: "LIST" },
        ...(result?.data?.map((customer) => ({
          type: "Customer" as const,
          id: customer.id,
        })) || []),
      ],
    }),

    // POST /v1/contact/
    createCustomer: builder.mutation<
      CreateCustomerResponse,
      CreateCustomerPayload
    >({
      query: (body) => ({
        url: "v1/contact/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "BookingCalendar"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCancelBookingByIdMutation,
  useGetBookingBarbersQuery,
  useGetBookingCalendarViewQuery,
  useGetBookingDetailsQuery,
  useGetBookingServicesQuery,
  useLazyGetBookingCalendarViewQuery,
  useLazyGetBookingDetailsQuery,
  useLazyGetBookingServicesQuery,
  useUpdateBookingByIdMutation,
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useCreateCustomerMutation,
  useCreateBookingMutation,
} = bookingCalendarApi;
