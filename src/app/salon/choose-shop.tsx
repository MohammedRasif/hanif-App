import { Stack, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StyledIcons } from "@/lib";

import { Container } from "@/components/container";

export default function ChooseShopScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("Glam Haven");

  const shops = [
    { name: "Glam Haven", address: "123 Beauty St, Downtown" },
    { name: "Luxury Cuts", address: "456 Fashion Ave, Uptown" },
    { name: "Style Studio", address: "789 Main St, City Center" },
  ];

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={() => router.back()}>
              <StyledIcons
                className="text-foreground"
                name="arrow-back"
                size={24}
              />
            </Pressable>
            <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
              Choose shop
            </Text>
            <View className="w-6" />
          </View>

          {/* Shop items list */}
          <View className="gap-3.5">
            {shops.map((shop) => (
              <Pressable
                className={`flex-row items-center gap-4 rounded-2xl border-2 p-4 ${
                  selected === shop.name
                    ? "border-[#F0B100] bg-[#FFF9E6]/30"
                    : "border-default-100 bg-[#F8F9FA]"
                }`}
                key={shop.name}
                onPress={() => setSelected(shop.name)}
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-default-200">
                  <StyledIcons
                    className="text-default-500"
                    name="business"
                    size={20}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">
                    {shop.name}
                  </Text>
                  <Text className="mt-1 text-default-400 text-xs">
                    {shop.address}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={() => router.push("/salon/confirm")}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Select Shop
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
