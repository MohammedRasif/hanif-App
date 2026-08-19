export interface ClientItem {
  avatar?: string;
  id: string;
  name: string;
  phone: string;
}

export interface ClientGroupItem {
  count?: number;
  id: string;
  title: string;
}

export const MOCK_CLIENT_LIST: ClientItem[] = [
  { id: "1", name: "Sleek showerhead", phone: "+90908779" },
  { id: "2", name: "Sleek showerhead", phone: "+90908779" },
  { id: "3", name: "Sleek showerhead", phone: "+90908779" },
  { id: "4", name: "Sleek showerhead", phone: "+90908779" },
  { id: "5", name: "Sleek showerhead", phone: "+90908779" },
  { id: "6", name: "Sleek showerhead", phone: "+90908779" },
  { id: "7", name: "Sleek showerhead", phone: "+90908779" },
  { id: "8", name: "Sleek showerhead", phone: "+90908779" },
];

export const MOCK_GROUPS: ClientGroupItem[] = [
  { id: "g1", title: "Search by booking" },
  { id: "g2", title: "All clint (200)" },
  { id: "g3", title: "New clint (120)" },
];

export const MOCK_SELECT_CLIENTS: ClientItem[] = [
  { id: "1", name: "Sleek showerhead", phone: "+90908779" },
  { id: "2", name: "Sleek showerhead", phone: "+90908779" },
  { id: "3", name: "Sleek showerhead", phone: "+90908779" },
  { id: "4", name: "Sleek showerhead", phone: "+90908779" },
  { id: "5", name: "Sleek showerhead", phone: "+90908779" },
  { id: "6", name: "Sleek showerhead", phone: "+90908779" },
  { id: "7", name: "Sleek showerhead", phone: "+90908779" },
];
