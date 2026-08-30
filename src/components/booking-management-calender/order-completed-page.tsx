import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { BookingDetailsData } from "@/Redux/feature/bookingCalendarApi";
import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  formatClockLabel,
  formatMoney,
  formatShortDate,
} from "./checkout-utils";

type OrderCompletedPageProps = {
  booking?: BookingDetailsData | null;
  onDone: () => void;
};

/** Shown right after an order is marked completed. */
export function OrderCompletedPage({
  booking,
  onDone,
}: OrderCompletedPageProps) {
  const firstAppointment = booking?.appointments_details?.[0];

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#00C853]">
            <StyledIcons className="text-white" name="checkmark" size={36} />
          </View>
        </View>

        <Text className="mb-2 text-center font-bold text-3xl text-gray-900 tracking-tight">
          Order completed
        </Text>
        <Text className="mb-8 text-center text-gray-500 text-sm leading-relaxed">
          {booking?.customer?.name
            ? `${booking.customer.name}'s appointment has been marked as completed.`
            : "The appointment has been marked as completed."}
        </Text>

        {!!booking && (
          <View className="w-full gap-3 rounded-3xl border border-gray-100/80 bg-main-bg-overlay p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">Booking</Text>
              <Text className="font-semibold text-gray-900 text-sm">
                {booking.booking_code}
              </Text>
            </View>

            {!!firstAppointment && (
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 text-sm">Date & time</Text>
                <Text className="font-semibold text-gray-900 text-sm">
                  {[
                    formatShortDate(firstAppointment.appointment_date),
                    formatClockLabel(firstAppointment.start_time),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            )}

            {!!booking.barber?.name && (
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 text-sm">Staff</Text>
                <Text className="font-semibold text-gray-900 text-sm">
                  {booking.barber.name}
                </Text>
              </View>
            )}

            <View className="mt-1 flex-row items-center justify-between border-t border-gray-200/60 pt-3">
              <Text className="font-semibold text-base text-gray-900">
                Total paid
              </Text>
              <Text className="font-bold text-gray-900 text-lg">
                {formatMoney(booking.total_amount)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="px-5 pt-3 pb-8">
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] shadow-md active:bg-[#e08300]"
          onPress={onDone}
        >
          <Text className="font-bold text-base text-white">Done</Text>
        </Pressable>
      </View>
    </Container>
  );
}

export default OrderCompletedPage;
