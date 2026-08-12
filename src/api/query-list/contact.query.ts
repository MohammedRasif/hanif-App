import { kyClient } from "@/lib/ky";

export interface ContactMessage {
  id?: number;
  full_name: string;
  email: string;
  phone?: string;
  message: string;
  is_replied?: boolean;
  created_at?: string;
}

export interface ContactFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ContactListResponse {
  count: number;
  results: ContactMessage[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateContactData {
  full_name: string;
  email: string;
  message: string;
  phone?: string;
}

export const contactApi = {
  create: (data: CreateContactData) =>
    kyClient.post("v1/contact/", { json: data }).json<ContactMessage>(),

  getAll: (filters?: ContactFilters) =>
    kyClient
      .get("v1/contact/list/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ContactListResponse>(),
};
