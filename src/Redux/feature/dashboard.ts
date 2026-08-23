import { baseApi } from "./baseApi";
import type {
  ClientsData,
  DashboardOverviewData,
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
} = dashboardApi;
