import { getUserData } from "@/lib/storage";
import { StyledIcons } from "@/lib";
import {
  useGetShopReviewDetailsQuery,
  useGetShopReviewsQuery,
} from "@/Redux/feature/shop";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { MOCK_REVIEWS_LIST, MOCK_REVIEWS_SUMMARY } from "./mock-data";
import type { ReviewsProps } from "./types";

export function ReviewsScreen({ onBack }: ReviewsProps) {
  const router = useRouter();

  // Get active shop ID from storage (e.g., user shop #7)
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 1;

  // 📡 GET /v1/bookings/reviews/:id/ (where :id is shopId)
  const {
    data: reviewDetailsResponse,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useGetShopReviewDetailsQuery(shopId, { refetchOnMountOrArgChange: true });

  // 📡 Fallback query: GET /v1/bookings/reviews/?shop_id=:id
  const { data: shopReviewsResponse, isLoading: isReviewsLoading } =
    useGetShopReviewsQuery(shopId, {
      skip: !isDetailsError && Boolean(reviewDetailsResponse?.data),
    });

  const isLoading = isDetailsLoading && isReviewsLoading;
  const rawData = reviewDetailsResponse?.data || shopReviewsResponse?.data;

  // Transform single object or array response into array format
  const rawList = useMemo(() => {
    if (Array.isArray(rawData)) {
      return rawData;
    }
    if (rawData && typeof rawData === "object" && rawData.id) {
      return [rawData];
    }
    return [];
  }, [rawData]);

  // Compute rating summary stats
  const reviewsSummary = useMemo(() => {
    if (rawList.length === 0) {
      return MOCK_REVIEWS_SUMMARY;
    }
    const totalReviews = rawList.length;
    const totalStars = rawList.reduce(
      (acc: number, item: any) => acc + (Number(item.rating) || 5),
      0,
    );
    const averageRating = (totalStars / totalReviews).toFixed(1);

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rawList.forEach((item: any) => {
      const r = Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5)));
      counts[r] = (counts[r] || 0) + 1;
    });

    const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars] || 0,
      percentage:
        totalReviews > 0
          ? Math.round(((counts[stars] || 0) / totalReviews) * 100)
          : 0,
    }));

    return {
      averageRating,
      totalReviews,
      breakdown,
    };
  }, [rawList]);

  // Compute reviews list items
  const reviewsList = useMemo(() => {
    if (rawList.length === 0) {
      return MOCK_REVIEWS_LIST;
    }
    return rawList.map((item: any) => ({
      id: String(item.id),
      rating: Number(item.rating) || 5,
      userName: item.customer_name || item.customer || "Customer",
      date: item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : item.date || "Recently",
      avatarUrl:
        item.customer_avatar ||
        item.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
      text: item.comment || item.text || "No comment provided.",
      replyText: item.google_review_link
        ? `Google Review: ${item.google_review_link}`
        : item.replyText,
    }));
  }, [rawList]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={handleBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Reviews
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content List / Loading */}
      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#FF9500" size="small" />
          <Text className="mt-2 text-xs text-gray-400">Loading reviews...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
          data={reviewsList}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            /* Rating Summary Card */
            <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
              <View className="flex-row items-center justify-between">
                {/* Left Column: Overall Rating */}
                <View className="items-center justify-center pr-4 border-r border-gray-100">
                  <Text className="font-bold text-4xl text-gray-900 mb-1">
                    {reviewsSummary.averageRating}
                  </Text>
                  <View className="flex-row items-center gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StyledIcons
                        className="text-[#FF9500]"
                        key={i}
                        name="star"
                        size={16}
                      />
                    ))}
                  </View>
                  <Text className="font-semibold text-xs text-gray-800">
                    {reviewsSummary.totalReviews} review
                    {reviewsSummary.totalReviews !== 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Right Column: Breakdown Bars */}
                <View className="flex-1 pl-4 gap-1.5">
                  {reviewsSummary.breakdown.map((row) => (
                    <View
                      className="flex-row items-center gap-2"
                      key={row.stars}
                    >
                      <Text className="w-3 font-semibold text-xs text-gray-700 text-right">
                        {row.stars}
                      </Text>
                      <StyledIcons
                        className="text-gray-400"
                        name="star"
                        size={12}
                      />
                      <View className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                        <View
                          className="h-full rounded-full bg-[#FF9500]"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </View>
                      <Text className="w-6 font-medium text-xs text-gray-700 text-right">
                        {row.count}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-3.5 rounded-2xl border border-gray-100 bg-white p-4.5 shadow-xs">
              {/* Top Row: Stars + User Info */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <StyledIcons
                      className="text-[#FF9500]"
                      key={i}
                      name="star"
                      size={16}
                    />
                  ))}
                </View>

                <View className="flex-row items-center">
                  <View className="items-end mr-2.5">
                    <Text className="font-bold text-sm text-gray-900">
                      {item.userName}
                    </Text>
                    <Text className="font-medium text-xs text-gray-400">
                      {item.date}
                    </Text>
                  </View>
                  <Image
                    className="h-8 w-8 rounded-full bg-gray-200"
                    contentFit="cover"
                    source={{ uri: item.avatarUrl }}
                  />
                </View>
              </View>

              {/* Review Content */}
              <Text className="font-medium text-xs text-gray-700 mt-2.5 mb-3 leading-5">
                {item.text}
              </Text>

              {/* Status / Reply */}
              {item.replyText && (
                <Text className="font-medium text-xs text-gray-400">
                  {item.replyText}
                </Text>
              )}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
