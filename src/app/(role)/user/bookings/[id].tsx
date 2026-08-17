import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { id: _id } = useLocalSearchParams<{ id: string }>();

  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleChangeBooking = () => {
    // Navigate to reschedule or change service
    router.push("/(role)/user/salon/choose-a-service");
  };

  return (
    <Container className="bg-white" isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-5 pt-12 pb-8">
        {/* Top Header Bar */}
        <View className="mb-6 flex-row items-center justify-between">
          {/* Back Button */}
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={() => router.back()}
          >
            <StyledIcons color="#000000" name="arrow-back" size={24} />
          </Pressable>

          {/* Centered Date & Time Title */}
          <Text className="font-poppins-bold text-foreground text-lg">
            11 am {" • "} Tue, 14 july
          </Text>

          {/* Right Calendar Icon */}
          <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
            <StyledIcons color="#000000" name="calendar-outline" size={22} />
          </Pressable>
        </View>

        {/* Map & Salon Info Card */}
        <View className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
          {/* Map Preview with Pink Location Pin */}
          <View className="relative h-44 w-full items-center justify-center bg-[#edf2f7]">
            <Image
              contentFit="cover"
              source={{
                uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
              }}
              style={{ width: "100%", height: "100%", opacity: 0.85 }}
            />

            {/* Glowing Pink Map Marker Pin */}
            <View className="absolute items-center justify-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#f43f5e] shadow-lg">
                <StyledIcons color="#ffffff" name="location" size={24} />
              </View>
            </View>
          </View>

          {/* Salon Details Section */}
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-1 pr-3">
              <Text className="font-poppins-bold text-foreground text-xl">
                Glam Beauty Salon
              </Text>
              <Text className="mt-1 font-poppins text-default-400 text-sm leading-5">
                123 Beauty Street, Downtown, City 12345
              </Text>
            </View>

            {/* Direction Button */}
            <Pressable
              className="h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-[#f8f9fa] active:bg-gray-200"
              onPress={() => {
                // Open directions / map
              }}
            >
              <StyledIcons color="#000000" name="navigate-outline" size={22} />
            </Pressable>
          </View>
        </View>

        {/* Invoice / Summary Dashed Box */}
        <View className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#fcfcfd] p-5">
          {/* Row 1: Service Name & Price */}
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-bold text-foreground text-lg">
              Hair Cut & Style
            </Text>
            <Text className="font-poppins-bold text-foreground text-lg">
              $75.00
            </Text>
          </View>

          {/* Row 2: Staff & Date/Time */}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-poppins text-default-400 text-sm">
              With jhon
            </Text>
            <Text className="font-poppins text-default-500 text-sm">
              July 20 2026 {" • "} 11:00 AM
            </Text>
          </View>

          {/* Row 3: Sub Total */}
          <View className="mt-6 flex-row items-center justify-between pt-2">
            <Text className="font-poppins-bold text-base text-foreground">
              Sub Total
            </Text>
            <Text className="font-poppins-bold text-foreground text-lg">
              $85.00
            </Text>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="mt-8 flex-row items-center gap-4">
          {/* Cancel Booking Button */}
          <Pressable
            className="flex-1 items-center justify-center rounded-2xl border border-red-300 bg-white py-3.5 active:bg-red-50"
            onPress={handleCancelBooking}
          >
            <Text className="font-poppins-semibold text-base text-red-500">
              Cancel booking
            </Text>
          </Pressable>

          {/* Change Button */}
          <Pressable
            className="flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-[#fafafa] py-3.5 active:bg-gray-100"
            onPress={handleChangeBooking}
          >
            <Text className="font-poppins-semibold text-base text-slate-700">
              Change
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}
