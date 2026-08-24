export interface ServiceItem {
  category: string;
  description: string;
  duration: string;
  id: string;
  name: string;
  price: string;
  staff: string[];
}

export interface ServiceSetupProps {
  onBack?: () => void;
}
