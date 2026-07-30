import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ServiceItem {
  description: string;
  duration: string;
  id: string;
  price: string;
  title: string;
}

const SERVICES: ServiceItem[] = [
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "1",
    price: "$65",
    title: "Haircut & Style",
  },
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "2",
    price: "$65",
    title: "Haircut & Style",
  },
  {
    description: "Professional cut with styling",
    duration: "45 min",
    id: "3",
    price: "$65",
    title: "Haircut & Style",
  },
];

export default function ChooseAService() {
  const router = useRouter();

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-6 pb-10">
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

        {/* Selected Professional Summary Row */}
        <View className="mb-8 flex-row items-center gap-4">
          <View className="items-center">
            <View className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
              <Image
                contentFit="cover"
                source={{
                  uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                }}
                style={{ height: "100%", width: "100%" }}
              />
            </View>
            {/* Rating Badge Overlay */}
            <View className="-mt-3 flex-row items-center gap-0.5 rounded-full border border-gray-100 bg-white px-2 py-0.5 shadow-xs">
              <Text className="font-poppins-medium text-[10px] text-gray-700">
                4.5
              </Text>
              <StyledIcons className="text-[#F0B100]" name="star" size={10} />
              <Text className="font-poppins text-[10px] text-gray-400">
                (20)
              </Text>
            </View>
            <Text className="mt-1 font-poppins text-[11px] text-gray-400">
              Leslie
            </Text>
          </View>

          <View className="-mt-3">
            <Text className="font-poppins-medium text-lg text-gray-900">
              Esther Howard
            </Text>
            <Text className="mt-0.5 font-poppins text-xs text-[#00B049]">
              • Available today
            </Text>
          </View>
        </View>

        {/* Services List */}
        <Text className="mb-3.5 font-poppins-bold text-base text-gray-900">
          Services
        </Text>

        <View className="gap-3.5">
          {SERVICES.map((service) => (
            <Pressable
              className="flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4 border border-gray-100/50 active:bg-gray-100"
              key={service.id}
              onPress={() =>
                router.push("/(role)/user/salon/choose-a-proffetinal" as any)
              }
            >
              <View>
                <Text className="font-poppins-semibold text-sm text-gray-900">
                  {service.title}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs text-gray-400">
                  {service.description}
                </Text>
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
      </View>
    </Container>
  );
}
