import type { ReviewItem, ReviewsSummary } from "./types";

export const MOCK_REVIEWS_SUMMARY: ReviewsSummary = {
  averageRating: 4.9,
  totalReviews: 589,
  breakdown: [
    { stars: 5, percentage: 80, count: 120 },
    { stars: 4, percentage: 15, count: 12 },
    { stars: 3, percentage: 15, count: 12 },
    { stars: 2, percentage: 15, count: 12 },
    { stars: 1, percentage: 15, count: 12 },
  ],
};

export const MOCK_REVIEWS_LIST: ReviewItem[] = [
  {
    id: "1",
    userName: "john",
    date: "29 may 2026",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    text: "we are the best on uk base shop we are the best on uk base shop we are the best on uk base shop",
    replyText: "You reolied",
  },
  {
    id: "2",
    userName: "john",
    date: "29 may 2026",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    text: "we are the best on uk base shop we are the best on uk base shop we are the best on uk base shop",
    replyText: "You reolied",
  },
  {
    id: "3",
    userName: "john",
    date: "29 may 2026",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    text: "we are the best on uk base shop we are the best on uk base shop we are the best on uk base shop",
    replyText: "You reolied",
  },
  {
    id: "4",
    userName: "Alex R.",
    date: "22 may 2026",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    text: "Great atmosphere, professional staff, and precise styling!",
    replyText: "You replied",
  },
];
