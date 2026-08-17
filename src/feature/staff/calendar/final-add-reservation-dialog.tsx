import { StyledIcons } from "@/lib";
import { Button, Dialog } from "heroui-native";
import React from "react";
import {
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
    price?: string;
    serviceDuration?: string;
    serviceName?: string;
    [key: string]: any;
  };
  isOpen: boolean;
  onBack?: () => void;
  onConfirm?: (data: any) => void;
  onOpenChange: (open: boolean) => void;
};

export function FinalAddReservationDialog({
  isOpen,
  onOpenChange,
  onBack,
  onConfirm,
  bookingData = {},
}: Props) {
  const { height: screenHeight } = useWindowDimensions();

  const customerName =
    bookingData.customerName ||
    bookingData.customer?.name ||
    bookingData.fullName ||
    "Aisha bakr";

  const serviceText = bookingData.serviceName
    ? `${bookingData.serviceName} • ${bookingData.serviceDuration || "40 min"}`
    : bookingData.service || "Skin • 40 min";

  const barberName =
    bookingData.barberName || bookingData.barber || "Elena ruiz";

  const priceText = bookingData.price || "$256";

  const dialogHeight = Math.max(screenHeight * 0.8, 540);

  const handleConfirm = () => {
    onConfirm?.(bookingData);
    onOpenChange(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className="h-full w-full max-w-md flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-2xl"
          style={{ height: dialogHeight }}
        >
          {/* Top Back Navigation & Title */}
          <View className="flex-1">
            <Pressable
              className="mb-2 flex-row items-center gap-1.5 self-start py-1"
              onPress={onBack || (() => onOpenChange(false))}
            >
              <StyledIcons
                className="text-gray-700"
                name="arrow-back"
                size={20}
              />
              <Text className="font-medium text-base text-gray-700">Back</Text>
            </Pressable>

            {/* Dialog Heading */}
            <Text className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
              New booking
            </Text>
            <Text className="mb-6 text-gray-500 text-sm">
              Create an appitment in few quick steps
            </Text>

            {/* Summary Information Card */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="rounded-3xl border border-gray-100 bg-gray-50/70 p-4">
                {/* Row 1: Customer */}
                <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                  <Text className="font-medium text-base text-gray-600">
                    Customer
                  </Text>
                  <Text className="font-semibold text-base text-gray-900">
                    {customerName}
                  </Text>
                </View>

                {/* Row 2: Service */}
                <View className="flex-row items-center justify-between py-3 border-b border-gray-200/60">
                  <Text className="font-medium text-base text-gray-600">
                    Service
                  </Text>
                  <Text className="font-semibold text-base text-gray-900">
                    {serviceText}
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

                {/* Row 4: Price */}
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
          </View>

          {/* Pinned Bottom Action Button */}
          <View className="pt-3 border-t border-gray-100">
            <Button
              className="h-14 w-full rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleConfirm}
            >
              <Text className="font-bold text-base text-white">
                Confirm booking
              </Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
