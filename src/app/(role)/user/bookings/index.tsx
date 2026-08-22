import { Container } from "@/components/container";
import { AppointmentCard, type Appointment } from "@/feature/user";
import { useGetBookingsQuery } from "@/Redux/feature/shop";
import type { BookingItem } from "@/Redux/feature/shop.types";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80";

type BookingTab = "upcoming" | "finessed";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const router = useRouter();

  const queryType = activeTab === "upcoming" ? "upcoming" : "past";
  const { data: bookingsResponse, isLoading } = useGetBookingsQuery(queryType);

  const bookingsData: BookingItem[] = Array.isArray(bookingsResponse?.data)
    ? bookingsResponse.data
    : [];

  const formattedAppointments: Appointment[] = bookingsData.map((b) => {
    const firstAppointment = b.appointments_details?.[0];
    const shopName = b.shop_details?.name || "Barber Shop";
    const location = b.shop_details?.location || "Location unavailable";
    const serviceName = firstAppointment?.service_name || "Salon Service";
    const barberName = firstAppointment?.barber_name || "Barber";

    let month = "Jul";
    let day = "14";
    let time = "11:00 AM";

    if (firstAppointment?.appointment_date) {
      const d = new Date(firstAppointment.appointment_date);
      if (!Number.isNaN(d.getTime())) {
        month = MONTH_NAMES[d.getMonth()] || "Jul";
        day = String(d.getDate());
      }
    }

    if (firstAppointment?.start_time) {
      const parts = firstAppointment.start_time.split(":");
      if (
        parts.length >= 2 &&
        parts[0] !== undefined &&
        parts[1] !== undefined
      ) {
        let hour = Number.parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        time = `${hour}:${minutes} ${ampm}`;
      }
    }

    return {
      id: String(b.id),
      shopName,
      location,
      avatarUrl: DEFAULT_AVATAR,
      service: serviceName,
      barberName,
      date: {
        month,
        day,
        time,
      },
      status: b.status,
      rawBooking: b,
    };
  });

  const handleBookAgain = (_appointment: Appointment) => {
    router.push("/(role)/user");
  };

  return (
    <Container className="bg-white" isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-5 pt-12 pb-8">
        {/* Page Title */}
        <Text className="mb-6 font-poppins-bold text-2xl text-foreground">
          Your Appointments
        </Text>

        {/* Tab Segment Capsule */}
        <View className="mb-6 flex-row rounded-full bg-[#f1f3f5] p-1.5">
          <Pressable
            className={`flex-1 items-center justify-center rounded-full py-3 ${
              activeTab === "upcoming" ? "bg-black" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              className={`font-poppins-semibold text-base ${
                activeTab === "upcoming" ? "text-white" : "text-slate-600"
              }`}
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 items-center justify-center rounded-full py-3 ${
              activeTab === "finessed" ? "bg-black" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("finessed")}
          >
            <Text
              className={`font-poppins-semibold text-base ${
                activeTab === "finessed" ? "text-white" : "text-slate-600"
              }`}
            >
              Finessed
            </Text>
          </Pressable>
        </View>

        {/* Appointments List */}
        {isLoading ? (
          <View className="items-center justify-center py-16">
            <ActivityIndicator color="#F0B100" size="small" />
            <Text className="mt-2 font-poppins text-xs text-gray-400">
              Loading appointments...
            </Text>
          </View>
        ) : formattedAppointments.length > 0 ? (
          <View>
            {formattedAppointments.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
                key={appointment.id}
                onBookAgain={handleBookAgain}
                onPress={(appt: Appointment) =>
                  router.push({
                    pathname: "/(role)/user/bookings/[id]",
                    params: {
                      id: appt.id,
                      bookingData: appt.rawBooking
                        ? JSON.stringify(appt.rawBooking)
                        : "",
                    },
                  })
                }
                showBookAgain={activeTab === "finessed"}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-16">
            <Text className="font-poppins text-default-400 text-sm">
              No {activeTab} appointments found.
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
}
