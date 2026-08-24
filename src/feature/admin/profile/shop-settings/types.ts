export interface ShopSettingsData {
  aboutUs: string;
  avatarUrl: string;
  coverUrl: string;
  email: string;
  facebookUrl: string;
  gallery: string[];
  instagramUrl: string;
  location: string;
  phone: string;
  shopName: string;
  tiktokUrl: string;
  whatsapp: string;
}

export interface ShopSettingsProps {
  onBack?: () => void;
}
