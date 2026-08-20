import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  {
    description: "Intensive hair repair treatment",
    duration: "30 min",
    id: "s6",
    price: "$40",
    title: "Deep Conditioning",
  },
  {
    description: "Smooth, voluminous finish",
    duration: "60 min",
    id: "s7",
    price: "$50",
    title: "Blowout",
  },
  {
    description: "Elegant updo for special events",
    duration: "45 min",
    id: "s8",
    price: "$80",
    title: "Updo Styling",
  },
];

export default function ChooseAServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    barberId?: string;
    barberName?: string;
    barberImage?: string;
    availability?: string;
  }>();

  const barberName = params.barberName || "Esther Howard";
  const barberImage =
    params.barberImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  const availability = params.availability || "Available today";

  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSelectService = (service: ServiceItem) => {
    // Add service if not already selected
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleChooseTime = () => {
    if (selectedServices.length === 0) return;
    router.push({
      pathname: "/(role)/user/salon/choose-time",
      params: {
        barberId: params.barberId || "2",
        barberName,
        barberImage,
        selectedServices: JSON.stringify(selectedServices),
      },
    } as Href);
  };

  const isStateB = selectedServices.length > 0;

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-6 pb-28">
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

        {!isStateB ? (
          /* STATE A: Initial Selection View (Image 1) */
          <>
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
                    4.5
                  </Text>
                  <StyledIcons
                    className="text-[#F0B100]"
                    name="star"
                    size={10}
                  />
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
            <View className="gap-3.5">
              {ALL_SERVICES.slice(0, 3).map((service) => (
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
          </>
        ) : (
          /* STATE B: Selected Services List View (Image 2) */
          <>
            <View className="gap-3.5 mb-6">
              {selectedServices.map((service) => (
                <View
                  className="relative flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4 border border-gray-100/50"
                  key={service.id}
                >
                  <View className="flex-1 pr-4">
                    <Text className="font-poppins-semibold text-base text-gray-900">
                      {service.title}
                    </Text>
                    <Text className="mt-1 font-poppins text-xs text-gray-400">
                      {service.duration}
                    </Text>
                  </View>

                  <Text className="font-poppins-bold text-base text-gray-900 mr-2">
                    {service.price}
                  </Text>

                  {/* Cancel (x) Icon Button */}
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full bg-orange-100/70 active:bg-orange-200"
                    onPress={() => handleRemoveService(service.id)}
                  >
                    <StyledIcons
                      className="text-[#E07A00]"
                      name="close"
                      size={14}
                    />
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Add another service Button */}
            <Pressable
              className="mb-8 flex-row items-center justify-center gap-2 self-start rounded-2xl border border-gray-300 px-5 py-3 active:bg-gray-50"
              onPress={() => setIsAddModalOpen(true)}
            >
              <StyledIcons className="text-gray-800" name="add" size={18} />
              <Text className="font-poppins-semibold text-sm text-gray-900">
                Add another service
              </Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Bottom Sticky Action Bar for State B */}
      {isStateB ? (
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-4 flex-row items-center justify-between shadow-lg">
          <View>
            <Text className="font-poppins text-xs text-gray-400">Total</Text>
            <Text className="font-poppins-bold text-xl text-gray-900">
              $
              {selectedServices.reduce(
                (sum, item) =>
                  sum + Number.parseInt(item.price.replace("$", "") || "0"),
                0,
              )}
            </Text>
          </View>

          <Pressable
            className="rounded-2xl bg-[#FE9A00] px-8 py-3.5 active:opacity-90"
            onPress={handleChooseTime}
          >
            <Text className="font-poppins-semibold text-sm text-white">
              Choose time
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* Bottom Sheet Modal for Adding Additional Service (Image 3) */}
      <Modal
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
        transparent={true}
        visible={isAddModalOpen}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsAddModalOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[60%] w-full rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-2xl"
          >
            {/* Modal Header Handle */}
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-gray-200" />
            </View>

            <Text className="mb-4 font-poppins-bold text-lg text-gray-900">
              Select Service to Add
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-3.5 pb-6">
                {ALL_SERVICES.map((service) => {
                  const isAdded = selectedServices.some(
                    (s) => s.id === service.id,
                  );
                  return (
                    <Pressable
                      className={`flex-row items-center justify-between rounded-2xl p-4 border ${
                        isAdded
                          ? "bg-gray-100 border-gray-200 opacity-60"
                          : "bg-gray-50/80 border-gray-100/50 active:bg-gray-100"
                      }`}
                      disabled={isAdded}
                      key={service.id}
                      onPress={() => {
                        handleSelectService(service);
                        setIsAddModalOpen(false);
                      }}
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
                  );
                })}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
}
