import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { Appointment } from "@/lib/calender/types";
import { Image } from "expo-image";
import { Dialog } from "heroui-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type CheckoutPageViewProps = {
  appointment: Appointment | null;
  onBack: () => void;
  onCancelUnpaid?: () => void;
  onCompleteOrder?: () => void;
  onOpenBookAgain?: () => void;
};

export function CheckoutPageView({
  appointment,
  onBack,
  onOpenBookAgain,
  onCancelUnpaid,
  onCompleteOrder,
}: CheckoutPageViewProps) {
  if (!appointment) return null;

  const isPaid =
    appointment.status === "completed" ||
    (appointment as any).paymentStatus === "Paid" ||
    (appointment as any).isPaid === true;

  const customerName = appointment.userName || "Aisha bakr";
  const barberName = appointment.barberName || "Mike Johnson";
  const timeText = appointment.timeDisplay || "12 july, 10:00 am";
  const priceText = (appointment as any).price || "$12.00";
  const durationText =
    (appointment as any).duration || `${appointment.durationMinutes || 40} min`;
  const notesText =
    (appointment as any).notes ||
    "Low fade on sides. No product Low fade on sides. No product.Low fade on sides. No product..";

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* Top Page Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-5 pt-12 pb-4 bg-white">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons className="text-gray-900" name="arrow-back" size={24} />
        </Pressable>
        <Text className="font-bold text-xl text-gray-900">Checkout</Text>
        <View className="w-10" />
      </View>

      {/* Main Page Scrollable Body */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Summary Card */}
        <View className="mb-6 rounded-3xl border border-gray-100/80 bg-[#F9FAFB] p-5 shadow-2xs">
          <View className="mb-5 flex-row items-center gap-3.5">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <StyledIcons className="text-gray-600" name="person" size={24} />
            </View>
            <Text className="font-bold text-2xl text-gray-900">
              {customerName}
            </Text>
          </View>

          <View className="gap-4">
            {/* Row 1: Date & Time + Price */}
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="mb-1 font-medium text-xs text-gray-400">
                  Date & time
                </Text>
                <Text className="font-bold text-base text-gray-900">
                  {timeText}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 font-medium text-xs text-gray-400">
                  Price
                </Text>
                <Text className="font-bold text-base text-gray-900">
                  {priceText}
                </Text>
              </View>
            </View>

            {/* Row 2: Duration + Payment */}
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="mb-1 font-medium text-xs text-gray-400">
                  Duration
                </Text>
                <Text className="font-bold text-base text-gray-900">
                  {durationText}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 font-medium text-xs text-gray-400">
                  Payment
                </Text>
                <Text className="font-bold text-base text-gray-900">
                  {isPaid ? "Paid" : "Unpaid"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Staff Section */}
        <View className="mb-6">
          <Text className="mb-3 font-bold text-lg text-gray-900">Staff</Text>
          <View className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
            <View className="flex-row items-center gap-3.5">
              <Image
                contentFit="cover"
                source={{
                  uri:
                    (appointment as any).barberAvatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                }}
                style={{ width: 46, height: 46, borderRadius: 23 }}
              />
              <View>
                <Text className="font-bold text-base text-gray-900">
                  {barberName}
                </Text>
                <Text className="text-gray-400 text-xs font-medium">
                  Senior Barber
                </Text>
              </View>
            </View>
            <Pressable>
              <Text className="font-semibold text-blue-500 text-sm">
                Change
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Notes Section */}
        <View className="mb-6">
          <Text className="mb-3 font-bold text-lg text-gray-900">Notes</Text>
          <View className="rounded-2xl border border-gray-100/80 bg-[#F9FAFB] p-4.5">
            <Text className="text-gray-600 text-sm leading-relaxed">
              {notesText}
            </Text>
          </View>
        </View>

        {/* Payments Section (Shown ONLY when Paid) */}
        {isPaid && (
          <View className="mb-6">
            <Text className="mb-3 font-bold text-lg text-gray-900">
              Payments
            </Text>
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center gap-3.5">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200/80">
                  <StyledIcons
                    className="text-gray-700"
                    name="options-outline"
                    size={22}
                  />
                </View>
                <View>
                  <Text className="font-bold text-lg text-gray-900">Today</Text>
                  <Text className="text-gray-400 text-xs">6.37 am</Text>
                </View>
              </View>
              <View className="items-end gap-1">
                <View className="rounded-full bg-emerald-100 px-3 py-1">
                  <Text className="font-semibold text-xs text-emerald-600">
                    Paid
                  </Text>
                </View>
                <Text className="font-bold text-lg text-gray-900">$12</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Pinned Bottom Page Action Bar */}
      <View className="border-t border-gray-100 bg-white px-5 pt-3 pb-8">
        {isPaid ? (
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300] shadow-md"
            onPress={onOpenBookAgain}
          >
            <Text className="font-bold text-base text-white">Book again</Text>
          </Pressable>
        ) : (
          <View className="flex-row items-center gap-3">
            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl border border-[#FF3B30] bg-white active:bg-red-50"
              onPress={onCancelUnpaid}
            >
              <Text className="font-semibold text-[#FF3B30] text-base">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl bg-[#00C853] active:bg-[#00b048] shadow-md"
              onPress={onCompleteOrder}
            >
              <Text className="font-bold text-base text-white">
                Complete order
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Container>
  );
}

{
  /* Popup Dialog 1: New Booking Form Dialog (Image 3) */
}
type BookAgainFormModalProps = {
  isOpen: boolean;
  onDone: (data: any) => void;
  onOpenChange: (open: boolean) => void;
};

export function BookAgainFormModal({
  isOpen,
  onOpenChange,
  onDone,
}: BookAgainFormModalProps) {
  const [selectedBarber, setSelectedBarber] = useState("Elena ruiz");
  const [selectedService, setSelectedService] = useState("Skin • 40 min");
  const [dateText, setDateText] = useState("12 july, 10:00 am");
  const [startTime, setStartTime] = useState("10:00 am");
  const [endTime, setEndTime] = useState("10:50 am");

  const handleDone = () => {
    onOpenChange(false);
    onDone({
      barber: selectedBarber,
      service: selectedService,
      date: dateText,
      startTime,
      endTime,
      price: "$256",
      customer: "Aisha bakr",
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <Pressable
            className="mb-3 flex-row items-center gap-1.5 self-start py-1"
            onPress={() => onOpenChange(false)}
          >
            <StyledIcons
              className="text-gray-700"
              name="arrow-back"
              size={20}
            />
            <Text className="font-medium text-base text-gray-700">Back</Text>
          </Pressable>

          <Dialog.Title className="mb-1 font-bold text-3xl text-gray-900 tracking-tight">
            New booking
          </Dialog.Title>
          <Text className="mb-6 text-gray-500 text-sm">
            Create an appitment in few quick steps
          </Text>

          <View className="mb-6 gap-4">
            {/* Barber Dropdown */}
            <View>
              <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                Barber
              </Text>
              <View className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4">
                <TextInput
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setSelectedBarber}
                  placeholder="Choose"
                  placeholderTextColor="#9CA3AF"
                  value={selectedBarber}
                />
                <StyledIcons
                  className="text-gray-600"
                  name="chevron-down"
                  size={20}
                />
              </View>
            </View>

            {/* Service Dropdown */}
            <View>
              <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                Service
              </Text>
              <View className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4">
                <TextInput
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setSelectedService}
                  placeholder="Choose"
                  placeholderTextColor="#9CA3AF"
                  value={selectedService}
                />
                <StyledIcons
                  className="text-gray-600"
                  name="chevron-down"
                  size={20}
                />
              </View>
            </View>

            {/* Date Field */}
            <View>
              <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                Date
              </Text>
              <View className="h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                <TextInput
                  className="text-gray-900 text-sm"
                  onChangeText={setDateText}
                  placeholder="12 july, 10:00 am"
                  placeholderTextColor="#9CA3AF"
                  value={dateText}
                />
              </View>
            </View>

            {/* Start time & End time */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                  Start time
                </Text>
                <View className="h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                  <TextInput
                    className="text-gray-900 text-sm"
                    onChangeText={setStartTime}
                    placeholder="10:00 am"
                    placeholderTextColor="#9CA3AF"
                    value={startTime}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                  End time
                </Text>
                <View className="h-13 justify-center rounded-2xl border border-gray-200 bg-white px-4">
                  <TextInput
                    className="text-gray-900 text-sm"
                    onChangeText={setEndTime}
                    placeholder="10:50 am"
                    placeholderTextColor="#9CA3AF"
                    value={endTime}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Done Button */}
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleDone}
          >
            <Text className="font-bold text-base text-white">Done</Text>
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

{
  /* Popup Dialog 2: New Booking Confirmation Overview Dialog (Image 4) */
}
type BookAgainConfirmModalProps = {
  bookingData?: any;
  isOpen: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function BookAgainConfirmModal({
  isOpen,
  onOpenChange,
  onBack,
  onConfirm,
  bookingData = {},
}: BookAgainConfirmModalProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <Pressable
            className="mb-3 flex-row items-center gap-1.5 self-start py-1"
            onPress={onBack}
          >
            <StyledIcons
              className="text-gray-700"
              name="arrow-back"
              size={20}
            />
            <Text className="font-medium text-base text-gray-700">Back</Text>
          </Pressable>

          <Dialog.Title className="mb-1 font-bold text-3xl text-gray-900 tracking-tight">
            New booking
          </Dialog.Title>
          <Text className="mb-6 text-gray-500 text-sm">
            Create an appitment in few quick steps
          </Text>

          {/* Summary Box */}
          <View className="mb-6 rounded-3xl border border-gray-100 bg-[#FAFAFA] p-5 gap-3.5">
            <View className="flex-row items-center justify-between border-b border-gray-200/60 pb-2">
              <Text className="font-medium text-base text-gray-700">
                Customer
              </Text>
              <Text className="font-semibold text-base text-gray-900">
                {bookingData.customer || "Aisha bakr"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between border-b border-gray-200/60 py-2">
              <Text className="font-medium text-base text-gray-700">
                Service
              </Text>
              <Text className="font-semibold text-base text-gray-900">
                {bookingData.service || "Skin • 40 min"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between border-b border-gray-200/60 py-2">
              <Text className="font-medium text-base text-gray-700">
                Barber
              </Text>
              <Text className="font-semibold text-base text-gray-900">
                {bookingData.barber || "Elena ruiz"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between pt-1">
              <Text className="font-medium text-base text-gray-700">Price</Text>
              <Text className="font-bold text-base text-gray-900">
                {bookingData.price || "$256"}
              </Text>
            </View>
          </View>

          {/* Confirm booking Button */}
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={onConfirm}
          >
            <Text className="font-bold text-base text-white">
              Confirm booking
            </Text>
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

// Alias export for backwards compatibility
export const BookingDetailModal = CheckoutPageView;
