import { baseApi } from "./baseApi";
import type {
  BarberItem,
  BookingItem,
  GalleryItem,
  ReviewItem,
  Shop,
  ShopDetails,
  ShopService,
} from "./shop.types";

export * from "./shop.types";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => ({
        url: "v1/shops/",
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    getShopDetails: builder.query<
      { success: boolean; data: ShopDetails },
      string | number
    >({
      query: (id) => ({
        url: `v1/shops/${id}/`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    getShopServices: builder.query<
      { success: boolean; data: ShopService[] },
      { shop?: string | number; barber?: string | number } | string | number
    >({
      query: (params) => {
        if (typeof params === "object" && params !== null) {
          const queryParts: string[] = [];
          if (params.shop) queryParts.push(`shop=${params.shop}`);
          if (params.barber) queryParts.push(`barber=${params.barber}`);
          return {
            url: `v1/services/?${queryParts.join("&")}`,
            method: "GET",
          };
        }
        return {
          url: `v1/services/?shop=${params}`,
          method: "GET",
        };
      },
      providesTags: ["Shop"],
    }),

    getShopReviews: builder.query<
      { success: boolean; data: ReviewItem[] },
      string | number
    >({
      query: (shopId) => ({
        url: `v1/bookings/reviews/?shop_id=${shopId}`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    getShopGallery: builder.query<
      { success: boolean; data: GalleryItem[] },
      string | number
    >({
      query: (shopId) => ({
        url: `v1/shops/gallery/${shopId}`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    getBarbers: builder.query<
      { success: boolean; data: BarberItem[] },
      { shop?: string | number; service?: string | number } | string | number
    >({
      query: (params) => {
        if (typeof params === "object" && params !== null) {
          const queryParts: string[] = [];
          if (params.shop) queryParts.push(`shop=${params.shop}`);
          if (params.service) queryParts.push(`service=${params.service}`);
          return {
            url: `v1/barbers/?${queryParts.join("&")}`,
            method: "GET",
          };
        }
        return {
          url: `v1/barbers/?shop=${params}`,
          method: "GET",
        };
      },
      providesTags: ["Shop"],
    }),

    getAvailableSlots: builder.query<
      { success: boolean; data: any },
      { barber_id: string | number; date: string; services: string | number }
    >({
      query: ({ barber_id, date, services }) => ({
        url: `v1/bookings/available-slots/?barber_id=${barber_id}&date=${date}&services=${services}`,
        method: "GET",
      }),
    }),

    createBooking: builder.mutation<
      {
        success: boolean;
        status_code?: number;
        data?: any;
        details?: string;
        message?: string;
      },
      {
        shop: number;
        barber: number | string;
        services: number[];
        appointment_date: string;
        start_time: string;
        payment_method: string;
        tip_amount: number;
      }
    >({
      query: (body) => ({
        url: "v1/bookings/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shop"],
    }),

    // Get Bookings List (upcoming or past)
    getBookings: builder.query<
      { success: boolean; data: BookingItem[] },
      "upcoming" | "past" | string
    >({
      query: (type = "upcoming") => ({
        url: `v1/booking/?type=${type}`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),

    // Cancel Booking by ID
    cancelBooking: builder.mutation<
      { success: boolean; details?: string; message?: string },
      string | number
    >({
      query: (id) => ({
        url: `v1/bookings/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: ["Shop"],
    }),

    // Update / Reschedule Booking by ID
    updateBooking: builder.mutation<
      { success: boolean; data?: any; message?: string },
      { id: string | number; data: Partial<BookingItem> | Record<string, any> }
    >({
      query: ({ id, data }) => ({
        url: `v1/bookings/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shop"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetShopsQuery,
  useGetShopDetailsQuery,
  useGetShopServicesQuery,
  useGetShopReviewsQuery,
  useGetShopGalleryQuery,
  useGetBarbersQuery,
  useGetAvailableSlotsQuery,
  useCreateBookingMutation,
  useGetBookingsQuery,
  useCancelBookingMutation,
  useUpdateBookingMutation,
} = shopApi;
