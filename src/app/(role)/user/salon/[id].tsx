import { Container } from "@/components/container";
import { BarberSandServices, SalonTabs } from "@/components/user/salon";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

const SALON_COVER_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80";

const TABS = [
  { id: "barbers-services", label: "Barbers & Services" },
  { id: "reviews", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "details", label: "Details" },
];

export default function SalonDetailScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("barbers-services");

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white pb-10">
        {/* Cover Image Header */}
        <View className="relative h-64 w-full bg-gray-100">
          <Image
            contentFit="cover"
            source={{ uri: SALON_COVER_IMAGE }}
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
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs active:bg-gray-100">
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
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-bold text-2xl text-gray-900 tracking-tight">
              Barbers Bay
            </Text>

            {/* Rating */}
            <View className="flex-row items-center gap-1">
              <StyledIcons className="text-[#F0B100]" name="star" size={18} />
              <Text className="font-poppins-bold text-base text-gray-900">
                4.9
              </Text>
              <Text className="font-poppins text-sm text-gray-400">
                (243 reviews)
              </Text>
            </View>
          </View>

          {/* Open Status Row */}
          <View className="mt-2 flex-row items-center gap-2">
            <View className="rounded-full bg-[#00B049] px-3 py-1">
              <Text className="font-poppins-medium text-xs text-white">
                Open Now
              </Text>
            </View>
            <Text className="font-poppins text-xs text-gray-500">
              • Closes at 8:00 PM
            </Text>
          </View>
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
            {activeTab === "barbers-services" && <BarberSandServices />}

            {activeTab === "reviews" && (
              <View className="py-12 items-center justify-center">
                <Text className="font-poppins-medium text-sm text-gray-400">
                  Reviews Content Coming Soon
                </Text>
              </View>
            )}

            {activeTab === "gallery" && (
              <View className="py-12 items-center justify-center">
                <Text className="font-poppins-medium text-sm text-gray-400">
                  Gallery Content Coming Soon
                </Text>
              </View>
            )}

            {activeTab === "details" && (
              <View className="py-12 items-center justify-center">
                <Text className="font-poppins-medium text-sm text-gray-400">
                  Details Content Coming Soon
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Container>
  );
}
