import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type UpdatePolicyData,
  policyApi,
} from "@/api/query-list/policy.query";

export const POLICY_KEYS = {
  all: () => ["policy"] as const,
};

export const usePolicy = () => {
  return useQuery({
    queryKey: POLICY_KEYS.all(),
    queryFn: () => policyApi.get(),
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePolicyData) => policyApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POLICY_KEYS.all() });
    },
  });
};
