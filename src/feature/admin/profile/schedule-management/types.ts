export type ScheduleSubPage =
  | "menu"
  | "opening-calendar"
  | "staff-time-off"
  | "business-hours"
  | "staff-working-hours";

export interface ScheduleManagementProps {
  initialPage?: ScheduleSubPage;
  onBack?: () => void;
}
