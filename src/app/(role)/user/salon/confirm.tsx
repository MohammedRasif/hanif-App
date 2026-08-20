import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import type { ServiceItem } from "./choose-a-service";

const TIP_OPTIONS = ["None", "20%", "25%", "30%", "Other"];

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    barberName?: string;
    barberImage?: string;
    selectedServices?: string;
    selectedDate?: string;
    selectedTime?: string;
  }>();

  const barberName = params.barberName || "Esther Howard";
  const barberImage =
    params.barberImage ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  const selectedDate = params.selectedDate || "14 July 2026";
  const selectedTime = params.selectedTime || "11.00 am";

  let services: ServiceItem[] = [];
  try {
    if (params.selectedServices) {
      services = JSON.parse(params.selectedServices);
    }
  } catch (e) {
    console.error("Error parsing selectedServices:", e);
  }

  if (services.length === 0) {
    services = [
      {
        id: "1",
        title: "Basic hair cut",
        duration: "1 hr",
        price: "$65",
      },
    ];
  }

  const baseTotal = services.reduce((sum, item) => {
    const p = Number.parseInt(item.price.replace("$", "") || "65");
    return sum + p;
  }, 0);

  const [selectedTipOption, setSelectedTipOption] = useState<string>("None");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Calculate tip
  let tipPercent = 0;
  if (selectedTipOption === "20%") tipPercent = 0.2;
  else if (selectedTipOption === "25%") tipPercent = 0.25;
  else if (selectedTipOption === "30%") tipPercent = 0.3;

  const tipAmount = Math.round(baseTotal * tipPercent);
  const finalSubtotal = baseTotal + tipAmount;

  const handleConfirmAndBook = () => {
    setIsSuccessModalVisible(true);
  };

  const handleBackToHome = () => {
    setIsSuccessModalVisible(false);
    router.replace("/(role)/user" as Href);
  };

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
            Review & confirm
          </Text>
        </View>

        {/* Salon Title */}
        <Text className="mb-4 font-poppins-semibold text-base text-gray-900">
          Glam Beauty Salon
        </Text>

        {/* Booking Card (Image 5) */}
        <View className="rounded-3xl bg-gray-50/80 p-5 border border-gray-100/60 mb-6">
          {/* Top Row: Avatar + Barber Name & Service + Price */}
          <View className="flex-row items-center justify-between pb-4 border-b border-gray-200/50">
            <View className="flex-row items-center gap-3.5 flex-1 pr-2">
              <View className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                <Image
                  contentFit="cover"
                  source={{ uri: barberImage }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>

              <View className="flex-1">
                <Text className="font-poppins-bold text-base text-gray-900">
                  {barberName}
                </Text>
                <Text className="mt-0.5 font-poppins text-xs text-gray-500">
                  {services[0]?.title || "Basic hair cut"}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="font-poppins-bold text-base text-gray-900">
                ${baseTotal}
              </Text>
              <Text className="mt-0.5 font-poppins text-[10px] text-gray-400">
                10:00 - 10:45
              </Text>
            </View>
          </View>

          {/* Bottom Row: Date & Time + Duration */}
          <View className="flex-row items-center justify-between pt-4">
            <Text className="font-poppins text-xs text-gray-600">
              {selectedDate}, {selectedTime}
            </Text>
            <Text className="font-poppins text-xs text-gray-500">
              {services[0]?.duration || "1 hr"}
            </Text>
          </View>
        </View>

        {/* Tip Section (Image 5) */}
        <Text className="mb-3 font-poppins-bold text-base text-gray-900">
          Tip
        </Text>

        <View className="flex-row items-center justify-between mb-6 gap-2">
          {TIP_OPTIONS.map((option) => {
            const isSelected = selectedTipOption === option;
            return (
              <Pressable
                className={`rounded-full px-4 py-2.5 border ${
                  isSelected
                    ? "bg-black border-black"
                    : "bg-gray-50 border-gray-100 active:bg-gray-100"
                }`}
                key={option}
                onPress={() => setSelectedTipOption(option)}
              >
                <Text
                  className={`font-poppins-medium text-xs ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom Sticky Bar: Subtotal & Confirm & Book Button (Image 5) */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-4 shadow-lg">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-poppins-bold text-base text-gray-900">
            Subtotal
          </Text>
          <Text className="font-poppins-bold text-xl text-gray-900">
            ${finalSubtotal}
          </Text>
        </View>

        <Pressable
          className="w-full rounded-2xl bg-[#F0B100] py-4 items-center active:opacity-90"
          onPress={handleConfirmAndBook}
        >
          <Text className="font-poppins-bold text-base text-white">
            Confirm & Book
          </Text>
        </Pressable>
      </View>

      {/* Success Modal / Screen */}
      <Modal
        animationType="fade"
        onRequestClose={handleBackToHome}
        transparent={true}
        visible={isSuccessModalVisible}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="w-full rounded-3xl bg-white p-6 items-center shadow-2xl">
            {/* Success Icon */}
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <StyledIcons
                className="text-[#00B049]"
                name="checkmark-circle"
                size={56}
              />
            </View>

            <Text className="font-poppins-bold text-2xl text-gray-900 text-center">
              Booking Confirmed!
            </Text>

            <Text className="mt-2 text-center font-poppins text-xs text-gray-500 leading-relaxed px-2 mb-6">
              Your appointment with {barberName} has been successfully booked
              for {selectedDate} at {selectedTime}.
            </Text>

            <Pressable
              className="w-full rounded-2xl bg-[#F0B100] py-3.5 items-center active:opacity-90"
              onPress={handleBackToHome}
            >
              <Text className="font-poppins-bold text-base text-white">
                Back to Home
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Container>
  );
}
