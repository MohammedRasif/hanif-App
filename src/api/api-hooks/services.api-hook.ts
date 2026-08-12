import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type UpdateServiceEntityData,
  servicesApi,
} from "@/api/query-list/services.query";

export const SERVICE_KEYS = {
  all: () => ["services"] as const,
  detail: (id: string | number) => ["services", "detail", id] as const,
};

export const useServiceDetail = (id?: string | number) => {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(id ?? "unknown"),
    queryFn: () => servicesApi.getById(id!),
    enabled: !!id,
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceEntityData) => servicesApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => servicesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all() });
    },
  });
};
