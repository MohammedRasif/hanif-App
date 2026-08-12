import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateNotificationData,
  type NotificationFilters,
  type SendNotificationData,
  notificationsApi,
} from "@/api/query-list/notifications.query";

export const NOTIFICATION_KEYS = {
  all: () => ["notifications"] as const,
  lists: (filters?: NotificationFilters) =>
    ["notifications", "list", filters] as const,
};

export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.lists(filters),
    queryFn: () => notificationsApi.getAll(filters),
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationData) => notificationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all() });
    },
  });
};

export const useSendNotification = () => {
  return useMutation({
    mutationFn: (data: SendNotificationData) => notificationsApi.send(data),
  });
};
