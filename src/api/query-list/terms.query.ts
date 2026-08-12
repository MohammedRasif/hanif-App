import { kyClient } from "@/lib/ky";

export interface Terms {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateTermsData {
  title?: string;
  content?: string;
}

export const termsApi = {
  get: () => kyClient.get("v1/terms/").json<Terms>(),

  update: (data: UpdateTermsData) =>
    kyClient.patch("v1/terms/", { json: data }).json<Terms>(),
};
