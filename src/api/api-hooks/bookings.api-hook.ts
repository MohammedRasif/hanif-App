import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AvailableSlotFilters,
  type CreateBookingData,
  type UpdateBookingData,
  bookingsApi,
} from "@/api/query-list/bookings.query";

export const BOOKING_KEYS = {
  all: () => ["bookings"] as const,
  availableSlots: (filters: AvailableSlotFilters) =>
    ["bookings", "slots", filters] as const,
  detail: (id: string | number) => ["bookings", "detail", id] as const,
  calendarLink: (id: string | number) =>
    ["bookings", "calendarLink", id] as const,
};

export const useAvailableSlots = (
  filters: AvailableSlotFilters,
  enabled = true,
) => {
  return useQuery({
    queryKey: BOOKING_KEYS.availableSlots(filters),
    queryFn: () => bookingsApi.getAvailableSlots(filters),
    enabled: enabled && !!filters.shop_id && !!filters.date,
  });
};

export const useCalendarLink = (id?: string | number) => {
  return useQuery({
    queryKey: BOOKING_KEYS.calendarLink(id ?? "unknown"),
    queryFn: () => bookingsApi.getCalendarLink(id!),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all() });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBookingData) => bookingsApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.detail(variables.id),
      });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string | number; reason?: string }) =>
      bookingsApi.cancel(id, reason),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.detail(variables.id),
      });
    },
  });
};
