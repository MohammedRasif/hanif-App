import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function StaffProfileScreen() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Cover Banner */}
        <View className="relative w-full h-44 bg-gray-100">
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Overlapping Profile Avatar */}
        <View className="items-center -mt-14 mb-3">
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300",
            }}
            style={{
              borderColor: "#ffffff",
              borderRadius: 50,
              borderWidth: 4,
              height: 100,
              width: 100,
            }}
          />
        </View>

        {/* Barbershop Location Title */}
        <Text className="font-poppins-bold text-[18px] leading-[26px] text-gray-900 text-center px-6 mb-6 tracking-tight">
          Jazz barber (Hampdenpark)
        </Text>

        <View className="px-6">
          {/* Barber Info Card */}
          <View className="mb-5 flex-row items-center gap-3.5 rounded-2xl bg-gray-50/80 p-4">
            <Image
              contentFit="cover"
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
              }}
              style={{ borderRadius: 24, height: 48, width: 48 }}
            />
            <View>
              <Text className="font-poppins-bold text-[16px] text-gray-900">
                James Carter
              </Text>
              <Text className="mt-0.5 font-poppins text-[12px] text-gray-500">
                Barber
              </Text>
            </View>
          </View>

          {/* Menu Options Group */}
          <View className="mb-6 overflow-hidden rounded-3xl border border-gray-100/80 bg-white">
            {/* 1. Service */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/70 p-4 active:bg-gray-50"
              onPress={() => router.push("/(role)/staff/profile/service")}
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <StyledIcons
                    className="text-gray-700"
                    name="cut-outline"
                    size={18}
                  />
                </View>
                <Text className="font-poppins-semibold text-[14px] leading-5 text-gray-800">
                  Service
                </Text>
              </View>
              <StyledIcons
                className="text-gray-400"
                name="chevron-forward"
                size={16}
              />
            </Pressable>

            {/* 2. Working Days & Hours */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/70 p-4 active:bg-gray-50"
              onPress={() => router.push("/(role)/staff/profile/working-hours")}
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <StyledIcons
                    className="text-gray-700"
                    name="calendar-outline"
                    size={18}
                  />
                </View>
                <Text className="font-poppins-semibold text-[14px] leading-5 text-gray-800">
                  Working Days & Hours
                </Text>
              </View>
              <StyledIcons
                className="text-gray-400"
                name="chevron-forward"
                size={16}
              />
            </Pressable>

            {/* 3. Reports */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/70 p-4 active:bg-gray-50"
              onPress={() => router.push("/(role)/staff/profile/reports")}
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <StyledIcons
                    className="text-gray-700"
                    name="bar-chart-outline"
                    size={18}
                  />
                </View>
                <Text className="font-poppins-semibold text-[14px] leading-5 text-gray-800">
                  Reports
                </Text>
              </View>
              <StyledIcons
                className="text-gray-400"
                name="chevron-forward"
                size={16}
              />
            </Pressable>

            {/* 4. Break Schedule */}
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/70 p-4 active:bg-gray-50"
              onPress={() =>
                router.push("/(role)/staff/profile/break-schedule")
              }
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <StyledIcons
                    className="text-gray-700"
                    name="settings-outline"
                    size={18}
                  />
                </View>
                <Text className="font-poppins-semibold text-[14px] leading-5 text-gray-800">
                  Break Schedule
                </Text>
              </View>
              <StyledIcons
                className="text-gray-400"
                name="chevron-forward"
                size={16}
              />
            </Pressable>

            {/* 5. Reviews */}
            <Pressable
              className="flex-row items-center justify-between p-4 active:bg-gray-50"
              onPress={() => router.push("/(role)/staff/profile/reviews")}
            >
              <View className="flex-row items-center gap-3.5">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <StyledIcons
                    className="text-gray-700"
                    name="notifications-outline"
                    size={18}
                  />
                </View>
                <Text className="font-poppins-semibold text-[14px] leading-5 text-gray-800">
                  Reviews
                </Text>
              </View>
              <StyledIcons
                className="text-gray-400"
                name="chevron-forward"
                size={16}
              />
            </Pressable>
          </View>

          {/* Sign Out Button */}
          <Button
            className="h-13 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-red-50/80 active:bg-red-100/80"
            onPress={() => console.log("Sign Out clicked")}
            variant="tertiary"
          >
            <StyledIcons
              className="text-red-500"
              name="exit-outline"
              size={18}
            />
            <Text className="font-poppins-semibold text-[14px] text-red-500">
              Sign Out
            </Text>
          </Button>
        </View>
      </ScrollView>
    </Container>
  );
}
