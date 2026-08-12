import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BarberFilters,
  type CreateBarberData,
  type UpdateBarberData,
  barbersApi,
} from "@/api/query-list/barbers.query";

export const BARBER_KEYS = {
  all: () => ["barbers"] as const,
  lists: (filters?: BarberFilters) => ["barbers", "list", filters] as const,
  detail: (id: string | number) => ["barbers", "detail", id] as const,
};

export const useBarbers = (filters?: BarberFilters) => {
  return useQuery({
    queryKey: BARBER_KEYS.lists(filters),
    queryFn: () => barbersApi.getAll(filters),
  });
};

export const useBarber = (id?: string | number) => {
  return useQuery({
    queryKey: BARBER_KEYS.detail(id ?? "unknown"),
    queryFn: () => barbersApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBarberData) => barbersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBER_KEYS.all() });
    },
  });
};

export const useUpdateBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBarberData) => barbersApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BARBER_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: BARBER_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteBarber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => barbersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BARBER_KEYS.all() });
    },
  });
};
