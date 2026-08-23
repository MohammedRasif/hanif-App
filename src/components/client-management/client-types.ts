export interface ClientItem {
  id: string | number;
  full_name?: string;
  name?: string;
  username?: string;
  phone?: string;
  image?: string | null;
  avatar?: string | null;
  email?: string;
  address?: string;
  role?: string;
  last_active_at?: string;
  date_joined?: string;
}

export interface ClientGroupItem {
  count?: number;
  id: string;
  key?: "all" | "new";
  title: string;
}

export const MOCK_GROUPS: ClientGroupItem[] = [
  { id: "all", key: "all", title: "All clients" },
  { id: "new", key: "new", title: "New clients" },
];
