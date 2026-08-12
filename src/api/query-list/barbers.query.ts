import { kyClient } from "@/lib/ky";

export interface Barber {
  id: string | number;
  name: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  rating?: number;
  review_count?: number;
  shop_id?: string | number;
  is_available?: boolean;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BarberFilters {
  shop_id?: string | number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface BarberListResponse {
  count: number;
  results: Barber[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateBarberData {
  name: string;
  shop_id?: string | number;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  phone?: string;
  email?: string;
}

export interface UpdateBarberData {
  id: string | number;
  name?: string;
  shop_id?: string | number;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  phone?: string;
  email?: string;
  is_available?: boolean;
}

export const barbersApi = {
  getAll: (filters?: BarberFilters) =>
    kyClient
      .get("v1/barbers/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<BarberListResponse>(),

  getById: (id: string | number) =>
    kyClient.get(`v1/barbers/${id}/`).json<Barber>(),

  create: (data: CreateBarberData) =>
    kyClient.post("v1/barbers/", { json: data }).json<Barber>(),

  update: ({ id, ...data }: UpdateBarberData) =>
    kyClient.put(`v1/barbers/${id}/`, { json: data }).json<Barber>(),

  remove: (id: string | number) =>
    kyClient.delete(`v1/barbers/${id}/`).json<void>(),
};
