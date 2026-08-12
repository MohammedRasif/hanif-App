import { kyClient } from "@/lib/ky";

export interface NotificationItem {
  id: string | number;
  title: string;
  body: string;
  is_read?: boolean;
  type?: string;
  created_at?: string;
}

export interface NotificationFilters {
  page?: number;
  page_size?: number;
  is_read?: boolean;
}

export interface NotificationListResponse {
  count: number;
  results: NotificationItem[];
  next?: string | null;
  previous?: string | null;
}

export interface CreateNotificationData {
  title: string;
  body: string;
  user_id?: string | number;
  type?: string;
}

export interface SendNotificationData {
  title: string;
  body: string;
  recipients?: (string | number)[];
  topic?: string;
}

export const notificationsApi = {
  getAll: (filters?: NotificationFilters) =>
    kyClient
      .get("v1/notifications/", {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<NotificationListResponse>(),

  create: (data: CreateNotificationData) =>
    kyClient.post("v1/notifications/", { json: data }).json<NotificationItem>(),

  send: (data: SendNotificationData) =>
    kyClient
      .post("v1/notifications/send/", { json: data })
      .json<{ success: boolean; sent_count?: number }>(),
};
