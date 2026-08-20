import { useGetShopGalleryQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface SalonGalleryTabProps {
  shopId?: string | number;
}

export const SalonGalleryTab: React.FC<SalonGalleryTabProps> = ({ shopId }) => {
  const {
    data: galleryResponse,
    isLoading,
    isError,
  } = useGetShopGalleryQuery(shopId || "", { skip: !shopId });

  const galleryList = Array.isArray(galleryResponse?.data)
    ? galleryResponse.data
    : Array.isArray(galleryResponse)
      ? galleryResponse
      : [];

  if (isLoading) {
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator color="#F0B100" size="small" />
        <Text className="mt-2 font-poppins text-xs text-gray-500">
          Loading gallery...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-6 items-center justify-center">
        <Text className="font-poppins text-xs text-red-500">
          Failed to load gallery images.
        </Text>
      </View>
    );
  }

  if (!Array.isArray(galleryList) || galleryList.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <Text className="font-poppins-medium text-sm text-gray-500">
          No gallery images available.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-y-3.5 pt-2">
      {galleryList.map((item, index) => (
        <View
          className="aspect-square w-[31%] mr-[2%] overflow-hidden rounded-2xl bg-gray-100"
          key={item.id || index}
        >
          <Image
            contentFit="cover"
            source={{ uri: item.image }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      ))}
    </View>
  );
};

export default SalonGalleryTab;
