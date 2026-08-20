import { baseApi } from "./baseApi";

export interface ShopReview {
  count: number;
  average_rating: number;
}

export interface Shop {
  id: number;
  name: string;
  logo: string | null;
  cover_image: string | null;
  location: string | null;
  payment_gateway_enabled: boolean;
  review?: ShopReview;
}

export interface ShopDetails {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  cover_image: string | null;
  location: string | null;
  about_us: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  google_review_link: string | null;
  google_place_id: string | null;
  payment_gateway_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopService {
  id: number;
  category: number;
  shop: number;
  barbers: string[];
  name: string;
  image: string | null;
  description: string | null;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewItem {
  id: number | string;
  user_name?: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  shop: number;
  image: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BarberItem {
  id: number;
  user: string;
  user_name: string;
  shop: number;
  shop_name: string;
  specialty: string;
  is_available: boolean;
  experience_years: number;
  role: string;
  calendar_access: boolean;
  client_details_access: boolean;
  review?: {
    count: number;
    average_rating: number;
  };
  user_details?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
  };
  assigned_services?: Array<{
    id: number;
    name: string;
    price: number;
    duration_minutes: number;
  }>;
}

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
      string | number
    >({
      query: (shopId) => ({
        url: `v1/services/?shop=${shopId}`,
        method: "GET",
      }),
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
      string | number
    >({
      query: (shopId) => ({
        url: `v1/barbers/?shop=${shopId}`,
        method: "GET",
      }),
      providesTags: ["Shop"],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopDetailsQuery,
  useGetShopServicesQuery,
  useGetShopReviewsQuery,
  useGetShopGalleryQuery,
  useGetBarbersQuery,
} = shopApi;
