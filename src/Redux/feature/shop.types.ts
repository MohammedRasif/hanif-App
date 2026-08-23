export interface ShopReview {
  count: number;
  average_rating: number;
}

export interface Shop {
  id: number;
  name: string;
  logo: string | null;
  cover_image: string | null;
  location: string | null;
  payment_gateway_enabled: boolean;
  review?: ShopReview;
}

export interface ShopDetails {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  cover_image: string | null;
  location: string | null;
  about_us: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  google_review_link: string | null;
  google_place_id: string | null;
  payment_gateway_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopService {
  id: number;
  category: number;
  shop: number;
  barbers: string[];
  name: string;
  image: string | null;
  description: string | null;
  price: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewItem {
  id: number | string;
  user_name?: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  shop: number;
  image: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BarberItem {
  id: number;
  user: string;
  user_name: string;
  shop: number;
  shop_name: string;
  specialty: string;
  is_available: boolean;
  experience_years: number;
  role: string;
  calendar_access: boolean;
  client_details_access: boolean;
  review?: {
    count: number;
    average_rating: number;
  };
  user_details?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    image: string | null;
  };
  assigned_services?: Array<{
    id: number;
    name: string;
    price: number;
    duration_minutes: number;
  }>;
}

export interface AppointmentDetailItem {
  id: number;
  service_id: number;
  service_name: string;
  barber_id: number;
  barber_name?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
}

export interface BookingShopDetails {
  name: string;
  location: string | null;
  phone: string | null;
}

export interface BookingItem {
  id: number;
  booking_code: string;
  customer: string;
  shop: number;
  shop_details?: BookingShopDetails;
  total_amount: string;
  tip_amount: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  appointments_details: AppointmentDetailItem[];
}

export const buildServicesUrl = (
  params?:
    { shop?: string | number; barber?: string | number } | string | number,
): string => {
  if (typeof params === "object" && params !== null) {
    const queryParts: string[] = [];
    if (params.shop) queryParts.push(`shop=${params.shop}`);
    if (params.barber) queryParts.push(`barber=${params.barber}`);
    return `v1/services/?${queryParts.join("&")}`;
  }
  return `v1/services/?shop=${params || ""}`;
};

export const buildBarbersUrl = (
  params?:
    { shop?: string | number; service?: string | number } | string | number,
): string => {
  if (typeof params === "object" && params !== null) {
    const queryParts: string[] = [];
    if (params.shop) queryParts.push(`shop=${params.shop}`);
    if (params.service) queryParts.push(`service=${params.service}`);
    return `v1/barbers/?${queryParts.join("&")}`;
  }
  return `v1/barbers/?shop=${params || ""}`;
};
