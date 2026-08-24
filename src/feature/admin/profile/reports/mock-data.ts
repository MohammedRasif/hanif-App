import type { ReportSummary, TimeFilter } from "./types";

export const MOCK_REPORTS_DATA: Record<TimeFilter, ReportSummary> = {
  daily: {
    totalRevenue: "$250",
    appointments: 2,
    staffBreakdown: [
      {
        id: "1",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        appointmentsCount: 5,
        revenue: "$566",
      },
      {
        id: "2",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        appointmentsCount: 5,
        revenue: "$566",
      },
      {
        id: "3",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        appointmentsCount: 5,
        revenue: "$566",
      },
      {
        id: "4",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        appointmentsCount: 5,
        revenue: "$566",
      },
    ],
  },
  weekly: {
    totalRevenue: "$1,850",
    appointments: 24,
    staffBreakdown: [
      {
        id: "1",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        appointmentsCount: 18,
        revenue: "$2,100",
      },
      {
        id: "2",
        name: "Alex",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        appointmentsCount: 14,
        revenue: "$1,650",
      },
      {
        id: "3",
        name: "Isaac",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        appointmentsCount: 12,
        revenue: "$1,420",
      },
    ],
  },
  monthly: {
    totalRevenue: "$7,400",
    appointments: 98,
    staffBreakdown: [
      {
        id: "1",
        name: "Sofia",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        appointmentsCount: 45,
        revenue: "$5,400",
      },
      {
        id: "2",
        name: "Alex",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        appointmentsCount: 38,
        revenue: "$4,250",
      },
      {
        id: "3",
        name: "Isaac",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        appointmentsCount: 32,
        revenue: "$3,800",
      },
    ],
  },
};
