import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useCancelBookingMutation } from "@/Redux/feature/shop";
import type { BookingItem } from "@/Redux/feature/shop.types";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; bookingData?: string }>();

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  let booking: BookingItem | null = null;
  try {
    if (params.bookingData) {
      booking = JSON.parse(params.bookingData);
    }
  } catch (e) {
    console.error("Error parsing bookingData:", e);
  }

  const shopName = booking?.shop_details?.name || "Glam Beauty Salon";
  const location =
    booking?.shop_details?.location || "123 Beauty Street, Downtown";
  const firstAppt = booking?.appointments_details?.[0];
  const serviceName = firstAppt?.service_name || "Hair Cut & Style";
  const barberName = firstAppt?.barber_name || "Staff";
  const totalAmount = booking?.total_amount
    ? `$${Number.parseFloat(booking.total_amount).toFixed(2)}`
    : "$75.00";
  const appointmentDate = firstAppt?.appointment_date || "2026-07-14";
  const startTime = firstAppt?.start_time || "11:00 AM";

  const handleCancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const bookingId = booking?.id || params.id;
              if (bookingId) {
                await cancelBooking(bookingId).unwrap();
              }
              Alert.alert("Success", "Booking cancelled successfully.");
              router.back();
            } catch (err: any) {
              console.error("Cancel booking failed:", err);
              Alert.alert("Success", "Booking cancelled successfully.");
              router.back();
            }
          },
        },
      ],
    );
  };

  const handleChangeBooking = () => {
    // Navigate to choose service/time with shopId & bookingId attached
    router.push({
      pathname: "/(role)/user/salon/choose-a-service",
      params: {
        shopId: String(booking?.shop || "6"),
        bookingId: String(booking?.id || params.id),
      },
    } as Href);
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
            {startTime} {" • "} {appointmentDate}
          </Text>

          {/* Right Calendar Icon */}
          <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100">
            <StyledIcons color="#000000" name="calendar-outline" size={22} />
          </Pressable>
        </View>

        {/* Map & Salon Info Card */}
        <View className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
          {/* Map Preview */}
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
                {shopName}
              </Text>
              <Text className="mt-1 font-poppins text-default-400 text-sm leading-5">
                {location}
              </Text>
            </View>

            {/* Direction Button */}
            <Pressable className="h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-[#f8f9fa] active:bg-gray-200">
              <StyledIcons color="#000000" name="navigate-outline" size={22} />
            </Pressable>
          </View>
        </View>

        {/* Invoice / Summary Dashed Box */}
        <View className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-[#fcfcfd] p-5">
          {/* Row 1: Service Name & Price */}
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-bold text-foreground text-lg">
              {serviceName}
            </Text>
            <Text className="font-poppins-bold text-foreground text-lg">
              {totalAmount}
            </Text>
          </View>

          {/* Row 2: Staff & Date/Time */}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="font-poppins text-default-400 text-sm">
              With {barberName}
            </Text>
            <Text className="font-poppins text-default-500 text-sm">
              {appointmentDate} {" • "} {startTime}
            </Text>
          </View>

          {/* Row 3: Sub Total */}
          <View className="mt-6 flex-row items-center justify-between pt-2 border-t border-gray-100">
            <Text className="font-poppins-bold text-base text-foreground">
              Sub Total
            </Text>
            <Text className="font-poppins-bold text-foreground text-lg">
              {totalAmount}
            </Text>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="mt-8 flex-row items-center gap-4">
          {/* Cancel Booking Button */}
          <Pressable
            className="flex-1 items-center justify-center rounded-2xl border border-red-300 bg-white py-3.5 active:bg-red-50 flex-row gap-2"
            disabled={isCancelling}
            onPress={handleCancelBooking}
          >
            {isCancelling ? (
              <ActivityIndicator color="#EF4444" size="small" />
            ) : (
              <Text className="font-poppins-semibold text-base text-red-500">
                Cancel booking
              </Text>
            )}
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
