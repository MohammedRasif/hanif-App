export interface ReviewItem {
  avatarUrl: string;
  date: string;
  id: string;
  rating: number;
  replyText?: string;
  text: string;
  userName: string;
}

export interface RatingBreakdown {
  count: number;
  percentage: number;
  stars: number;
}

export interface ReviewsSummary {
  averageRating: number;
  breakdown: RatingBreakdown[];
  totalReviews: number;
}

export interface ReviewsProps {
  onBack?: () => void;
}
