import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=400&q=80",
];

export const SalonGalleryTab = () => {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3.5 pt-2">
      {GALLERY_IMAGES.map((imgUri, index) => (
        <View
          className="aspect-square w-[31%] overflow-hidden rounded-2xl bg-gray-100"
          key={index}
        >
          <Image
            contentFit="cover"
            source={{ uri: imgUri }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      ))}
    </View>
  );
};

export default SalonGalleryTab;
