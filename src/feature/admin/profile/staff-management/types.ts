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
  role: "manager" | "barber" | "Senior barber" | "Owner" | "Staff";
  services: string[];
}

export interface StaffManagementProps {
  onBack?: () => void;
}
