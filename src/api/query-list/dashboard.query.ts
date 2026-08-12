import { kyClient } from "@/lib/ky";

export interface DashboardStats {
  total_revenue?: number;
  total_bookings?: number;
  total_clients?: number;
  occupancy_rate?: number;
  recent_activity?: unknown[];
}

export interface ClientGroup {
  id?: string | number;
  name: string;
  description?: string;
  client_count?: number;
}

export interface Client {
  id?: string | number;
  full_name: string;
  email?: string;
  phone?: string;
  notes?: string;
  group_id?: string | number;
  created_at?: string;
}

export interface ImportClientsData {
  file_url?: string;
  clients?: Partial<Client>[];
}

export interface SendMessageData {
  client_ids?: (string | number)[];
  group_id?: string | number;
  message: string;
  channel?: "SMS" | "EMAIL" | "PUSH";
}

export interface StaffMember {
  id?: string | number;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
}

export interface ClientFilters {
  search?: string;
  group_id?: string | number;
  page?: number;
  page_size?: number;
}

export const dashboardApi = {
  getOverview: (shop_id?: string | number) =>
    kyClient
      .get("v1/dashboard/", {
        searchParams: shop_id ? { shop_id } : undefined,
      })
      .json<DashboardStats>(),

  getClientGroups: (shop_id: string | number) =>
    kyClient
      .get(`v1/dashboard/shops/${shop_id}/client-groups/`)
      .json<ClientGroup[]>(),

  createClientGroup: (shop_id: string | number, data: Partial<ClientGroup>) =>
    kyClient
      .post(`v1/dashboard/shops/${shop_id}/client-groups/`, { json: data })
      .json<ClientGroup>(),

  getClients: (shop_id: string | number, filters?: ClientFilters) =>
    kyClient
      .get(`v1/dashboard/shops/${shop_id}/clients/`, {
        searchParams: filters as Record<string, string | number | boolean>,
      })
      .json<Client[]>(),

  getClientImportHistory: (shop_id: string | number) =>
    kyClient
      .get(`v1/dashboard/shops/${shop_id}/clients/import/`)
      .json<unknown[]>(),

  importClients: (shop_id: string | number, data: ImportClientsData) =>
    kyClient
      .post(`v1/dashboard/shops/${shop_id}/clients/import/`, { json: data })
      .json<{ imported_count: number }>(),

  createClient: (shop_id: string | number, data: Client) =>
    kyClient
      .post(`v1/dashboard/shops/${shop_id}/clients/`, { json: data })
      .json<Client>(),

  getClientById: (shop_id: string | number, id: string | number) =>
    kyClient.get(`v1/dashboard/shops/${shop_id}/clients/${id}/`).json<Client>(),

  getShopReviews: (shop_id: string | number) =>
    kyClient.get(`v1/dashboard/shops/${shop_id}/reviews/`).json<unknown[]>(),

  sendMessages: (shop_id: string | number, data: SendMessageData) =>
    kyClient
      .post(`v1/dashboard/shops/${shop_id}/send-messages/`, { json: data })
      .json<{ sent_count: number }>(),

  getStaff: (shop_id: string | number) =>
    kyClient.get(`v1/dashboard/shops/${shop_id}/staff/`).json<StaffMember[]>(),

  createStaff: (shop_id: string | number, data: StaffMember) =>
    kyClient
      .post(`v1/dashboard/shops/${shop_id}/staff/`, { json: data })
      .json<StaffMember>(),

  updateStaff: (
    shop_id: string | number,
    id: string | number,
    data: Partial<StaffMember>,
  ) =>
    kyClient
      .patch(`v1/dashboard/shops/${shop_id}/staff/${id}/`, { json: data })
      .json<StaffMember>(),

  removeStaff: (shop_id: string | number, id: string | number) =>
    kyClient.delete(`v1/dashboard/shops/${shop_id}/staff/${id}/`).json<void>(),
};
