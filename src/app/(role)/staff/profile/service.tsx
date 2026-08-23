import { Container } from "@/components/container";
import { StaffProfileTopHeader } from "@/feature/staff/profile";
import { useGetStaffMeServicesQuery } from "@/Redux/feature/dashboard";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface ServiceItem {
  duration: string;
  id: string;
  name: string;
  price: string;
}

export default function StaffServiceScreen() {
  const {
    data: servicesResponse,
    isLoading,
    isError,
  } = useGetStaffMeServicesQuery();

  const servicesData = Array.isArray(servicesResponse?.data)
    ? servicesResponse.data
    : [];

  const formattedServices: ServiceItem[] = servicesData.map((item) => ({
    id: String(item.id),
    name: item.name,
    duration: `${item.duration_minutes} min`,
    price:
      typeof item.price === "number" || !String(item.price).startsWith("$")
        ? `$${item.price}`
        : String(item.price),
  }));

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Reusable Header */}
      <StaffProfileTopHeader title="Service" />

      {isLoading ? (
        <View className="py-16 items-center justify-center">
          <ActivityIndicator color="#F0B100" size="small" />
          <Text className="mt-2 font-poppins text-xs text-gray-400">
            Loading services...
          </Text>
        </View>
      ) : isError ? (
        <View className="py-16 items-center justify-center px-6">
          <Text className="font-poppins-medium text-red-500 text-sm text-center">
            Failed to load offered services.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 32,
          }}
          data={formattedServices}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Text className="font-poppins text-gray-400 text-sm">
                No data here
              </Text>
            </View>
          }
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
      )}
    </Container>
  );
}
