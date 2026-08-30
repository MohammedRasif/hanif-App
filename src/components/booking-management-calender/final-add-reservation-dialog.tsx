// final-add-reservation-dialog.tsx - Updated with payment method and better data handling
import { StyledIcons } from "@/lib";
import { Dialog } from "heroui-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  bookingData?: {
    barberName?: string;
    customerName?: string;
    dateTime?: string;
    endTime?: string;
    price?: number | string;
    serviceDuration?: number | string;
    serviceName?: string;
    payment_method?: string;
    appointment_date?: string;
    startTime?: string;
    [key: string]: any;
  };
  isOpen: boolean;
  onBack?: () => void;
  onConfirm?: (data: any) => void;
  onOpenChange: (open: boolean) => void;
  isConfirming?: boolean;
};

export function FinalAddReservationDialog({
  isOpen,
  onOpenChange,
  onBack,
  onConfirm,
  bookingData = {},
  isConfirming = false,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();

  const customerName =
    bookingData.customerName ||
    bookingData.customer?.name ||
    bookingData.fullName ||
    "Customer";

  const serviceText = bookingData.serviceName
    ? `${bookingData.serviceName} • ${bookingData.serviceDuration || "40"} min`
    : "No service selected";

  const timeText = bookingData.appointment_date
    ? `${bookingData.appointment_date} at ${bookingData.startTime || bookingData.dateTime || "09:00"}`
    : bookingData.dateTime
      ? `${bookingData.dateTime} - ${bookingData.endTime || "..."}`
      : "No time selected";

  const barberName = bookingData.barberName || "Not assigned";
  const priceText = bookingData.price ? `$${bookingData.price}` : "$0.00";
  const paymentMethod = bookingData.payment_method || "cash";

  const handleConfirm = () => {
    // Pass all booking data to the confirm handler
    onConfirm?.({
      ...bookingData,
      customerId: bookingData.customerId,
      serviceId: bookingData.serviceId,
      barberId: bookingData.barberId,
      appointment_date: bookingData.appointment_date,
      startTime: bookingData.startTime || bookingData.dateTime,
      payment_method: bookingData.payment_method,
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[92%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-2xl text-gray-900">
              Add new reservation
            </Dialog.Title>
            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => onOpenChange(false)}
            >
              <StyledIcons className="text-gray-600" name="close" size={20} />
            </Pressable>
          </View>

          {/* Stepper Indicator */}
          <View className="mb-6 flex-row items-center gap-2">
            <View className="h-1.5 flex-1 rounded-full bg-[#FF9500]" />
            <View className="h-1.5 flex-1 rounded-full bg-[#FF9500]" />
            <View className="h-1.5 flex-1 rounded-full bg-[#FF9500]" />
          </View>

          <Text className="mb-3 font-semibold text-gray-700 text-sm">
            Step 3 of 3: Confirm & Summary
          </Text>

          {/* Review Summary Card */}
          <ScrollView
            className="mb-4"
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: screenHeight * 0.45 }}
          >
            <View className="rounded-3xl border border-gray-100 bg-[#FAFAFA] p-5">
              {/* Customer Title */}
              <Text className="mb-4 font-bold text-gray-900 text-xl">
                {customerName}
              </Text>

              {/* Row 1: Service */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                <Text className="font-medium text-base text-gray-600">
                  Service
                </Text>
                <Text className="font-semibold text-base text-gray-900">
                  {serviceText}
                </Text>
              </View>

              {/* Row 2: Time */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                <Text className="font-medium text-base text-gray-600">
                  Time
                </Text>
                <Text className="font-semibold text-base text-gray-900">
                  {timeText}
                </Text>
              </View>

              {/* Row 3: Barber */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                <Text className="font-medium text-base text-gray-600">
                  Barber
                </Text>
                <Text className="font-semibold text-base text-gray-900">
                  {barberName}
                </Text>
              </View>

              {/* Row 4: Payment Method */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                <Text className="font-medium text-base text-gray-600">
                  Payment
                </Text>
                <Text className="font-semibold text-base text-gray-900 capitalize">
                  {paymentMethod === "cash" ? "💰 Cash" : "💳 Card"}
                </Text>
              </View>

              {/* Row 5: Price */}
              <View className="flex-row items-center justify-between py-3">
                <Text className="font-medium text-base text-gray-600">
                  Price
                </Text>
                <Text className="font-bold text-base text-gray-900">
                  {priceText}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Pinned Bottom Action Buttons */}
          <View className="flex-row items-center gap-3 pt-3 border-t border-gray-100">
            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
              onPress={onBack}
              disabled={isConfirming}
            >
              <Text className="font-semibold text-base text-gray-700">
                Back
              </Text>
            </Pressable>
            <Pressable
              className={`h-14 flex-1 items-center justify-center rounded-2xl ${
                isConfirming
                  ? "bg-gray-400"
                  : "bg-[#FF9500] active:bg-[#e08300]"
              }`}
              onPress={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="font-bold text-base text-white">
                  Add reservation
                </Text>
              )}
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
