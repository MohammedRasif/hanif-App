export type ScheduleSubPage =
  | "menu"
  | "opening-calendar"
  | "staff-time-off"
  | "staff-time-off-detail"
  | "business-hours"
  | "staff-working-hours"
  | "shift"
  | "add-business-days-off"
  | "add-staff-time-off";

export interface ScheduleManagementProps {
  initialPage?: ScheduleSubPage;
  onBack?: () => void;
}
