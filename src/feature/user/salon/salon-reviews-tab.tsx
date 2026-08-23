import { StyledIcons } from "@/lib";
import { useGetShopReviewsQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface SalonReviewsTabProps {
  shopId?: string | number;
}

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

export const SalonReviewsTab: React.FC<SalonReviewsTabProps> = ({ shopId }) => {
  const {
    data: reviewsResponse,
    isLoading,
    isError,
  } = useGetShopReviewsQuery(shopId || "", { skip: !shopId });

  const reviews = Array.isArray(reviewsResponse?.data)
    ? reviewsResponse.data
    : Array.isArray(reviewsResponse)
      ? reviewsResponse
      : [];

  if (isLoading) {
    return (
      <View className="py-6 items-center justify-center">
        <ActivityIndicator color="#F0B100" size="small" />
        <Text className="mt-2 font-poppins text-xs text-gray-500">
          Loading reviews...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-4 items-center justify-center">
        <Text className="font-poppins text-xs text-red-500">
          Failed to load reviews.
        </Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <StyledIcons
          className="text-gray-300 mb-2"
          name="star-outline"
          size={32}
        />
        <Text className="font-poppins-medium text-sm text-gray-500">
          No reviews yet
        </Text>
        <Text className="font-poppins text-xs text-gray-400 mt-1">
          Be the first to review this salon after your booking!
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3.5 pt-2">
      {reviews.map((review) => (
        <View className="rounded-2xl bg-main-bg-overlay p-4" key={review.id}>
          {/* Header Row: Avatar + Name + Rating */}
          <View className="flex-row items-center gap-3">
            <Image
              contentFit="cover"
              source={{ uri: review.user_avatar || DEFAULT_AVATAR }}
              style={{ borderRadius: 20, height: 40, width: 40 }}
            />
            <View>
              <Text className="font-poppins-bold text-sm text-gray-900">
                {review.user_name || "Customer"}
              </Text>
              <View className="mt-0.5 flex-row items-center gap-1">
                <View className="flex-row items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <StyledIcons
                      className={
                        starIndex <= (review.rating || 5)
                          ? "text-[#F0B100]"
                          : "text-gray-300"
                      }
                      key={starIndex}
                      name={
                        starIndex <= (review.rating || 5)
                          ? "star"
                          : "star-outline"
                      }
                      size={13}
                    />
                  ))}
                </View>
                {review.created_at ? (
                  <Text className="ml-1.5 font-poppins text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                ) : null}
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
