import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type BusinessHours,
  type ScheduleBreak,
  type ScheduleFilters,
  type ScheduleShift,
  type ScheduleTimeOff,
  scheduleApi,
} from "@/api/query-list/schedule.query";

export const SCHEDULE_KEYS = {
  all: () => ["schedule"] as const,
  breaks: (filters?: ScheduleFilters) =>
    ["schedule", "breaks", filters] as const,
  businessHours: (shopId: string | number) =>
    ["schedule", "businessHours", shopId] as const,
  shifts: (filters?: ScheduleFilters) =>
    ["schedule", "shifts", filters] as const,
  timeOff: (filters?: ScheduleFilters) =>
    ["schedule", "timeOff", filters] as const,
};

export const useScheduleBreaks = (filters?: ScheduleFilters) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.breaks(filters),
    queryFn: () => scheduleApi.getBreaks(filters),
  });
};

export const useBusinessHours = (shopId: string | number) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.businessHours(shopId),
    queryFn: () => scheduleApi.getBusinessHours(shopId),
    enabled: !!shopId,
  });
};

export const useScheduleShifts = (filters?: ScheduleFilters) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.shifts(filters),
    queryFn: () => scheduleApi.getShifts(filters),
  });
};

export const useScheduleTimeOff = (filters?: ScheduleFilters) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.timeOff(filters),
    queryFn: () => scheduleApi.getTimeOff(filters),
  });
};

export const useCreateScheduleBreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleBreak) => scheduleApi.createBreak(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useUpdateScheduleBreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string | number } & Partial<ScheduleBreak>) =>
      scheduleApi.updateBreak(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useDeleteScheduleBreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => scheduleApi.removeBreak(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useUpdateBusinessHours = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BusinessHours>) =>
      scheduleApi.updateBusinessHours(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.businessHours(shopId),
      });
    },
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleShift) => scheduleApi.createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string | number } & Partial<ScheduleShift>) =>
      scheduleApi.updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => scheduleApi.removeShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useCreateTimeOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleTimeOff) => scheduleApi.createTimeOff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useUpdateTimeOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string | number } & Partial<ScheduleTimeOff>) =>
      scheduleApi.updateTimeOff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};

export const useDeleteTimeOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => scheduleApi.removeTimeOff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all() });
    },
  });
};
