import { kyClient } from "@/lib/ky";

export interface Faq {
  id: number;
  question: string;
  answer: string;
  order?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FaqFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FaqListResponse {
  count: number;
  results: Faq[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateFaqData {
  question: string;
  answer: string;
  order?: number;
  status?: number;
}

export interface UpdateFaqData {
  id: number | string;
  question?: string;
  answer?: string;
  order?: number;
  status?: number;
}

export const faqsApi = {
  getAll: (filters?: FaqFilters) =>
    kyClient
      .get("v1/faqs/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<FaqListResponse>(),

  getById: (id: number | string) => kyClient.get(`v1/faqs/${id}/`).json<Faq>(),

  create: (data: CreateFaqData) =>
    kyClient.post("v1/faqs/", { json: data }).json<Faq>(),

  update: ({ id, ...data }: UpdateFaqData) =>
    kyClient.patch(`v1/faqs/${id}/`, { json: data }).json<Faq>(),

  remove: (id: number | string) =>
    kyClient.delete(`v1/faqs/${id}/`).json<void>(),
};
