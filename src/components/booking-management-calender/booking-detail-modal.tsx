import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { Appointment } from "@/lib/calender/types";
import type { BookingDetailsData } from "@/Redux/feature/bookingCalendarApi";
import { Image } from "expo-image";
import { Dialog } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  appointmentDurationMinutes,
  formatClockLabel,
  formatDurationLabel,
  formatMoney,
  formatShortDate,
} from "./checkout-utils";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

type CheckoutPageViewProps = {
  /** Grid card that opened the page — used for instant labels while loading. */
  appointment?: Appointment | null;
  booking?: BookingDetailsData | null;
  isError?: boolean;
  isLoading?: boolean;
  isMutating?: boolean;
  onBack: () => void;
  onCancelBooking?: () => void;
  onCompleteOrder?: () => void;
  onEdit?: () => void;
  onOpenBookAgain?: () => void;
  onRetry?: () => void;
};

export function CheckoutPageView({
  appointment,
  booking,
  isError = false,
  isLoading = false,
  isMutating = false,
  onBack,
  onCancelBooking,
  onCompleteOrder,
  onEdit,
  onOpenBookAgain,
  onRetry,
}: CheckoutPageViewProps) {
  const appointments = booking?.appointments_details ?? [];
  const firstAppointment = appointments[0];

  const paymentStatus = (booking?.payment_status ?? "").toLowerCase();
  const bookingStatus = (booking?.status ?? "").toLowerCase();
  const isPaid = paymentStatus === "paid";
  const isCompleted = bookingStatus === "completed";
  const isCancelled = bookingStatus === "cancelled";
  const isEditable = !!booking && !isCompleted && !isCancelled;

  const customerName =
    booking?.customer?.name || appointment?.userName || "Customer";

  const timeText = firstAppointment
    ? [
        formatShortDate(firstAppointment.appointment_date),
        formatClockLabel(firstAppointment.start_time),
      ]
        .filter(Boolean)
        .join(", ")
    : appointment?.timeDisplay || "—";

  const priceText = booking
    ? formatMoney(booking.total_amount)
    : appointment?.price || "—";

  // Every service row across every appointment, flattened for the bottom list
  const serviceRows = useMemo(
    () =>
      appointments.flatMap((item) =>
        item.services.map((service) => ({
          ...service,
          appointmentDate: item.appointment_date,
        })),
      ),
    [appointments],
  );

  const totalMinutes = serviceRows.reduce(
    (sum, service) => sum + (appointmentDurationMinutes(service) ?? 0),
    0,
  );
  const durationText =
    formatDurationLabel(totalMinutes) ||
    formatDurationLabel(appointment?.durationMinutes) ||
    "—";

  const barber = booking?.barber ?? firstAppointment?.barber ?? null;
  const barberName = barber?.name || appointment?.barberName || "Unassigned";
  const barberRole =
    booking?.barber?.specialty || booking?.barber?.role || "Barber";
  const barberAvatar =
    barber?.image || appointment?.barberAvatar || DEFAULT_AVATAR;

  const paymentInfo = booking?.payment_info;
  const discountAmount = booking?.discount_amount;

  if (isError && !booking) {
    return (
      <Container className="flex-1 bg-white" isScrollable={false}>
        <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 pt-12 pb-4">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={onBack}
          >
            <StyledIcons
              className="text-gray-900"
              name="arrow-back"
              size={24}
            />
          </Pressable>
          <Text className="font-bold text-gray-900 text-xl">Booking</Text>
          <View className="w-10" />
        </View>
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center font-semibold text-gray-900 text-sm">
            Couldn&apos;t load this booking
          </Text>
          <Pressable
            className="rounded-full bg-black px-5 py-2.5 active:opacity-80"
            onPress={onRetry}
          >
            <Text className="font-semibold text-white text-xs">Try again</Text>
          </Pressable>
        </View>
      </Container>
    );
  }

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* Top Page Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 pt-12 pb-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons className="text-gray-900" name="arrow-back" size={24} />
        </Pressable>
        <Text className="font-bold text-gray-900 text-xl">
          {booking?.booking_code || "Booking"}
        </Text>
        {isEditable ? (
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={onEdit}
          >
            <StyledIcons
              className="text-gray-900"
              name="create-outline"
              size={22}
            />
          </Pressable>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {isLoading && !booking ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#111827" size="large" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Summary Card */}
          <View className="mb-6 rounded-3xl border border-gray-100/80 bg-main-bg-overlay p-5 shadow-2xs">
            <View className="mb-5 flex-row items-center gap-3.5">
              {booking?.customer?.image ? (
                <Image
                  contentFit="cover"
                  source={{ uri: booking.customer.image }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <StyledIcons
                    className="text-gray-600"
                    name="person"
                    size={24}
                  />
                </View>
              )}
              <View className="flex-1">
                <Text
                  className="font-bold text-2xl text-gray-900"
                  numberOfLines={1}
                >
                  {customerName}
                </Text>
                {!!bookingStatus && (
                  <Text className="mt-0.5 text-gray-400 text-xs capitalize">
                    {bookingStatus.replace(/_/g, " ")}
                  </Text>
                )}
              </View>
            </View>

            <View className="gap-4">
              {/* Row 1: Date & Time + Price */}
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="mb-1 font-medium text-gray-400 text-xs">
                    Date & time
                  </Text>
                  <Text className="font-bold text-base text-gray-900">
                    {timeText}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="mb-1 font-medium text-gray-400 text-xs">
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
                  <Text className="mb-1 font-medium text-gray-400 text-xs">
                    Duration
                  </Text>
                  <Text className="font-bold text-base text-gray-900">
                    {durationText}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="mb-1 font-medium text-gray-400 text-xs">
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
            <Text className="mb-3 font-bold text-gray-900 text-lg">Staff</Text>
            <View className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
              <View className="flex-row items-center gap-3.5">
                <Image
                  contentFit="cover"
                  source={{ uri: barberAvatar }}
                  style={{ width: 46, height: 46, borderRadius: 23 }}
                />
                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {barberName}
                  </Text>
                  <Text className="font-medium text-gray-400 text-xs">
                    {barberRole}
                  </Text>
                </View>
              </View>
              {isEditable && (
                <Pressable onPress={onEdit}>
                  <Text className="font-semibold text-blue-500 text-sm">
                    Change
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Payments Section (only once a payment exists) */}
          {!!paymentInfo?.payment_status && (
            <View className="mb-6">
              <Text className="mb-3 font-bold text-gray-900 text-lg">
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
                    <Text className="font-bold text-gray-900 text-lg capitalize">
                      {paymentInfo.payment_method || "Payment"}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {paymentInfo.payment_created_at
                        ? new Date(
                            paymentInfo.payment_created_at,
                          ).toLocaleString()
                        : "—"}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <View
                    className={`rounded-full px-3 py-1 ${
                      isPaid ? "bg-emerald-100" : "bg-amber-100"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-xs capitalize ${
                        isPaid ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {paymentInfo.payment_status}
                    </Text>
                  </View>
                  <Text className="font-bold text-gray-900 text-lg">
                    {formatMoney(paymentInfo.amount)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Services Section — pinned to the very bottom of the details page */}
          {serviceRows.length > 0 && (
            <View className="mb-2">
              <Text className="mb-3 font-bold text-gray-900 text-lg">
                Services
              </Text>
              {serviceRows.map((service) => (
                <View
                  className="mb-2.5 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-xs"
                  key={String(service.id)}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className="font-semibold text-base text-gray-900"
                      numberOfLines={1}
                    >
                      {service.service_name}
                    </Text>
                    <Text className="mt-0.5 text-gray-400 text-xs">
                      {formatClockLabel(service.start_time)} –{" "}
                      {formatClockLabel(service.end_time)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-base text-gray-900">
                      {formatMoney(service.price)}
                    </Text>
                    <Text className="mt-0.5 text-gray-400 text-xs">
                      {formatDurationLabel(appointmentDurationMinutes(service))}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Totals */}
              <View className="mt-2 gap-2 rounded-2xl border border-gray-100/80 bg-main-bg-overlay p-4">
                {!!discountAmount && Number(discountAmount) > 0 && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-sm">Discount</Text>
                    <Text className="font-semibold text-gray-900 text-sm">
                      -{formatMoney(discountAmount)}
                    </Text>
                  </View>
                )}
                {!!booking?.tip_amount && Number(booking.tip_amount) > 0 && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-sm">Tip</Text>
                    <Text className="font-semibold text-gray-900 text-sm">
                      {formatMoney(booking.tip_amount)}
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-base text-gray-900">
                    Total
                  </Text>
                  <Text className="font-bold text-gray-900 text-lg">
                    {formatMoney(booking?.total_amount)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Pinned Bottom Page Action Bar */}
      <View className="border-t border-gray-100 bg-white px-5 pt-3 pb-8">
        {isCancelled ? (
          <View className="h-14 w-full items-center justify-center rounded-2xl bg-gray-100">
            <Text className="font-semibold text-base text-gray-500">
              Booking cancelled
            </Text>
          </View>
        ) : isCompleted ? (
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] shadow-md active:bg-[#e08300]"
            onPress={onOpenBookAgain}
          >
            <Text className="font-bold text-base text-white">Book again</Text>
          </Pressable>
        ) : (
          <View className="flex-row items-center gap-3">
            <Pressable
              className={`h-14 flex-1 items-center justify-center rounded-2xl border border-[#FF3B30] bg-white active:bg-red-50 ${
                isMutating ? "opacity-60" : ""
              }`}
              disabled={isMutating}
              onPress={onCancelBooking}
            >
              <Text className="font-semibold text-[#FF3B30] text-base">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              className={`h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#00C853] shadow-md active:bg-[#00b048] ${
                isMutating ? "opacity-60" : ""
              }`}
              disabled={isMutating}
              onPress={onCompleteOrder}
            >
              {isMutating && <ActivityIndicator color="#FFFFFF" size="small" />}
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
