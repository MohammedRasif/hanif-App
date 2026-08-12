import { kyClient } from "@/lib/ky";

export interface Review {
  id?: string | number;
  shop_id?: string | number;
  barber_id?: string | number;
  customer_name?: string;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewFilters {
  shop_id?: string | number;
  barber_id?: string | number;
  rating?: number;
  page?: number;
  page_size?: number;
}

export interface ReviewListResponse {
  count: number;
  results: Review[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateReviewData {
  shop_id: string | number;
  barber_id?: string | number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  id: string | number;
  rating?: number;
  comment?: string;
}

export const reviewsApi = {
  getAll: (filters?: ReviewFilters) =>
    kyClient
      .get("v1/reviews/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ReviewListResponse>(),

  getById: (id: string | number) =>
    kyClient.get(`v1/reviews/${id}/`).json<Review>(),

  create: (data: CreateReviewData) =>
    kyClient.post("v1/reviews/", { json: data }).json<Review>(),

  update: ({ id, ...data }: UpdateReviewData) =>
    kyClient.put(`v1/reviews/${id}/`, { json: data }).json<Review>(),

  remove: (id: string | number) =>
    kyClient.delete(`v1/reviews/${id}/`).json<void>(),
};
