import type { Ionicons } from "@expo/vector-icons";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface BusinessHour {
  day: string;
  hours: string;
  id: string;
}

interface SocialLink {
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize: number;
  id: string;
  name: string;
}

const SALON_INFO_DATA = {
  about:
    "and my hair looks fantastic. Will definitely and my hair looks fantastic. Will definitelyand my hair looks fantastic. Will definitely",
  address: "123 Beauty Street, Downtown, City 12345",
  mapImage:
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
  name: "Glam Beauty Salon",
};

const BUSINESS_HOURS: BusinessHour[] = [
  { id: "1", day: "Tuesday", hours: "9:00 AM -6 PM" },
  { id: "2", day: "Wednesday", hours: "9:00 AM -6 PM" },
  { id: "3", day: "Thursday", hours: "9:00 AM -6 PM" },
  { id: "4", day: "Friday", hours: "9:00 AM -6 PM" },
  { id: "5", day: "Saturday", hours: "10:00 AM -4 PM" },
  { id: "6", day: "Sunday", hours: "Closed" },
  { id: "7", day: "Holiday", hours: "Varies" },
];

const SOCIAL_MEDIA_LINKS: SocialLink[] = [
  { id: "1", name: "TikTok", iconName: "logo-tiktok", iconSize: 22 },
  { id: "2", name: "Instagram", iconName: "logo-instagram", iconSize: 22 },
  { id: "3", name: "Phone", iconName: "call", iconSize: 20 },
  { id: "4", name: "WhatsApp", iconName: "logo-whatsapp", iconSize: 22 },
];

export const SalonDetailsTab = () => {
  return (
    <View className="pt-2 pb-6">
      {/* Map & Address Box Container */}
      <View className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
        {/* Map Header Graphic */}
        <View className="relative h-32 w-full items-center justify-center bg-gray-100">
          <Image
            contentFit="cover"
            source={{ uri: SALON_INFO_DATA.mapImage }}
            style={{ height: "100%", opacity: 0.5, width: "100%" }}
          />
          <View className="absolute items-center justify-center">
            <StyledIcons className="text-[#FF2D55]" name="location" size={34} />
          </View>
        </View>

        {/* Address Card Info */}
        <View className="-mt-5 mx-3 mb-3 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <View>
            <Text className="font-poppins-bold text-base text-gray-900">
              {SALON_INFO_DATA.name}
            </Text>
            <Text className="mt-1 max-w-[210px] font-poppins text-xs leading-relaxed text-gray-400">
              {SALON_INFO_DATA.address}
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
        {SALON_INFO_DATA.about}
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
        Social media
      </Text>
      <View className="flex-row items-center justify-center gap-8 rounded-2xl bg-gray-50/80 p-4">
        {SOCIAL_MEDIA_LINKS.map((link) => (
          <Pressable className="active:opacity-75" key={link.id}>
            <StyledIcons
              className="text-gray-900"
              name={link.iconName}
              size={link.iconSize}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default SalonDetailsTab;
