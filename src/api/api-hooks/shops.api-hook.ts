import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateShopData,
  type ShopFilters,
  type ShopGalleryItem,
  type ShopPaymentSettings,
  type UpdateShopData,
  shopsApi,
} from "@/api/query-list/shops.query";

export const SHOP_KEYS = {
  all: () => ["shops"] as const,
  lists: (filters?: ShopFilters) => ["shops", "list", filters] as const,
  detail: (id: string | number) => ["shops", "detail", id] as const,
  gallery: (shopId?: string | number) => ["shops", "gallery", shopId] as const,
  galleryDetail: (id: string | number) =>
    ["shops", "gallery", "detail", id] as const,
  googleReviews: (id: string | number) =>
    ["shops", "googleReviews", id] as const,
  paymentSettings: (id: string | number) =>
    ["shops", "paymentSettings", id] as const,
};

export const useShops = (filters?: ShopFilters) => {
  return useQuery({
    queryKey: SHOP_KEYS.lists(filters),
    queryFn: () => shopsApi.getAll(filters),
  });
};

export const useShop = (id?: string | number) => {
  return useQuery({
    queryKey: SHOP_KEYS.detail(id ?? "unknown"),
    queryFn: () => shopsApi.getById(id!),
    enabled: !!id,
  });
};

export const useShopGallery = (shopId?: string | number) => {
  return useQuery({
    queryKey: SHOP_KEYS.gallery(shopId),
    queryFn: () => shopsApi.getGallery(shopId),
  });
};

export const useShopGalleryItem = (id?: string | number) => {
  return useQuery({
    queryKey: SHOP_KEYS.galleryDetail(id ?? "unknown"),
    queryFn: () => shopsApi.getGalleryItemById(id!),
    enabled: !!id,
  });
};

export const useGoogleReviews = (id?: string | number) => {
  return useQuery({
    queryKey: SHOP_KEYS.googleReviews(id ?? "unknown"),
    queryFn: () => shopsApi.getGoogleReviews(id!),
    enabled: !!id,
  });
};

export const usePaymentSettings = (id?: string | number) => {
  return useQuery({
    queryKey: SHOP_KEYS.paymentSettings(id ?? "unknown"),
    queryFn: () => shopsApi.getPaymentSettings(id!),
    enabled: !!id,
  });
};

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShopData) => shopsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.all() });
    },
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateShopData) => shopsApi.update(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.all() });
      queryClient.invalidateQueries({
        queryKey: SHOP_KEYS.detail(variables.id),
      });
    },
  });
};

export const useDeleteShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => shopsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.all() });
    },
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShopGalleryItem>) =>
      shopsApi.createGalleryItem(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: SHOP_KEYS.gallery(variables.shop_id),
      });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string | number } & Partial<ShopGalleryItem>) =>
      shopsApi.updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.gallery() });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => shopsApi.removeGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.gallery() });
    },
  });
};

export const useUpdatePaymentSettings = (shopId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShopPaymentSettings>) =>
      shopsApi.updatePaymentSettings(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SHOP_KEYS.paymentSettings(shopId),
      });
    },
  });
};
