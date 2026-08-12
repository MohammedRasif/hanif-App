import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type UpdateTermsData, termsApi } from "@/api/query-list/terms.query";

export const TERMS_KEYS = {
  all: () => ["terms"] as const,
};

export const useTerms = () => {
  return useQuery({
    queryKey: TERMS_KEYS.all(),
    queryFn: () => termsApi.get(),
  });
};

export const useUpdateTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTermsData) => termsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_KEYS.all() });
    },
  });
};
