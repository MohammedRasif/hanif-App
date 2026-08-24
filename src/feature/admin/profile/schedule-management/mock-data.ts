export interface ScheduleMenuItem {
  id: string;
  label: string;
  page:
    | "opening-calendar"
    | "staff-time-off"
    | "business-hours"
    | "staff-working-hours";
}

export const SCHEDULE_MENU_ITEMS: ScheduleMenuItem[] = [
  {
    id: "opening-calendar",
    label: "Opening calendar",
    page: "opening-calendar",
  },
  {
    id: "staff-member-time-off",
    label: "Staff member time off",
    page: "staff-time-off",
  },
  {
    id: "business-hours",
    label: "Business hours",
    page: "business-hours",
  },
  {
    id: "staff-member-working-hours",
    label: "Staff member working hours",
    page: "staff-working-hours",
  },
];
