import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Client,
  type ClientFilters,
  type ClientGroup,
  type ImportClientsData,
  type SendMessageData,
  type StaffMember,
  dashboardApi,
} from "@/api/query-list/dashboard.query";

export const DASHBOARD_KEYS = {
  all: () => ["dashboard"] as const,
  overview: (shopId?: string | number) =>
    ["dashboard", "overview", shopId] as const,
  clientGroups: (shopId: string | number) =>
    ["dashboard", shopId, "clientGroups"] as const,
  clients: (shopId: string | number, filters?: ClientFilters) =>
    ["dashboard", shopId, "clients", filters] as const,
  clientDetail: (shopId: string | number, id: string | number) =>
    ["dashboard", shopId, "clients", id] as const,
  reviews: (shopId: string | number) =>
    ["dashboard", shopId, "reviews"] as const,
  staff: (shopId: string | number) => ["dashboard", shopId, "staff"] as const,
};

export const useDashboardOverview = (shopId?: string | number) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.overview(shopId),
    queryFn: () => dashboardApi.getOverview(shopId),
  });
};

export const useClientGroups = (shopId: string | number) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.clientGroups(shopId),
    queryFn: () => dashboardApi.getClientGroups(shopId),
    enabled: !!shopId,
  });
};

export const useClients = (
  shopId: string | number,
  filters?: ClientFilters,
) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.clients(shopId, filters),
    queryFn: () => dashboardApi.getClients(shopId, filters),
    enabled: !!shopId,
  });
};

export const useClientDetail = (
  shopId: string | number,
  id?: string | number,
) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.clientDetail(shopId, id ?? "unknown"),
    queryFn: () => dashboardApi.getClientById(shopId, id!),
    enabled: !!shopId && !!id,
  });
};

export const useShopReviews = (shopId: string | number) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.reviews(shopId),
    queryFn: () => dashboardApi.getShopReviews(shopId),
    enabled: !!shopId,
  });
};

export const useStaffList = (shopId: string | number) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.staff(shopId),
    queryFn: () => dashboardApi.getStaff(shopId),
    enabled: !!shopId,
  });
};

export const useCreateClientGroup = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ClientGroup>) =>
      dashboardApi.createClientGroup(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_KEYS.clientGroups(shopId),
      });
    },
  });
};

export const useCreateClient = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Client) => dashboardApi.createClient(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_KEYS.clients(shopId),
      });
    },
  });
};

export const useImportClients = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportClientsData) =>
      dashboardApi.importClients(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_KEYS.clients(shopId),
      });
    },
  });
};

export const useSendMessages = (shopId: string | number) => {
  return useMutation({
    mutationFn: (data: SendMessageData) =>
      dashboardApi.sendMessages(shopId, data),
  });
};

export const useCreateStaff = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StaffMember) => dashboardApi.createStaff(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.staff(shopId) });
    },
  });
};

export const useUpdateStaff = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string | number } & Partial<StaffMember>) =>
      dashboardApi.updateStaff(shopId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.staff(shopId) });
    },
  });
};

export const useDeleteStaff = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => dashboardApi.removeStaff(shopId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.staff(shopId) });
    },
  });
};
