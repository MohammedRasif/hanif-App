import { Container } from "@/components/container";
import { StaffReviewCard } from "@/components/staff/profile/staff-review-card";
import { StaffProfileTopHeader } from "@/components/staff/profile/staff-profile-top-header";
import { StyledIcons } from "@/lib";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function StaffReviewsScreen() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Reviews" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Rating Summary Card */}
        <View className="mb-6 flex-row items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          {/* Left Column: Overall Rating */}
          <View className="items-center px-2">
            <Text className="font-poppins-bold text-3xl text-gray-900">
              4.9
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
              589 reviews
            </Text>
          </View>

          {/* Right Column: Rating Breakdown Progress Bars */}
          <View className="flex-1 pl-6 gap-1.5">
            {/* 5 Stars Bar */}
            <View className="flex-row items-center gap-2">
              <Text className="w-2 font-poppins text-xs text-gray-600">5</Text>
              <StyledIcons className="text-gray-400" name="star" size={14} />
              <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <View className="h-full w-[80%] rounded-full bg-amber-400" />
              </View>
              <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                120
              </Text>
            </View>

            {/* 4 Stars Bar */}
            <View className="flex-row items-center gap-2">
              <Text className="w-2 font-poppins text-xs text-gray-600">4</Text>
              <StyledIcons className="text-gray-400" name="star" size={14} />
              <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <View className="h-full w-[25%] rounded-full bg-amber-400" />
              </View>
              <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                12
              </Text>
            </View>

            {/* 3 Stars Bar */}
            <View className="flex-row items-center gap-2">
              <Text className="w-2 font-poppins text-xs text-gray-600">3</Text>
              <StyledIcons className="text-gray-400" name="star" size={14} />
              <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <View className="h-full w-[25%] rounded-full bg-amber-400" />
              </View>
              <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                12
              </Text>
            </View>

            {/* 2 Stars Bar */}
            <View className="flex-row items-center gap-2">
              <Text className="w-2 font-poppins text-xs text-gray-600">2</Text>
              <StyledIcons className="text-gray-400" name="star" size={14} />
              <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <View className="h-full w-[25%] rounded-full bg-amber-400" />
              </View>
              <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                12
              </Text>
            </View>

            {/* 1 Star Bar */}
            <View className="flex-row items-center gap-2">
              <Text className="w-2 font-poppins text-xs text-gray-600">1</Text>
              <StyledIcons className="text-gray-400" name="star" size={14} />
              <View className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <View className="h-full w-[25%] rounded-full bg-amber-400" />
              </View>
              <Text className="w-6 font-poppins text-xs text-gray-600 text-right">
                12
              </Text>
            </View>
          </View>
        </View>

        {/* Reusable Review Cards (Static) */}
        <StaffReviewCard />
        <StaffReviewCard />
        <StaffReviewCard />
      </ScrollView>
    </Container>
  );
}
