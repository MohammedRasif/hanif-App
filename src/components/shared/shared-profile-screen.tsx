import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Button } from "heroui-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export interface ProfileMenuItem {
  iconName: keyof typeof Ionicons.glyphMap;
  id: string;
  label: string;
  onPress?: () => void;
}

export interface SharedProfileScreenProps {
  avatarUrl?: string;
  coverImageUrl?: string;
  locationTitle?: string;
  menuItems: ProfileMenuItem[];
  onPressLocationDropdown?: () => void;
  onSignOut?: () => void;
  userAvatarUrl?: string;
  userName?: string;
  userSubtitle?: string;
}

export function SharedProfileScreen({
  coverImageUrl = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
  avatarUrl = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300",
  locationTitle = "Jazz barber (Hampdenpark)",
  onPressLocationDropdown,
  userName = "James Carter",
  userSubtitle = "Shop Manager · Carter's BarberPro",
  userAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  menuItems = [],
  onSignOut,
}: SharedProfileScreenProps) {
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
            source={{ uri: coverImageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Overlapping Profile Avatar */}
        <View className="items-center -mt-14 mb-3">
          <Image
            contentFit="cover"
            source={{ uri: avatarUrl }}
            style={{
              borderColor: "#ffffff",
              borderRadius: 50,
              borderWidth: 4,
              height: 100,
              width: 100,
            }}
          />
        </View>

        {/* Location Dropdown Pill */}
        <View className="items-center mb-6">
          <Pressable
            className="flex-row items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-xs active:bg-gray-50"
            onPress={onPressLocationDropdown}
          >
            <Text className="font-poppins-bold text-sm text-gray-900">
              {locationTitle}
            </Text>
            <StyledIcons
              className="text-gray-600"
              name="chevron-down"
              size={16}
            />
          </Pressable>
        </View>

        <View className="px-6">
          {/* User Info Card */}
          <View className="mb-5 flex-row items-center gap-3.5 rounded-3xl bg-[#fbfbfc] border border-gray-100 p-4 shadow-xs">
            <Image
              contentFit="cover"
              source={{ uri: userAvatarUrl }}
              style={{ borderRadius: 24, height: 48, width: 48 }}
            />
            <View className="flex-1">
              <Text className="font-poppins-bold text-base text-gray-900">
                {userName}
              </Text>
              <Text className="mt-0.5 font-poppins text-xs text-gray-500">
                {userSubtitle}
              </Text>
            </View>
          </View>

          {/* Menu Options Group */}
          <View className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
            {menuItems.map((item, index) => {
              const isLast = index === menuItems.length - 1;
              return (
                <Pressable
                  className={`flex-row items-center justify-between p-4 active:bg-gray-50 ${
                    !isLast ? "border-b border-gray-100/70" : ""
                  }`}
                  key={item.id}
                  onPress={item.onPress}
                >
                  <View className="flex-row items-center gap-3.5">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <StyledIcons
                        className="text-gray-700"
                        name={item.iconName}
                        size={18}
                      />
                    </View>
                    <Text className="font-poppins-semibold text-sm leading-5 text-gray-800">
                      {item.label}
                    </Text>
                  </View>
                  <StyledIcons
                    className="text-gray-400"
                    name="chevron-forward"
                    size={16}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Sign Out Button */}
          <Button
            className="h-13 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-[#fdf2f2] active:bg-[#fde8e8]"
            onPress={onSignOut || (() => console.log("Sign Out clicked"))}
            variant="tertiary"
          >
            <StyledIcons
              className="text-red-500"
              name="exit-outline"
              size={18}
            />
            <Text className="font-poppins-semibold text-sm text-red-500">
              Sign Out
            </Text>
          </Button>
        </View>
      </ScrollView>
    </Container>
  );
}

export default SharedProfileScreen;
