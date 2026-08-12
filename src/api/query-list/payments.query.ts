import { kyClient } from "@/lib/ky";

export interface ManualPayment {
  id?: string | number;
  amount: number;
  currency?: string;
  payment_method?: string;
  notes?: string;
  booking_id?: string | number;
  status?: string;
  created_at?: string;
}

export interface PaymentFilters {
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface ManualPaymentListResponse {
  count: number;
  results: ManualPayment[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateManualPaymentData {
  amount: number;
  currency?: string;
  payment_method?: string;
  notes?: string;
  booking_id?: string | number;
}

export interface UpdateManualPaymentData {
  id: string | number;
  amount?: number;
  payment_method?: string;
  notes?: string;
  status?: string;
}

export const paymentsApi = {
  exportPayments: (filters?: PaymentFilters) =>
    kyClient
      .get("v1/payments/export/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<{ download_url: string }>(),

  getManualPayments: (filters?: PaymentFilters) =>
    kyClient
      .get("v1/payments/manual/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<ManualPaymentListResponse>(),

  getManualPaymentById: (id: string | number) =>
    kyClient.get(`v1/payments/manual/${id}/`).json<ManualPayment>(),

  createManualPayment: (data: CreateManualPaymentData) =>
    kyClient.post("v1/payments/manual/", { json: data }).json<ManualPayment>(),

  updateManualPayment: ({ id, ...data }: UpdateManualPaymentData) =>
    kyClient
      .patch(`v1/payments/manual/${id}/`, { json: data })
      .json<ManualPayment>(),

  deleteManualPayment: (id: string | number) =>
    kyClient.delete(`v1/payments/manual/${id}/`).json<void>(),

  revenuecatWebhook: (payload: Record<string, unknown>) =>
    kyClient
      .post("v1/payments/webhook/revenuecat/", { json: payload })
      .json<void>(),
};
