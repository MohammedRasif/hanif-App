import { Link, useRouter, type Href } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useGetShopsQuery } from "@/Redux/feature/shop";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80";

export default function UserHomeScreen() {
  const router = useRouter();
  const { data: shopsResponse, isLoading, isError } = useGetShopsQuery();
  const shops = Array.isArray(shopsResponse?.data)
    ? shopsResponse.data
    : Array.isArray(shopsResponse)
      ? shopsResponse
      : [];

  return (
    <Container isScrollable={true}>
      <View className="flex-1 bg-white px-2 pt-14 pb-8">
        {/* Header Section */}
        <View className="mb-6 flex-row items-center justify-between px-3">
          <View className="flex-row items-center gap-3">
            <Image
              className="h-12 w-12 rounded-full"
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              }}
            />
            <View>
              <Text className="font-bold text-foreground text-lg">
                Welcome, Maïa
              </Text>
              <Text className="mt-0.5 text-default-400 text-xs">
                Let's find your next treatment
              </Text>
            </View>
          </View>
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-default-100 active:opacity-75"
            onPress={() => router.push("/notification")}
          >
            <StyledIcons
              className="text-default-600"
              name="notifications"
              size={20}
            />
          </Pressable>
        </View>

        {/* Choose Shop Vertical List */}
        <View>
          <Text className="mb-4 px-3 font-bold text-foreground text-xl tracking-tight">
            Choose shop
          </Text>

          {isLoading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#F0B100" size="large" />
              <Text className="mt-3 font-medium text-gray-500 text-sm">
                Loading shops...
              </Text>
            </View>
          ) : isError ? (
            <View className="py-12 items-center justify-center">
              <Text className="font-medium text-red-500 text-sm">
                Failed to load shops. Please try again.
              </Text>
            </View>
          ) : shops.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Text className="font-medium text-gray-500 text-sm">
                No shops available.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {shops.map((shop) => {
                const coverImageUri =
                  shop.cover_image || shop.logo || DEFAULT_COVER;
                const rating = shop.review?.average_rating
                  ? shop.review.average_rating.toFixed(1)
                  : "0.0";
                const reviewsCount = `${shop.review?.count || 0} reviews`;

                return (
                  <Link
                    asChild
                    href={`/(role)/user/salon/${shop.id}` as Href}
                    key={shop.id}
                  >
                    <Pressable className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-3.5 shadow-xs active:opacity-95">
                      {/* Image cover with rating overlay */}
                      <View className="relative h-44 w-full overflow-hidden rounded-2xl bg-default-100">
                        <Image
                          className="h-full w-full"
                          source={{ uri: coverImageUri }}
                        />
                        <View className="absolute top-3 right-3 flex-row items-center gap-1.5 rounded-xl bg-black/60 px-2.5 py-1">
                          <Text className="font-bold text-[#F0B100] text-xs">
                            {rating}
                          </Text>
                          <Text className="font-medium text-[10px] text-white/90">
                            {reviewsCount}
                          </Text>
                        </View>
                      </View>
                      {/* Info */}
                      <View className="pt-3 px-1">
                        <Text className="font-bold text-base text-foreground">
                          {shop.name}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-1">
                          <StyledIcons
                            className="text-gray-400"
                            name="location-outline"
                            size={14}
                          />
                          <Text className="text-gray-500 text-xs font-normal">
                            {shop.location || "Location unavailable"}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Container>
  );
}
