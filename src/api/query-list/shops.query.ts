import { kyClient } from "@/lib/ky";

export interface Shop {
  id: string | number;
  name: string;
  address?: string;
  city?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  description?: string;
  cover_image?: string;
  logo?: string;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ShopGalleryItem {
  id: string | number;
  shop_id?: string | number;
  image_url: string;
  caption?: string;
  order?: number;
}

export interface ShopPaymentSettings {
  shop_id?: string | number;
  accept_card?: boolean;
  accept_cash?: boolean;
  stripe_account_id?: string;
  currency?: string;
}

export interface ShopFilters {
  search?: string;
  city?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ShopListResponse {
  count: number;
  results: Shop[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateShopData {
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface UpdateShopData {
  id: string | number;
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
  cover_image?: string;
  logo?: string;
  is_active?: boolean;
}

export const shopsApi = {
  getAll: (filters?: ShopFilters) =>
    kyClient
      .get("v1/shops/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ShopListResponse>(),

  getById: (id: string | number) =>
    kyClient.get(`v1/shops/${id}/`).json<Shop>(),

  create: (data: CreateShopData) =>
    kyClient.post("v1/shops/", { json: data }).json<Shop>(),

  update: ({ id, ...data }: UpdateShopData) =>
    kyClient.put(`v1/shops/${id}/`, { json: data }).json<Shop>(),

  remove: (id: string | number) =>
    kyClient.delete(`v1/shops/${id}/`).json<void>(),

  getGallery: (shop_id?: string | number) =>
    kyClient
      .get("v1/shops/gallery/", {
        searchParams: shop_id ? { shop_id } : undefined,
      })
      .json<ShopGalleryItem[]>(),

  getGalleryItemById: (id: string | number) =>
    kyClient.get(`v1/shops/gallery/${id}/`).json<ShopGalleryItem>(),

  createGalleryItem: (data: Partial<ShopGalleryItem>) =>
    kyClient.post("v1/shops/gallery/", { json: data }).json<ShopGalleryItem>(),

  updateGalleryItem: (id: string | number, data: Partial<ShopGalleryItem>) =>
    kyClient
      .put(`v1/shops/gallery/${id}/`, { json: data })
      .json<ShopGalleryItem>(),

  removeGalleryItem: (id: string | number) =>
    kyClient.delete(`v1/shops/gallery/${id}/`).json<void>(),

  getGoogleReviews: (id: string | number) =>
    kyClient.get(`v1/shops/${id}/google-reviews/`).json<unknown[]>(),

  getPaymentSettings: (id: string | number) =>
    kyClient
      .get(`v1/shops/${id}/payment-settings/`)
      .json<ShopPaymentSettings>(),

  updatePaymentSettings: (
    id: string | number,
    data: Partial<ShopPaymentSettings>,
  ) =>
    kyClient
      .patch(`v1/shops/${id}/payment-settings/`, { json: data })
      .json<ShopPaymentSettings>(),
};
