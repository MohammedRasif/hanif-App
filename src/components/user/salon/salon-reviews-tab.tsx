import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

interface Review {
  avatar: string;
  comment: string;
  date: string;
  id: string;
  name: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    comment:
      "Amazing service! The staff was professional and my hair looks fantastic. Will definitely come back.",
    date: "2 days ago",
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    comment:
      "Great atmosphere and skilled stylists. The facial treatment was very relaxing.",
    date: "1 week ago",
    id: "2",
    name: "Mike Chen",
    rating: 4,
  },
];

export const SalonReviewsTab = () => {
  return (
    <View className="gap-3.5 pt-2">
      {REVIEWS.map((review) => (
        <View className="rounded-2xl bg-main-bg-overlay  p-4" key={review.id}>
          {/* Header Row: Avatar + Name + Rating */}
          <View className="flex-row items-center gap-3">
            <Image
              contentFit="cover"
              source={{ uri: review.avatar }}
              style={{ borderRadius: 20, height: 40, width: 40 }}
            />
            <View>
              <Text className="font-poppins-bold text-sm text-gray-900">
                {review.name}
              </Text>
              <View className="mt-0.5 flex-row items-center gap-1">
                <View className="flex-row items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <StyledIcons
                      className={
                        starIndex <= review.rating
                          ? "text-[#F0B100]"
                          : "text-gray-300"
                      }
                      key={starIndex}
                      name={
                        starIndex <= review.rating ? "star" : "star-outline"
                      }
                      size={13}
                    />
                  ))}
                </View>
                <Text className="ml-1.5 font-poppins text-xs text-gray-400">
                  {review.date}
                </Text>
              </View>
            </View>
          </View>

          {/* Comment Text */}
          <Text className="mt-2.5 font-poppins text-xs leading-relaxed text-gray-600">
            {review.comment}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default SalonReviewsTab;
