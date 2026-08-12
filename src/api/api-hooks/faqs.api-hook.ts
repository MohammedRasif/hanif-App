import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateFaqData,
  type FaqFilters,
  type UpdateFaqData,
  faqsApi,
} from "@/api/query-list/faqs.query";

export const FAQ_KEYS = {
  all: () => ["faqs"] as const,
  lists: (filters?: FaqFilters) => ["faqs", "list", filters] as const,
  detail: (id: number | string) => ["faqs", "detail", id] as const,
};

export const useFaqs = (filters?: FaqFilters) => {
  return useQuery({
    queryKey: FAQ_KEYS.lists(filters),
    queryFn: () => faqsApi.getAll(filters),
  });
};

export const useFaq = (id?: number | string) => {
  return useQuery({
    queryKey: FAQ_KEYS.detail(id ?? "unknown"),
    queryFn: () => faqsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFaqData) => faqsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQ_KEYS.all() });
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFaqData) => faqsApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: FAQ_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: FAQ_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => faqsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQ_KEYS.all() });
    },
  });
};
