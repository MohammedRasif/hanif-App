import { Container } from "@/components/container";
import React from "react";
import { Text, View } from "react-native";

export default function AdminClientScreen() {
  return (
    <Container className="bg-white" isScrollable={false}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="font-poppins-bold text-2xl text-foreground">
          Admin Clients
        </Text>
        <Text className="mt-2 text-center font-poppins text-default-400 text-sm">
          Client directory and details will appear here.
        </Text>
      </View>
    </Container>
  );
}
