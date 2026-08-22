import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useGetBarbersQuery } from "@/Redux/feature/shop";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

interface Professional {
  availability: string;
  id: string;
  userId?: string;
  image?: string;
  isAnyone?: boolean;
  isAvailableToday: boolean;
  name: string;
}

const FALLBACK_PROFESSIONALS: Professional[] = [
  {
    availability: "Available today",
    id: "anyone",
    isAnyone: true,
    isAvailableToday: true,
    name: "Anyone",
  },
  {
    availability: "Available today",
    id: "1",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: true,
    name: "Esther Howard",
  },
  {
    availability: "Available today",
    id: "2",
    image: DEFAULT_AVATAR,
    isAvailableToday: true,
    name: "Esther Howard",
  },
];

export default function ChooseAProphetical() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    shopId?: string;
    serviceId?: string;
    serviceName?: string;
    selectedServices?: string;
  }>();

  const { data: barbersResponse, isLoading } = useGetBarbersQuery(
    {
      shop: params.shopId,
      service: params.serviceId,
    },
    { skip: !params.shopId },
  );

  const [selectedId, setSelectedId] = useState<string>("anyone");

  const barbersList: Professional[] = React.useMemo(() => {
    const anyoneCard: Professional = {
      availability: "Available today",
      id: "anyone",
      isAnyone: true,
      isAvailableToday: true,
      name: "Anyone",
    };

    if (
      Array.isArray(barbersResponse?.data) &&
      barbersResponse.data.length > 0
    ) {
      const mapped = barbersResponse.data.map((b) => ({
        id: String(b.id),
        userId: b.user_details?.id || b.user,
        name: b.user_details?.name || b.user_name || "Barber",
        image: b.user_details?.image || DEFAULT_AVATAR,
        isAvailableToday: b.is_available,
        availability: b.is_available ? "Available today" : "Not available",
      }));
      return [anyoneCard, ...mapped];
    }

    return FALLBACK_PROFESSIONALS;
  }, [barbersResponse]);

  const handleSelectProfessional = (pro: Professional) => {
    setSelectedId(pro.id);

    // If "Anyone" selected, use first available barber's numeric id or "anyone"
    const targetBarberId = pro.isAnyone
      ? barbersList.find((b) => !b.isAnyone)?.id || "anyone"
      : pro.id;

    router.push({
      pathname: "/(role)/user/salon/choose-time",
      params: {
        shopId: params.shopId || "",
        serviceId: params.serviceId || "",
        barberId: targetBarberId,
        barberUserId: pro.userId || "",
        barberName: pro.isAnyone ? "Anyone" : pro.name,
        barberImage: pro.image || "",
        availability: pro.availability,
        isAvailableToday: pro.isAvailableToday ? "true" : "false",
        isAnyone: pro.isAnyone ? "true" : "false",
        selectedServices: params.selectedServices || "[]",
      },
    } as Href);
  };

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white relative pb-12">
        {/* Top Header */}
        <View className="flex-row items-center px-6 pt-6 pb-4">
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
          <Text className="flex-1 text-center pr-10 font-poppins-bold text-lg text-gray-900">
            Choose a professional
          </Text>
        </View>

        {/* Loading Indicator */}
        {isLoading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator color="#F0B100" size="small" />
            <Text className="mt-2 font-poppins text-xs text-gray-400">
              Loading professionals...
            </Text>
          </View>
        ) : (
          /* Professionals 2-Column Grid */
          <View className="flex-row flex-wrap justify-between gap-y-4 px-6 pt-2">
            {barbersList.map((pro) => {
              const isSelected = selectedId === pro.id;
              return (
                <Pressable
                  className={`w-[48%] rounded-2xl border bg-white p-2.5 ${
                    isSelected
                      ? "border-2 border-[#FE9A00] shadow-xs"
                      : "border-gray-100"
                  }`}
                  key={pro.id}
                  onPress={() => handleSelectProfessional(pro)}
                >
                  {pro.isAnyone ? (
                    <View className="h-32 w-full items-center justify-center rounded-xl bg-gray-50/50">
                      <StyledIcons
                        className="text-gray-900"
                        name="person-outline"
                        size={54}
                      />
                    </View>
                  ) : (
                    <View className="h-32 w-full overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        contentFit="cover"
                        source={{ uri: pro.image }}
                        style={{ height: "100%", width: "100%" }}
                      />
                    </View>
                  )}

                  <Text className="mt-2.5 text-center font-poppins-medium text-xs text-gray-900">
                    {pro.name}
                  </Text>

                  <Text
                    className={`mt-1 text-center font-poppins text-[10px] ${
                      pro.isAvailableToday ? "text-[#00B049]" : "text-gray-400"
                    }`}
                  >
                    • {pro.availability}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </Container>
  );
}
