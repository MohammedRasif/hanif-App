import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface Barber {
  avatar: string;
  id: string;
  name: string;
  rating: string;
  reviews: string;
}

interface Service {
  duration: string;
  id: string;
  price: string;
  subtitle: string;
  title: string;
}

const BARBERS: Barber[] = [
  {
    id: "1",
    name: "Leslie",
    rating: "4.5",
    reviews: "20",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "Courtney",
    rating: "4.5",
    reviews: "20",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "3",
    name: "Courtney",
    rating: "4.5",
    reviews: "20",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "4",
    name: "Arlene",
    rating: "4.5",
    reviews: "20",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "5",
    name: "Arlene",
    rating: "4.5",
    reviews: "20",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

const SERVICES: Service[] = [
  {
    id: "1",
    title: "Haircut & Style",
    subtitle: "Professional cut with styling",
    duration: "45 min",
    price: "$65",
  },
  {
    id: "2",
    title: "Haircut & Style",
    subtitle: "Professional cut with styling",
    duration: "45 min",
    price: "$65",
  },
  {
    id: "3",
    title: "Haircut & Style",
    subtitle: "Professional cut with styling",
    duration: "45 min",
    price: "$65",
  },
];

export const BarberSandServices = () => {
  return (
    <View className="pt-2">
      {/* Barbers Section */}
      <Text className="mb-3.5 font-poppins-bold text-base text-gray-900">
        Barbers
      </Text>
      <ScrollView
        contentContainerStyle={{ gap: 14 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {BARBERS.map((barber) => (
          <View className="items-center" key={barber.id}>
            <Image
              contentFit="cover"
              source={{ uri: barber.avatar }}
              style={{ borderRadius: 32, height: 64, width: 64 }}
            />
            {/* Rating pill badge */}
            <View className="-mt-2.5 flex-row items-center gap-0.5 rounded-full border border-gray-100 bg-white px-2 py-0.5 shadow-2xs">
              <Text className="font-poppins-semibold text-[10px] text-gray-800">
                {barber.rating}
              </Text>
              <StyledIcons className="text-[#F0B100]" name="star" size={10} />
              <Text className="font-poppins text-[10px] text-gray-400">
                ({barber.reviews})
              </Text>
            </View>
            <Text className="mt-1 font-poppins-medium text-xs text-gray-600 text-center">
              {barber.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Services Section */}
      <Text className="mt-6 mb-3 font-poppins-bold text-base text-gray-900">
        Services
      </Text>

      {/* Accordion / Category Header */}
      <Pressable className="mb-2 flex-row items-center justify-between py-2">
        <Text className="font-poppins-semibold text-sm text-gray-900">
          Haircut & Style
        </Text>
        <StyledIcons className="text-gray-600" name="chevron-down" size={18} />
      </Pressable>

      {/* Service List */}
      <View className="gap-3">
        {SERVICES.map((service) => (
          <View
            className="flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4"
            key={service.id}
          >
            <View>
              <Text className="font-poppins-semibold text-sm text-gray-900">
                {service.title}
              </Text>
              <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                {service.subtitle}
              </Text>
              <Text className="mt-1 font-poppins text-xs text-gray-400">
                {service.duration}
              </Text>
            </View>

            <Text className="font-poppins-bold text-base text-gray-900">
              {service.price}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default BarberSandServices;
