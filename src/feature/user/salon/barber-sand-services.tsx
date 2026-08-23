import { StyledIcons } from "@/lib";
import {
  useGetBarbersQuery,
  useGetShopServicesQuery,
} from "@/Redux/feature/shop";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

interface BarberSandServicesProps {
  shopId?: string | number;
}

export const BarberSandServices: React.FC<BarberSandServicesProps> = ({
  shopId,
}) => {
  const {
    data: servicesResponse,
    isLoading,
    isError,
  } = useGetShopServicesQuery(shopId || "", { skip: !shopId });

  const { data: barbersResponse, isLoading: isBarbersLoading } =
    useGetBarbersQuery(shopId || "", { skip: !shopId });

  const services = Array.isArray(servicesResponse?.data)
    ? servicesResponse.data
    : Array.isArray(servicesResponse)
      ? servicesResponse
      : [];

  const barbers = Array.isArray(barbersResponse?.data)
    ? barbersResponse.data
    : Array.isArray(barbersResponse)
      ? barbersResponse
      : [];

  return (
    <View className="pt-2">
      {/* Barbers Section */}
      <Text className="mb-3.5 font-poppins-bold text-base text-gray-900">
        Barbers
      </Text>

      {isBarbersLoading ? (
        <View className="py-4 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
        </View>
      ) : barbers.length === 0 ? (
        <Text className="font-poppins text-xs text-gray-400 mb-4">
          No barbers available for this shop.
        </Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ gap: 14 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {barbers.map((barber) => {
            const avatar = barber.user_details?.image || DEFAULT_AVATAR;
            const name =
              barber.user_details?.name || barber.user_name || "Barber";
            const rating = barber.review?.average_rating
              ? barber.review.average_rating.toFixed(1)
              : "0.0";
            const reviewsCount = barber.review?.count || 0;

            return (
              <Pressable
                className="items-center active:opacity-80"
                key={barber.id}
                onPress={() =>
                  router.push({
                    pathname: "/(role)/user/salon/choose-a-service",
                    params: {
                      barberId: String(barber.id),
                      barberName: name,
                      barberImage: avatar,
                      shopId: String(shopId || ""),
                      rating,
                      reviewsCount: String(reviewsCount),
                    },
                  })
                }
              >
                <Image
                  contentFit="cover"
                  source={{ uri: avatar }}
                  style={{ borderRadius: 32, height: 64, width: 64 }}
                />
                {/* Rating pill badge */}
                <View className="-mt-2.5 flex-row items-center gap-0.5 rounded-full border border-gray-100 bg-white px-2 py-0.5 shadow-2xs">
                  <Text className="font-poppins-semibold text-[10px] text-gray-800">
                    {rating}
                  </Text>
                  <StyledIcons
                    className="text-[#F0B100]"
                    name="star"
                    size={10}
                  />
                  <Text className="font-poppins text-[10px] text-gray-400">
                    ({reviewsCount})
                  </Text>
                </View>
                <Text className="mt-1 font-poppins-medium text-xs text-gray-600 text-center">
                  {name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Services Section */}
      <Text className="mt-6 mb-3 font-poppins-bold text-base text-gray-900">
        Services & Prices
      </Text>

      {isLoading ? (
        <View className="py-6 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-500">
            Loading services...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-4 items-center justify-center">
          <Text className="font-poppins text-xs text-red-500">
            Failed to load services.
          </Text>
        </View>
      ) : services.length === 0 ? (
        <View className="py-6 items-center justify-center">
          <Text className="font-poppins text-xs text-gray-500">
            No services found for this shop.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {services.map((service) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(role)/user/salon/choose-a-proffetinal",
                  params: {
                    shopId: String(shopId || ""),
                    serviceId: String(service.id),
                    serviceName: service.name,
                    servicePrice: `$${service.price}`,
                    serviceDuration: `${service.duration_minutes} min`,
                    selectedServices: JSON.stringify([
                      {
                        id: String(service.id),
                        title: service.name,
                        price: `$${service.price}`,
                        duration: `${service.duration_minutes} min`,
                      },
                    ]),
                  },
                })
              }
              className="flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4 active:bg-gray-100"
              key={service.id}
            >
              <View className="flex-1 pr-3">
                <Text className="font-poppins-semibold text-sm text-gray-900">
                  {service.name}
                </Text>
                {service.description ? (
                  <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                    {service.description}
                  </Text>
                ) : null}
                <Text className="mt-1 font-poppins text-xs text-gray-400">
                  {service.duration_minutes} min
                </Text>
              </View>

              <Text className="font-poppins-bold text-base text-gray-900">
                ${service.price}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default BarberSandServices;
