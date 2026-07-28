import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function BookingsScreen() {
  const [segment, setSegment] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");

  return (
    <Container isScrollable={false}>
      <Stack.Screen options={{ title: "Bookings" }} />
      <View className="flex-1 bg-white px-6 pt-14">
        <Text className="mb-6 font-bold text-3xl text-foreground">
          My Bookings
        </Text>

        {/* Tab segments */}
        <View className="mb-6 flex-row rounded-2xl bg-default-100 p-1.5">
          {(["upcoming", "completed", "cancelled"] as const).map((seg) => (
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl py-3 ${
                segment === seg ? "bg-white shadow-sm" : ""
              }`}
              key={seg}
              onPress={() => setSegment(seg)}
            >
              <Text
                className={`font-semibold text-sm capitalize ${
                  segment === seg
                    ? "font-bold text-primary"
                    : "text-default-500"
                }`}
              >
                {seg}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* List Content Placeholder */}
        <View className="flex-1 items-center justify-center rounded-3xl border border-default-300 border-dashed p-6">
          <Text className="text-center font-medium text-default-400">
            List of {segment} appointments will appear here.
          </Text>
        </View>
      </View>
    </Container>
  );
}
