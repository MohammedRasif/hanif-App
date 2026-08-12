import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateReviewData,
  type ReviewFilters,
  type UpdateReviewData,
  reviewsApi,
} from "@/api/query-list/reviews.query";

export const REVIEW_KEYS = {
  all: () => ["reviews"] as const,
  lists: (filters?: ReviewFilters) => ["reviews", "list", filters] as const,
  detail: (id: string | number) => ["reviews", "detail", id] as const,
};

export const useReviews = (filters?: ReviewFilters) => {
  return useQuery({
    queryKey: REVIEW_KEYS.lists(filters),
    queryFn: () => reviewsApi.getAll(filters),
  });
};

export const useReviewDetail = (id?: string | number) => {
  return useQuery({
    queryKey: REVIEW_KEYS.detail(id ?? "unknown"),
    queryFn: () => reviewsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all() });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateReviewData) => reviewsApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: REVIEW_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => reviewsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all() });
    },
  });
};
