import { Container } from "@/components/container";
import {
  BarberSandServices,
  SalonDetailsTab,
  SalonGalleryTab,
  SalonReviewsTab,
  SalonTabs,
} from "@/feature/user/salon";
import { StyledIcons } from "@/lib";
import { useGetShopDetailsQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Share, Text, View } from "react-native";

const SALON_COVER_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80";

const TABS = [
  { id: "barbers-services", label: "Services & Prices" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "details", label: "Details" },
];

export default function SalonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("barbers-services");

  const { data: detailsResponse, isLoading } = useGetShopDetailsQuery(
    id || "",
    { skip: !id },
  );

  const shopDetails = detailsResponse?.data;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${shopDetails?.name || "Salon"} on our app!`,
        title: shopDetails?.name || "Salon",
      });
    } catch (error) {
      console.error("Error sharing salon details:", error);
    }
  };

  const coverUri =
    shopDetails?.cover_image || shopDetails?.logo || SALON_COVER_IMAGE_FALLBACK;

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white pb-10">
        {/* Cover Image Header */}
        <View className="relative h-64 w-full bg-gray-100">
          <Image
            contentFit="cover"
            source={{ uri: coverUri }}
            style={{ width: "100%", height: "100%" }}
          />

          {/* Top Floating Buttons */}
          <View className="absolute top-12 left-0 right-0 flex-row items-center justify-between px-6">
            {/* Back Button */}
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs active:bg-gray-100"
              onPress={() => router.back()}
            >
              <StyledIcons
                className="text-gray-900"
                name="chevron-back"
                size={22}
              />
            </Pressable>

            {/* Share Button */}
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs active:bg-gray-100"
              onPress={handleShare}
            >
              <StyledIcons
                className="text-gray-900"
                name="arrow-redo-outline"
                size={20}
              />
            </Pressable>
          </View>
        </View>

        {/* Salon Summary Info */}
        <View className="px-6 pt-5 pb-3">
          {isLoading && !shopDetails ? (
            <ActivityIndicator color="#F0B100" size="small" />
          ) : (
            <>
              <View className="flex-row items-center justify-between">
                <Text className="font-poppins-bold text-2xl text-gray-900 tracking-tight flex-1 pr-2">
                  {shopDetails?.name || "Salon Details"}
                </Text>

                {/* Rating */}
                <View className="flex-row items-center gap-1">
                  <StyledIcons
                    className="text-[#F0B100]"
                    name="star"
                    size={18}
                  />
                  <Text className="font-poppins-bold text-base text-gray-900">
                    {shopDetails?.google_review_link === null
                      ? "0.0"
                      : shopDetails?.google_review_link}
                  </Text>
                  <Text className="font-poppins text-sm text-gray-400">
                    (reviews)
                  </Text>
                </View>
              </View>

              {/* Location / Status Row */}
              <View className="mt-2 flex-row items-center gap-2">
                <View className="rounded-full bg-[#00B049] px-3 py-1">
                  <Text className="font-poppins-medium text-xs text-white">
                    Open Now
                  </Text>
                </View>
                {shopDetails?.location ? (
                  <Text
                    className="font-poppins text-xs text-gray-500 flex-1"
                    numberOfLines={1}
                  >
                    • {shopDetails.location}
                  </Text>
                ) : null}
              </View>
            </>
          )}
        </View>

        {/* Custom Salon Tabs */}
        <View className="px-6 pt-2">
          <SalonTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={TABS}
          />

          {/* Active Tab Content */}
          <View className="pt-4">
            {activeTab === "barbers-services" && (
              <BarberSandServices shopId={id} />
            )}

            {activeTab === "reviews" && <SalonReviewsTab shopId={id} />}

            {activeTab === "gallery" && <SalonGalleryTab shopId={id} />}

            {activeTab === "details" && (
              <SalonDetailsTab shopDetails={shopDetails} shopId={id} />
            )}
          </View>
        </View>
      </View>
    </Container>
  );
}
