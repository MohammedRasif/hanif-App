import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ContactFilters,
  type CreateContactData,
  contactApi,
} from "@/api/query-list/contact.query";

export const CONTACT_KEYS = {
  all: () => ["contact"] as const,
  lists: (filters?: ContactFilters) => ["contact", "list", filters] as const,
};

export const useContacts = (filters?: ContactFilters) => {
  return useQuery({
    queryKey: CONTACT_KEYS.lists(filters),
    queryFn: () => contactApi.getAll(filters),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactData) => contactApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_KEYS.all() });
    },
  });
};
