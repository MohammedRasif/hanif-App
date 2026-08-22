import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useGetShopServicesQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export interface ServiceItem {
  description?: string;
  duration: string;
  id: string;
  price: string;
  title: string;
}

const ALL_SERVICES: ServiceItem[] = [
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "s1",
    price: "$65",
    title: "Haircut & Style",
  },
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "s2",
    price: "$65",
    title: "Haircut & Style",
  },
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "s3",
    price: "$65",
    title: "Haircut & Style",
  },
  {
    description: "Full color application",
    duration: "90 min",
    id: "s4",
    price: "$120",
    title: "Color Treatment",
  },
  {
    description: "Long-lasting curls or waves",
    duration: "120 min",
    id: "s5",
    price: "$150",
    title: "Perm",
  },
];

export default function ChooseAServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    barberId?: string;
    barberUserId?: string;
    barberName?: string;
    barberImage?: string;
    availability?: string;
    rating?: string;
    reviewsCount?: string;
    shopId?: string;
  }>();

  const barberName = params.barberName || "Esther Howard";
  const barberImage =
    params.barberImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  const availability = params.availability || "Available today";
  const rating = params.rating || "4.5";
  const reviewsCount = params.reviewsCount || "20";

  const { data: servicesResponse, isLoading } = useGetShopServicesQuery(
    {
      shop: params.shopId,
      barber: params.barberUserId || params.barberId,
    },
    { skip: !params.shopId && !params.barberUserId && !params.barberId },
  );

  const shopServices = Array.isArray(servicesResponse?.data)
    ? servicesResponse.data
    : Array.isArray(servicesResponse)
      ? servicesResponse
      : [];

  const displayServices: ServiceItem[] =
    shopServices.length > 0
      ? shopServices.map((s) => ({
          id: String(s.id),
          title: s.name,
          description: s.description || undefined,
          duration: `${s.duration_minutes} min`,
          price: `$${s.price}`,
        }))
      : ALL_SERVICES;

  const handleSelectService = (service: ServiceItem) => {
    router.push({
      pathname: "/(role)/user/salon/choose-time",
      params: {
        shopId: params.shopId || "",
        barberId: params.barberId || "2",
        barberUserId: params.barberUserId || "",
        barberName,
        barberImage,
        serviceId: service.id,
        selectedServices: JSON.stringify([service]),
      },
    } as Href);
  };

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-6 pb-12">
        {/* Top Header */}
        <View className="flex-row items-center pb-6">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={() => router.back()}
          >
            <StyledIcons
              className="text-gray-900"
              name="chevron-back"
              size={22}
            />
          </Pressable>
          <Text className="flex-1 text-center pr-10 font-poppins-bold text-xl text-gray-900">
            Choose a Service
          </Text>
        </View>

        {/* Selected Professional Summary */}
        <View className="mb-8 flex-row items-center gap-4">
          <View className="items-center">
            <View className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
              <Image
                contentFit="cover"
                source={{ uri: barberImage }}
                style={{ height: "100%", width: "100%" }}
              />
            </View>
            {/* Rating Badge Overlay */}
            <View className="-mt-3 flex-row items-center gap-0.5 rounded-full border border-gray-100 bg-white px-2 py-0.5 shadow-xs">
              <Text className="font-poppins-medium text-[10px] text-gray-700">
                {rating}
              </Text>
              <StyledIcons className="text-[#F0B100]" name="star" size={10} />
              <Text className="font-poppins text-[10px] text-gray-400">
                ({reviewsCount})
              </Text>
            </View>
          </View>

          <View className="-mt-3">
            <Text className="font-poppins-medium text-lg text-gray-900">
              {barberName}
            </Text>
            <Text className="mt-0.5 font-poppins text-xs text-[#00B049]">
              • {availability}
            </Text>
          </View>
        </View>

        {/* Services Heading */}
        <Text className="mb-3.5 font-poppins-bold text-base text-gray-900">
          Services
        </Text>

        {/* Service List */}
        {isLoading ? (
          <View className="py-6 items-center justify-center">
            <ActivityIndicator color="#F0B100" size="small" />
            <Text className="mt-2 font-poppins text-xs text-gray-400">
              Loading services...
            </Text>
          </View>
        ) : (
          <View className="gap-3.5">
            {displayServices.map((service) => (
              <Pressable
                className="flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4 border border-gray-100/50 active:bg-gray-100"
                key={service.id}
                onPress={() => handleSelectService(service)}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-poppins-semibold text-sm text-gray-900">
                    {service.title}
                  </Text>
                  {service.description ? (
                    <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                      {service.description}
                    </Text>
                  ) : null}
                  <Text className="mt-1 font-poppins text-xs text-gray-400">
                    {service.duration}
                  </Text>
                </View>

                <Text className="font-poppins-bold text-base text-gray-900">
                  {service.price}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Container>
  );
}
