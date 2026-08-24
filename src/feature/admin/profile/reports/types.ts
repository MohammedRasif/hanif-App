export interface StaffReportItem {
  appointmentsCount: number;
  avatarUrl: string;
  id: string;
  name: string;
  revenue: string;
}

export type TimeFilter = "daily" | "weekly" | "monthly";

export interface ReportSummary {
  appointments: number;
  staffBreakdown: StaffReportItem[];
  totalRevenue: string;
}
