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
      query: (shopId) => `v1/shops/gallery/?shop=${shopId}`,
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
    // Select Active Shop: POST /v1/shops/select/
    selectShop: builder.mutation<
      { success?: boolean; code?: string; details?: string },
      { shop: number | string }
    >({
      query: (body) => ({
        url: "v1/shops/select/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shop", "Dashboard"],
    }),

    // Create New Shop: POST /v1/shops/
    createShop: builder.mutation<
      { success?: boolean; code?: string; details?: string; data?: any },
      { location: string; name: string }
    >({
      query: (body) => ({
        url: "v1/shops/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shop"],
    }),

    // Create Category: POST /v1/categories/
    createCategory: builder.mutation<
      { success?: boolean; code?: string; details?: string; data?: any },
      {
        display_order?: number;
        is_active?: boolean;
        name: string;
        shop: number | string;
      }
    >({
      query: (body) => ({
        url: "v1/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shop"],
    }),

    // Get Categories by Shop: GET /v1/categories/?shop=<shop_id>
    getCategoriesByShop: builder.query<
      { code?: string; data: any[]; details?: string; success?: boolean },
      number | string
    >({
      query: (shopId) => `v1/categories/?shop=${shopId}`,
      providesTags: ["Shop"],
    }),

    // Get Barber Options by Shop: GET /v1/barbers/by-shop/?shop=<shop_id>
    getBarberOptionsByShop: builder.query<
      {
        code?: string;
        data: { id: number | string; name: string }[];
        details?: string;
        success?: boolean;
      },
      number | string
    >({
      query: (shopId) => `v1/barbers/by-shop/?shop=${shopId}`,
      providesTags: ["Shop"],
    }),

    // Create Service: POST /v1/services/
    createService: builder.mutation<
      { code?: string; data?: any; details?: string; success?: boolean },
      {
        barbers: (number | string)[];
        category: number | string;
        description?: string;
        duration_minutes: number;
        image?: any;
        is_active?: boolean;
        name: string;
        price: string;
        shop: number | string;
      }
    >({
      query: (body) => ({
        url: "v1/services/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shop"],
    }),

    // Update Service: PUT /v1/services/:id/
    updateService: builder.mutation<
      { code?: string; data?: any; details?: string; success?: boolean },
      {
        id: number | string;
        data: Partial<{
          barbers: (number | string)[];
          category: number | string;
          description?: string;
          duration_minutes: number;
          image?: any;
          is_active?: boolean;
          name: string;
          price: string;
          shop: number | string;
        }>;
      }
    >({
      query: ({ id, data }) => ({
        url: `v1/services/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shop"],
    }),

    // Get Barbers List by Shop: GET /v1/barbers/?shop_id={shop_id}
    getBarbersByShop: builder.query<
      { code?: string; data: any[]; details?: string; success?: boolean },
      number | string
    >({
      query: (shopId) => {
        console.log(`[RTK QUERY HIT] GET v1/barbers/?shop=${shopId}`);
        return `v1/barbers/?shop=${shopId}`;
      },
      providesTags: ["Shop"],
    }),

    // Create Barber: POST /v1/barbers/
    createBarber: builder.mutation<
      { code?: string; data?: any; details?: string; success?: boolean },
      FormData | Record<string, any>
    >({
      query: (body) => {
        console.log(
          `[RTK QUERY HIT] POST v1/barbers/ Body:`,
          JSON.stringify(body, null, 2),
        );
        return {
          url: "v1/barbers/",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Shop"],
    }),

    // Update Barber: PUT /v1/barbers/:id/
    updateBarber: builder.mutation<
      { code?: string; data?: any; details?: string; success?: boolean },
      { id: number | string; data: FormData | Record<string, any> }
    >({
      query: ({ id, data }) => {
        console.log(
          `[RTK QUERY HIT] PUT v1/barbers/${id}/ Body:`,
          JSON.stringify(data, null, 2),
        );
        return {
          url: `v1/barbers/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Shop"],
    }),

    // Delete Barber: DELETE /v1/barbers/:id/
    deleteBarber: builder.mutation<
      { code?: string; details?: string; success?: boolean },
      number | string
    >({
      query: (id) => {
        console.log(`[RTK QUERY HIT] DELETE v1/barbers/${id}/`);
        return {
          url: `v1/barbers/${id}/`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Shop"],
    }),

    // Update Shop Details: PUT /v1/shops/:id/
    updateShopDetails: builder.mutation<
      { code?: string; data?: any; details?: string; success?: boolean },
      { id: number | string; data: FormData | Record<string, any> }
    >({
      query: ({ id, data }) => {
        console.log(
          `[RTK QUERY HIT] PUT v1/shops/${id}/ Body:`,
          JSON.stringify(data, null, 2),
        );
        return {
          url: `v1/shops/${id}/`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Shop"],
    }),

    // Update Shop Gallery Image: PUT /v1/shops/gallery/:id/
    updateShopGallery: builder.mutation<
      {
        code?: string;
        data?: any;
        details?: string;
        success?: boolean;
      },
      {
        id: number | string;
        data: FormData | Record<string, any>;
      }
    >({
      query: ({ id, data }) => {
        console.log(
          `[RTK QUERY HIT] PUT v1/shops/gallery/${id}/ Body:`,
          JSON.stringify(data, null, 2),
        );
        return {
          url: `v1/shops/gallery/${id}/`,
          method: "PUT",
          body: data,
        };
      },
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
  useSelectShopMutation,
  useCreateShopMutation,
  useCreateCategoryMutation,
  useGetCategoriesByShopQuery,
  useGetBarberOptionsByShopQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetBarbersByShopQuery,
  useCreateBarberMutation,
  useUpdateBarberMutation,
  useDeleteBarberMutation,
  useUpdateShopDetailsMutation,
  useUpdateShopGalleryMutation,
} = shopApi;
