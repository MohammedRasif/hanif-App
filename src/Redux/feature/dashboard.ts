import { baseApi } from "./baseApi";
import type {
  ClientsData,
  DashboardOverviewData,
  DashboardReportData,
  OpeningCalendarData,
  StaffOfferedService,
  StaffProfileSummaryData,
  StaffReportsData,
  StaffReviewsData,
  StaffScheduleShift,
  StaffShopData,
  StaffTimeOffItem,
} from "./dashboard.types";

export * from "./dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/dashboard/ Overview stats and upcoming bookings
    getDashboardOverview: builder.query<
      { success: boolean; data: DashboardOverviewData },
      { shop?: string | number } | void
    >({
      query: (params) => {
        if (params && params.shop) {
          return `v1/dashboard/?shop=${params.shop}`;
        }
        return "v1/dashboard/";
      },
      providesTags: ["Dashboard"],
    }),

    // Update Booking Status: POST /v1/dashboard/bookings/{id}/status/
    updateBookingStatus: builder.mutation<
      { success: boolean; details?: string; message?: string },
      { id: string | number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `v1/dashboard/bookings/${id}/status/`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Dashboard", "Shop"],
    }),

    // GET /v1/dashboard/clients/
    getClients: builder.query<
      { success: boolean; data: ClientsData },
      { search?: string } | void
    >({
      query: (params) => {
        if (params && params.search) {
          return `v1/dashboard/clients/?search=${encodeURIComponent(params.search)}`;
        }
        return "v1/dashboard/clients/";
      },
      providesTags: ["Dashboard"],
    }),

    // POST /v1/dashboard/clients/message/ (Group Messaging API)
    sendGroupMessage: builder.mutation<
      { success: boolean; details?: string; message?: string },
      {
        client_ids: string[];
        subject?: string;
        email_content?: string;
        sms_content?: string;
      }
    >({
      query: (body) => ({
        url: "v1/dashboard/clients/message/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // --- STAFF ME / BARBER APIS (Base URL: v1/barbers/me/) ---

    // 1. Get Profile Summary: GET v1/barbers/me/profile/
    getStaffMeProfile: builder.query<
      { success: boolean; data: StaffProfileSummaryData },
      void
    >({
      query: () => "v1/barbers/me/profile/",
      providesTags: ["Dashboard", "Profile"],
    }),

    // 2. Get Staff Shop: GET v1/barbers/me/shop/
    getStaffMeShop: builder.query<
      { success: boolean; data: StaffShopData },
      void
    >({
      query: () => "v1/barbers/me/shop/",
      providesTags: ["Dashboard", "Shop"],
    }),

    // 3. Get Offered Services: GET v1/barbers/me/services/
    getStaffMeServices: builder.query<
      { success: boolean; data: StaffOfferedService[] },
      void
    >({
      query: () => "v1/barbers/me/services/",
      providesTags: ["Dashboard"],
    }),

    // 4. Get Working Days & Hours: GET v1/barbers/me/schedule/
    getStaffMeSchedule: builder.query<
      { success: boolean; data: StaffScheduleShift[] },
      void
    >({
      query: () => "v1/barbers/me/schedule/",
      providesTags: ["Dashboard"],
    }),

    // 5. Get Break Schedule / Time Off: GET v1/barbers/me/time-off/
    getStaffMeTimeOff: builder.query<
      { success: boolean; data: StaffTimeOffItem[] },
      void
    >({
      query: () => "v1/barbers/me/time-off/",
      providesTags: ["Dashboard"],
    }),

    // 6. Get Staff Reviews: GET v1/barbers/me/reviews/
    getStaffMeReviews: builder.query<
      { success: boolean; data: StaffReviewsData },
      void
    >({
      query: () => "v1/barbers/me/reviews/",
      providesTags: ["Dashboard"],
    }),

    // 7. Get Staff Reports: GET v1/barbers/me/reports/
    getStaffMeReports: builder.query<
      { success: boolean; data: StaffReportsData },
      void
    >({
      query: () => "v1/barbers/me/reports/",
      providesTags: ["Dashboard"],
    }),

    // 8. Get Dashboard Reports: GET /v1/dashboard/reports/?period={daily|weekly|monthly}
    getDashboardReports: builder.query<
      { code?: string; data: DashboardReportData },
      { period?: "daily" | "weekly" | "monthly" } | string | void
    >({
      query: (params) => {
        const period =
          typeof params === "string" ? params : params?.period || "daily";
        return `v1/dashboard/reports/?period=${period}`;
      },
      providesTags: ["Dashboard"],
    }),

    // 9. Get Opening Calendar: GET /v1/schedule/opening-calendar/?shop={shop}&date={date}
    getOpeningCalendar: builder.query<
      {
        status?: boolean;
        code?: string;
        details?: string;
        data: OpeningCalendarData;
      },
      { shop?: string | number; date?: string } | void
    >({
      query: (params) => {
        const queryParts: string[] = [];
        if (params && params.shop) queryParts.push(`shop=${params.shop}`);
        if (params && params.date) queryParts.push(`date=${params.date}`);
        const queryString = queryParts.length ? `?${queryParts.join("&")}` : "";
        return `v1/schedule/opening-calendar/${queryString}`;
      },
      providesTags: ["Dashboard", "Shop"],
    }),

    // 10. Update Business Hours Date: PUT /v1/schedule/business-hours/{shop_id}/
    updateBusinessHoursDate: builder.mutation<
      {
        status?: boolean;
        code?: string;
        details?: string;
        data?: any;
      },
      {
        shopId: number | string;
        date: string;
        open_time: string;
        close_time: string;
        is_closed: boolean;
        breaks?: Array<{ start_time: string; end_time: string }>;
      }
    >({
      query: ({ shopId, ...body }) => ({
        url: `v1/schedule/business-hours/${shopId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Dashboard", "Shop"],
    }),

    // 11. Update Barber Schedule: PUT /v1/schedule/barber-schedule/
    updateBarberSchedule: builder.mutation<
      {
        status?: boolean;
        code?: string;
        details?: string;
        data?: any;
      },
      {
        barber: number | string;
        date: string;
        breaks?: Array<{
          start_time: string;
          end_time: string;
          title?: string;
        }>;
        time_off?: Array<{
          start_date: string;
          end_date: string;
          is_full_day: boolean;
          start_time?: string;
          end_time?: string;
          reason?: string;
        }>;
      }
    >({
      query: (body) => ({
        url: "v1/schedule/barber-schedule/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Dashboard", "Shop"],
    }),

    // 12. Create Staff Time Off: POST /v1/schedule/time-off/
    createStaffTimeOff: builder.mutation<
      {
        status?: boolean;
        code?: string;
        details?: string;
        data?: any;
      },
      {
        barber: number | string;
        start_date: string;
        end_date: string;
        is_full_day: boolean;
        start_time?: string;
        end_time?: string;
        reason?: string;
      }
    >({
      query: (body) => ({
        url: "v1/schedule/time-off/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard", "Shop"],
    }),

    // 13. Get Shop Barbers / Staff: GET /v1/barbers/?shop_id={shopId}
    getShopBarbers: builder.query<
      {
        status?: boolean;
        code?: string;
        details?: string;
        data?: any[];
      },
      number | string
    >({
      query: (shopId) => `v1/barbers/?shop_id=${shopId}/`,
      providesTags: ["Shop"],
    }),
    // 14. Create Business Days Off: POST /v1/schedule/business/off/
    createBusinessOff: builder.mutation<
      {
        success?: boolean;
        status?: boolean;
        code?: string;
        details?: string;
        data?: any;
      },
      {
        shop: number | string;
        start_date: string;
        end_date: string;
        is_full_day?: boolean;
      }
    >({
      query: (body) => ({
        url: "v1/schedule/business/off/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dashboard", "Shop"],
    }),

    // 15. Get Business Hours: GET /v1/schedule/business-hours/{shop_id}/
    getBusinessHours: builder.query<
      {
        success?: boolean;
        details?: string;
        code?: string;
        status_code?: number;
        data?: Array<{
          id: number;
          shop: number;
          day_of_week: string;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
          breaks?: Array<{
            id: number;
            start_time: string;
            end_time: string;
          }>;
        }>;
      },
      number | string
    >({
      query: (shopId) => `v1/schedule/business-hours/${shopId}/`,
      providesTags: ["Shop"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDashboardOverviewQuery,
  useUpdateBookingStatusMutation,
  useGetClientsQuery,
  useSendGroupMessageMutation,
  useGetStaffMeProfileQuery,
  useGetStaffMeShopQuery,
  useGetStaffMeServicesQuery,
  useGetStaffMeScheduleQuery,
  useGetStaffMeTimeOffQuery,
  useGetStaffMeReviewsQuery,
  useGetStaffMeReportsQuery,
  useGetDashboardReportsQuery,
  useGetOpeningCalendarQuery,
  useUpdateBusinessHoursDateMutation,
  useUpdateBarberScheduleMutation,
  useCreateStaffTimeOffMutation,
  useGetShopBarbersQuery,
  useCreateBusinessOffMutation,
  useGetBusinessHoursQuery,
} = dashboardApi;
