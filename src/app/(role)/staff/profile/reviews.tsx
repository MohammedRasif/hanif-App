import { Container } from "@/components/container";
import {
  StaffProfileTopHeader,
  StaffReviewCard,
} from "@/feature/staff/profile";
import { StyledIcons } from "@/lib";
import { useGetStaffMeReviewsQuery } from "@/Redux/feature/dashboard";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function StaffReviewsScreen() {
  const {
    data: reviewsResponse,
    isLoading,
    isError,
  } = useGetStaffMeReviewsQuery();

  const reviewsData = reviewsResponse?.data;
  const summary = reviewsData?.summary;
  const reviewsList = Array.isArray(reviewsData?.reviews)
    ? reviewsData.reviews
    : [];

  const avgRating =
    summary?.average_rating !== undefined
      ? summary.average_rating.toFixed(1)
      : "4.9";
  const totalReviews =
    summary?.total_reviews !== undefined
      ? summary.total_reviews
      : reviewsList.length;
  const dist = summary?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Reviews" />

      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-400">
            Loading reviews...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-16 items-center justify-center px-6">
          <Text className="font-poppins-medium text-red-500 text-sm text-center">
            Failed to load reviews.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Overall Rating Summary Card */}
          <View className="mb-6 flex-row items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
            {/* Left Column: Overall Rating */}
            <View className="items-center px-2">
              <Text className="font-poppins-bold text-3xl text-gray-900">
                {avgRating}
              </Text>

              {/* 5 Yellow Stars */}
              <View className="my-1.5 flex-row items-center gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <StyledIcons
                    key={item}
                    className="text-amber-400"
                    name="star"
                    size={16}
                  />
                ))}
              </View>

              <Text className="font-poppins-medium text-xs text-gray-500">
                {totalReviews} reviews
              </Text>
            </View>

            {/* Right Column: Rating Breakdown Progress Bars */}
            <View className="flex-1 pl-6 gap-1.5">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const key = String(starNum) as keyof typeof dist;
                const count = dist[key] || 0;
                const percent =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <View className="flex-row items-center gap-2" key={starNum}>
                    <Text className="w-2 font-poppins text-xs text-gray-600">
                      {starNum}
                    </Text>
                    <StyledIcons
                      className="text-gray-400"
                      name="star"
                      size={14}
                    />
                    <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <View
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${percent}%` }}
                      />
                    </View>
                    <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                      {count}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Dynamic Review Cards */}
          {reviewsList.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Text className="font-poppins text-gray-400 text-sm">
                No data here
              </Text>
            </View>
          ) : (
            reviewsList.map((rev) => (
              <StaffReviewCard
                comment={rev.comment}
                customerAvatar={rev.customer_avatar}
                customerName={rev.customer_name}
                date={rev.date}
                key={rev.id}
                rating={rev.rating}
              />
            ))
          )}
        </ScrollView>
      )}
    </Container>
  );
}
