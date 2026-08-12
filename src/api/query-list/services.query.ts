import { kyClient } from "@/lib/ky";

export interface ServiceEntity {
  id: string | number;
  name?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  shop_id?: string | number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UpdateServiceEntityData {
  id: string | number;
  name?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
  [key: string]: unknown;
}

export const servicesApi = {
  getById: (id: string | number) =>
    kyClient.get(`v1/${id}/`).json<ServiceEntity>(),

  update: ({ id, ...data }: UpdateServiceEntityData) =>
    kyClient.patch(`v1/${id}/`, { json: data }).json<ServiceEntity>(),

  remove: (id: string | number) => kyClient.delete(`v1/${id}/`).json<void>(),
};
