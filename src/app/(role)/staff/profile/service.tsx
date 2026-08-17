import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import React from "react";
import { FlatList, Text, View } from "react-native";

interface ServiceItem {
  duration: string;
  id: string;
  name: string;
  price: string;
}

const MOCK_SERVICES: ServiceItem[] = [
  { id: "1", name: "Face wash", duration: "30 min", price: "$51" },
  { id: "2", name: "Face wash", duration: "30 min", price: "$51" },
  { id: "3", name: "Face wash", duration: "30 min", price: "$51" },
];

export default function StaffServiceScreen() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Service" />

      {/* Service List */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 32,
        }}
        data={MOCK_SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3.5 flex-row items-center justify-between rounded-2xl bg-gray-50/80 p-4">
            <View>
              <Text className="font-poppins-semibold text-base text-gray-900">
                {item.name}
              </Text>
              <Text className="mt-1 font-poppins text-xs text-gray-400">
                {item.duration}
              </Text>
            </View>

            <Text className="font-poppins-semibold text-base text-gray-900">
              {item.price}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
