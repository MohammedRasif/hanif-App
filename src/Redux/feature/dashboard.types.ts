export interface DashboardMetrics {
  todays_bookings: number;
  completed: number;
  in_service: number;
  revenue_today: number;
}

export interface DashboardUpcomingBooking {
  id: number | string;
  booking_code: string;
  customer_name: string;
  customer_phone?: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  price: string | number;
}

export interface DashboardOverviewData {
  metrics: DashboardMetrics;
  upcoming_bookings: DashboardUpcomingBooking[];
}

export interface ClientItem {
  id: string | number;
  full_name?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  image?: string | null;
  avatar?: string | null;
  address?: string;
  role?: string;
  last_active_at?: string;
  date_joined?: string;
}

export interface ClientsData {
  new_clients: ClientItem[];
  all_clients: ClientItem[];
}

export interface ClientGroupItem {
  id: string;
  key: "all" | "new";
  title: string;
  count: number;
}

// 1. Staff Profile Summary
export interface StaffProfileSummaryData {
  id: number | string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  avatar?: string | null;
  shop?: {
    id: number | string;
    name: string;
  };
}

// 2. Staff Shop Info (GET /api/v1/barbers/me/shop/)
export interface StaffShopData {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  logo?: string | null;
  banner?: string | null;
  is_active?: boolean;
}

// 3. Staff Offered Services
export interface StaffOfferedService {
  id: number | string;
  name: string;
  duration_minutes: number;
  price: string | number;
}

// 4. Staff Schedule Shifts
export interface StaffScheduleShift {
  id: number | string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// 5. Staff Time Off / Break Schedule
export interface StaffTimeOffItem {
  id: number | string;
  reason: string;
  start_date: string;
  end_date: string;
  status: string;
}

// 6. Staff Reviews
export interface StaffReviewItem {
  id: number | string;
  rating: number;
  comment: string;
  customer_name: string;
  customer_avatar?: string | null;
  date: string;
}

export interface StaffReviewsData {
  summary: {
    average_rating: number;
    total_reviews: number;
    distribution: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
  };
  reviews: StaffReviewItem[];
}

// 7. Staff Reports
export interface StaffReportHistoryItem {
  id: number | string;
  customer_name: string;
  service_name: string;
  price: number | string;
  date: string;
}

export interface StaffReportsData {
  total_bookings: number;
  total_revenue: number | string;
  history: StaffReportHistoryItem[];
}
