import { kyClient } from "@/lib/ky";

export interface Policy {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdatePolicyData {
  title?: string;
  content?: string;
}

export const policyApi = {
  get: () => kyClient.get("v1/policy/").json<Policy>(),

  update: (data: UpdatePolicyData) =>
    kyClient.patch("v1/policy/", { json: data }).json<Policy>(),
};
