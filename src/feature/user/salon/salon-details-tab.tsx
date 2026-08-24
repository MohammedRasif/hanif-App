import type { Ionicons } from "@expo/vector-icons";
import { StyledIcons } from "@/lib";
import { type ShopDetails, useGetShopDetailsQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface SalonDetailsTabProps {
  shopDetails?: ShopDetails;
  shopId?: string | number;
}

const DEFAULT_MAP_IMAGE =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80";

const BUSINESS_HOURS = [
  { id: "1", day: "Tuesday", hours: "9:00 AM - 6 PM" },
  { id: "2", day: "Wednesday", hours: "9:00 AM - 6 PM" },
  { id: "3", day: "Thursday", hours: "9:00 AM - 6 PM" },
  { id: "4", day: "Friday", hours: "9:00 AM - 6 PM" },
  { id: "5", day: "Saturday", hours: "10:00 AM - 4 PM" },
  { id: "6", day: "Sunday", hours: "Closed" },
  { id: "7", day: "Holiday", hours: "Varies" },
];

export const SalonDetailsTab: React.FC<SalonDetailsTabProps> = ({
  shopDetails: initialShopDetails,
  shopId,
}) => {
  const { data: detailsResponse, isLoading } = useGetShopDetailsQuery(
    shopId || "",
    { skip: !shopId || !!initialShopDetails },
  );

  const details = initialShopDetails || detailsResponse?.data;

  if (isLoading && !details) {
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator color="#F0B100" size="small" />
        <Text className="mt-2 font-poppins text-xs text-gray-500">
          Loading shop details...
        </Text>
      </View>
    );
  }

  const socialLinks: {
    id: string;
    name: string;
    iconName: keyof typeof Ionicons.glyphMap;
    value?: string | null;
  }[] = [
    {
      id: "1",
      name: "TikTok",
      iconName: "logo-tiktok",
      value: details?.tiktok,
    },
    {
      id: "2",
      name: "Instagram",
      iconName: "logo-instagram",
      value: details?.instagram,
    },
    { id: "3", name: "Phone", iconName: "call", value: details?.phone },
    {
      id: "4",
      name: "WhatsApp",
      iconName: "logo-whatsapp",
      value: details?.whatsapp,
    },
  ];

  return (
    <View className="pt-2 pb-6">
      {/* Map & Address Box Container */}
      <View className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        {/* Map Header Graphic */}
        <View className="relative h-32 w-full items-center justify-center bg-gray-100">
          <Image
            contentFit="cover"
            source={{ uri: details?.cover_image || DEFAULT_MAP_IMAGE }}
            style={{ height: "100%", opacity: 0.5, width: "100%" }}
          />
          <View className="absolute items-center justify-center">
            <StyledIcons className="text-[#FF2D55]" name="location" size={34} />
          </View>
        </View>

        {/* Address Card Info */}
        <View className="-mt-5 mx-3 mb-3 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <View className="flex-1 pr-2">
            <Text className="font-poppins-bold text-base text-gray-900">
              {details?.name || "Salon"}
            </Text>
            <Text className="mt-1 font-poppins text-xs leading-relaxed text-gray-400">
              {details?.location || "No address specified"}
            </Text>
          </View>

          {/* Navigation Action Button */}
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100">
            <StyledIcons
              className="text-gray-900"
              name="navigate-outline"
              size={18}
            />
          </Pressable>
        </View>
      </View>

      {/* About Us Section */}
      <Text className="mb-2 font-poppins-bold text-base text-gray-900">
        About us
      </Text>
      <Text className="mb-6 font-poppins text-xs leading-relaxed text-gray-600">
        {details?.about_us || "No description available for this shop."}
      </Text>

      {/* Business Hours Section */}
      <Text className="mb-3 font-poppins-bold text-base text-gray-900">
        Business hours
      </Text>
      <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-4">
        {BUSINESS_HOURS.map((item, index) => (
          <View
            className={`flex-row items-center justify-between py-2.5 ${
              index !== BUSINESS_HOURS.length - 1
                ? "border-b border-gray-50"
                : ""
            }`}
            key={item.id}
          >
            <Text className="font-poppins-medium text-xs text-gray-700">
              {item.day}
            </Text>
            <View className="rounded-xl bg-gray-50 px-3 py-1">
              <Text className="font-poppins text-[11px] text-gray-500">
                {item.hours}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Social Media Section */}
      <Text className="mb-3 font-poppins-bold text-base text-gray-900">
        Social media & Contact
      </Text>
      <View className="flex-row items-center justify-center gap-8 rounded-2xl bg-gray-50/80 p-4">
        {socialLinks.map((link) => (
          <Pressable className="active:opacity-75" key={link.id}>
            <StyledIcons
              className={link.value ? "text-gray-900" : "text-gray-300"}
              name={link.iconName}
              size={22}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SalonDetailsTab;
