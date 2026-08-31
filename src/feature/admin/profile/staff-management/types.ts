export interface StaffMemberItem {
  avatarUrl?: string;
  calendarAccess: boolean;
  clientDetailsAccess: boolean;
  countryCode: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  position?: string;
  role: "admin" | "staff";
  services: string[];
}

export interface StaffManagementProps {
  onBack?: () => void;
}
