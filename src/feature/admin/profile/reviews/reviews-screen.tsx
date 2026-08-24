import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { MOCK_REVIEWS_LIST, MOCK_REVIEWS_SUMMARY } from "./mock-data";
import type { ReviewsProps } from "./types";

export function ReviewsScreen({ onBack }: ReviewsProps) {
  const router = useRouter();

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

      {/* Main Content List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
        data={MOCK_REVIEWS_LIST}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          /* Rating Summary Card */
          <View className="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
            <View className="flex-row items-center justify-between">
              {/* Left Column: Overall Rating */}
              <View className="items-center justify-center pr-4 border-r border-gray-100">
                <Text className="font-bold text-4xl text-gray-900 mb-1">
                  {MOCK_REVIEWS_SUMMARY.averageRating}
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
                  {MOCK_REVIEWS_SUMMARY.totalReviews} reviews
                </Text>
              </View>

              {/* Right Column: Breakdown Bars */}
              <View className="flex-1 pl-4 gap-1.5">
                {MOCK_REVIEWS_SUMMARY.breakdown.map((row) => (
                  <View className="flex-row items-center gap-2" key={row.stars}>
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
    </View>
  );
}
