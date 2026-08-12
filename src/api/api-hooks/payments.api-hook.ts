import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateManualPaymentData,
  type PaymentFilters,
  type UpdateManualPaymentData,
  paymentsApi,
} from "@/api/query-list/payments.query";

export const PAYMENT_KEYS = {
  all: () => ["payments"] as const,
  manualList: (filters?: PaymentFilters) =>
    ["payments", "manual", filters] as const,
  manualDetail: (id: string | number) => ["payments", "manual", id] as const,
};

export const useManualPayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: PAYMENT_KEYS.manualList(filters),
    queryFn: () => paymentsApi.getManualPayments(filters),
  });
};

export const useManualPaymentDetail = (id?: string | number) => {
  return useQuery({
    queryKey: PAYMENT_KEYS.manualDetail(id ?? "unknown"),
    queryFn: () => paymentsApi.getManualPaymentById(id!),
    enabled: !!id,
  });
};

export const useExportPayments = () => {
  return useMutation({
    mutationFn: (filters?: PaymentFilters) =>
      paymentsApi.exportPayments(filters),
  });
};

export const useCreateManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateManualPaymentData) =>
      paymentsApi.createManualPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all() });
    },
  });
};

export const useUpdateManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateManualPaymentData) =>
      paymentsApi.updateManualPayment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_KEYS.manualDetail(variables.id),
      });
    },
  });
};

export const useDeleteManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => paymentsApi.deleteManualPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all() });
    },
  });
};
