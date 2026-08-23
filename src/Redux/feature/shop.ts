import { baseApi } from "./baseApi";
import {
  buildBarbersUrl,
  buildServicesUrl,
  type BarberItem,
  type BookingItem,
  type GalleryItem,
  type ReviewItem,
  type Shop,
  type ShopDetails,
  type ShopService,
} from "./shop.types";

export * from "./shop.types";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => "v1/shops/",
      providesTags: ["Shop"],
    }),

    getShopDetails: builder.query<
      { success: boolean; data: ShopDetails },
      string | number
    >({
      query: (id) => `v1/shops/${id}/`,
      providesTags: ["Shop"],
    }),

    getShopServices: builder.query<
      { success: boolean; data: ShopService[] },
      { shop?: string | number; barber?: string | number } | string | number
    >({
      query: (params) => buildServicesUrl(params),
      providesTags: ["Shop"],
    }),

    getShopReviews: builder.query<
      { success: boolean; data: ReviewItem[] },
      string | number
    >({
      query: (shopId) => `v1/bookings/reviews/?shop_id=${shopId}`,
      providesTags: ["Shop"],
    }),

    getShopGallery: builder.query<
      { success: boolean; data: GalleryItem[] },
      string | number
    >({
      query: (shopId) => `v1/shops/gallery/${shopId}`,
      providesTags: ["Shop"],
    }),

    getBarbers: builder.query<
      { success: boolean; data: BarberItem[] },
      { shop?: string | number; service?: string | number } | string | number
    >({
      query: (params) => buildBarbersUrl(params),
      providesTags: ["Shop"],
    }),

    getAvailableSlots: builder.query<
      { success: boolean; data: any },
      { barber_id: string | number; date: string; services: string | number }
    >({
      query: ({ barber_id, date, services }) =>
        `v1/bookings/available-slots/?barber_id=${barber_id}&date=${date}&services=${services}`,
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

    getBookings: builder.query<
      { success: boolean; data: BookingItem[] },
      "upcoming" | "past" | string
    >({
      query: (type = "upcoming") => `v1/booking/?type=${type}`,
      providesTags: ["Shop"],
    }),

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
