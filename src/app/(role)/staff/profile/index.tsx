import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { Button } from "heroui-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function StaffProfileScreen() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View className="pt-12 pb-6">
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            Profile
          </Text>
          <Text className="mt-1 text-gray-400 text-sm">
            Manage your barber schedule and personal account
          </Text>
        </View>

        {/* Barber Profile Card */}
        <View className="mb-6 items-center rounded-3xl border border-gray-100 bg-gray-50/70 p-6 shadow-xs">
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <Text className="mt-3 font-bold text-xl text-gray-900">Maïa</Text>
          <Text className="mt-0.5 font-medium text-gray-400 text-sm">
            Master Barber & Stylist
          </Text>

          {/* Rating & Location Tag */}
          <View className="mt-3 flex-row items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-200/60">
            <StyledIcons className="text-amber-500" name="star" size={16} />
            <Text className="font-semibold text-amber-800 text-xs">
              4.9 (128 reviews)
            </Text>
          </View>
        </View>

        {/* Schedule & Working Hours Card */}
        <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
          <Text className="mb-3 font-bold text-base text-gray-900">
            Working Schedule
          </Text>
          <View className="gap-2.5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
              <Text className="text-gray-500 text-sm">Monday - Friday</Text>
              <Text className="font-semibold text-gray-900 text-sm">
                09:00 AM - 07:00 PM
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
              <Text className="text-gray-500 text-sm">Saturday</Text>
              <Text className="font-semibold text-gray-900 text-sm">
                10:00 AM - 05:00 PM
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500 text-sm">Sunday</Text>
              <Text className="font-semibold text-rose-500 text-sm">
                Day Off
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Menu Options */}
        <View className="mb-6 rounded-3xl border border-gray-100 bg-white p-2 shadow-xs">
          <Pressable className="flex-row items-center justify-between rounded-2xl p-3.5 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                <StyledIcons
                  className="text-gray-700"
                  name="calendar-outline"
                  size={18}
                />
              </View>
              <Text className="font-semibold text-gray-900 text-sm">
                Calendar Settings
              </Text>
            </View>
            <StyledIcons
              className="text-gray-400"
              name="chevron-forward"
              size={18}
            />
          </Pressable>

          <Pressable className="flex-row items-center justify-between rounded-2xl p-3.5 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                <StyledIcons
                  className="text-gray-700"
                  name="notifications-outline"
                  size={18}
                />
              </View>
              <Text className="font-semibold text-gray-900 text-sm">
                Notification Preferences
              </Text>
            </View>
            <StyledIcons
              className="text-gray-400"
              name="chevron-forward"
              size={18}
            />
          </Pressable>

          <Pressable className="flex-row items-center justify-between rounded-2xl p-3.5 active:bg-gray-50">
            <View className="flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                <StyledIcons
                  className="text-gray-700"
                  name="lock-closed-outline"
                  size={18}
                />
              </View>
              <Text className="font-semibold text-gray-900 text-sm">
                Security & Password
              </Text>
            </View>
            <StyledIcons
              className="text-gray-400"
              name="chevron-forward"
              size={18}
            />
          </Pressable>
        </View>

        {/* Logout Action */}
        <Button
          className="h-13 w-full rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
          variant="tertiary"
        >
          <Text className="font-semibold text-rose-600 text-sm">Log Out</Text>
        </Button>
      </ScrollView>
    </Container>
  );
}
