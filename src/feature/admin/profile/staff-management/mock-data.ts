import type { StaffMemberItem } from "./types";

export const MOCK_STAFF_MEMBERS: StaffMemberItem[] = [
  {
    id: "1",
    name: "Isaac",
    role: "manager",
    email: "isaac.manager@barbersbay.com",
    phone: "7911123456",
    countryCode: "+44",
    position: "Branch Manager",
    calendarAccess: true,
    clientDetailsAccess: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    services: ["Face wash", "Classic Haircut", "Beard Trim"],
  },
  {
    id: "2",
    name: "isaac",
    role: "barber",
    email: "isaac.barber@barbersbay.com",
    phone: "7911654321",
    countryCode: "+44",
    position: "Stylist",
    calendarAccess: true,
    clientDetailsAccess: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    services: ["Face wash", "Classic Haircut"],
  },
  {
    id: "3",
    name: "isaac",
    role: "Senior barber",
    email: "isaac.senior@barbersbay.com",
    phone: "7911987654",
    countryCode: "+44",
    position: "Senior Stylist",
    calendarAccess: true,
    clientDetailsAccess: false,
    services: ["Face wash", "Hair Color", "Beard Trim"],
  },
  {
    id: "4",
    name: "isaac",
    role: "Owner",
    email: "isaac.owner@barbersbay.com",
    phone: "7911112233",
    countryCode: "+44",
    position: "Shop Owner",
    calendarAccess: true,
    clientDetailsAccess: true,
    services: ["Face wash", "VIP Package"],
  },
];

export const MOCK_ROLES = [
  "Staff",
  "manager",
  "barber",
  "Senior barber",
  "Owner",
];

export const MOCK_SERVICES_LIST = [
  "Face wash",
  "Classic Haircut",
  "Beard Trim",
  "Hair Styling",
  "Facial Cleanse",
  "VIP Grooming",
];

export const MOCK_COUNTRY_CODES = ["+44", "+1", "+880", "+971", "+61"];
