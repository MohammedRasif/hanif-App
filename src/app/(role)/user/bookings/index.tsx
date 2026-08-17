import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { AppointmentCard, type Appointment } from "@/feature/user";

const MOCK_UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    shopName: "Barbers Bay",
    location: "Los Angeles, CA",
    avatarUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80",
    service: "Haircut",
    barberName: "jhon",
    date: {
      month: "July",
      day: "14",
      time: "11:00 AM",
    },
  },
  {
    id: "2",
    shopName: "Barbers Bay",
    location: "Los Angeles, CA",
    avatarUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80",
    service: "Haircut",
    barberName: "jhon",
    date: {
      month: "July",
      day: "14",
      time: "11:00 AM",
    },
    status: "Confirmed",
  },
];

const MOCK_FINESSED_APPOINTMENTS: Appointment[] = [
  {
    id: "3",
    shopName: "Barbers Bay",
    location: "Los Angeles, CA",
    avatarUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80",
    service: "Haircut",
    barberName: "jhon",
    date: {
      month: "July",
      day: "14",
      time: "11:00 AM",
    },
    status: "Completed",
  },
  {
    id: "4",
    shopName: "Barbers Bay",
    location: "Los Angeles, CA",
    avatarUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80",
    service: "Haircut",
    barberName: "jhon",
    date: {
      month: "July",
      day: "14",
      time: "11:00 AM",
    },
    status: "Cancelled",
  },
];

type BookingTab = "upcoming" | "finessed";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const router = useRouter();

  const currentAppointments =
    activeTab === "upcoming"
      ? MOCK_UPCOMING_APPOINTMENTS
      : MOCK_FINESSED_APPOINTMENTS;

  const handleBookAgain = (_appointment: Appointment) => {
    // Navigate or trigger booking flow
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
        {currentAppointments.length > 0 ? (
          <View>
            {currentAppointments.map((appointment) => (
              <AppointmentCard
                appointment={appointment}
                key={appointment.id}
                onBookAgain={handleBookAgain}
                onPress={(appt: Appointment) =>
                  router.push({
                    pathname: "/(role)/user/bookings/[id]",
                    params: { id: appt.id },
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
