import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { StaffMemberItem } from "./types";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

function formatImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return DEFAULT_PROFILE_IMAGE;
  }
  const cleanUrl = url.trim();
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("file://") ||
    cleanUrl.startsWith("content://")
  ) {
    return cleanUrl;
  }
  const apiHost = (
    process.env.EXPO_PUBLIC_API_URL || "http://10.10.29.119:8200/api"
  ).replace(/\/api\/?$/, "");
  return `${apiHost.replace(/\/$/, "")}/${cleanUrl.replace(/^\//, "")}`;
}

interface StaffListViewProps {
  isLoading?: boolean;
  onAddNewStaff: () => void;
  onBack: () => void;
  onSelectStaff: (staff: StaffMemberItem) => void;
  staffList: StaffMemberItem[];
}

export function StaffListView({
  staffList,
  onBack,
  onSelectStaff,
  onAddNewStaff,
  isLoading = false,
}: StaffListViewProps) {
  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Staff members
        </Text>

        <View className="w-10" />
      </View>

      {/* Main List */}
      <View className="flex-1 px-6 pt-2">
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#000" size="large" />
            <Text className="font-medium text-sm text-gray-500 mt-3">
              Loading staff members...
            </Text>
          </View>
        ) : staffList.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <StyledIcons
              className="text-gray-300 mb-2"
              name="people-outline"
              size={40}
            />
            <Text className="font-bold text-base text-gray-800">
              No staff members found
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Tap + to invite a new staff member.
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={staffList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3.5 flex-row items-center justify-between rounded-3xl bg-[#F8F9FA] p-4 active:bg-gray-100"
                onPress={() => onSelectStaff(item)}
              >
                <View className="flex-row items-center gap-3.5">
                  <Image
                    className="h-12 w-12 rounded-full bg-gray-200"
                    contentFit="cover"
                    source={{ uri: formatImageUrl(item.avatarUrl) }}
                  />

                  <View>
                    <Text className="font-bold text-base text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="font-medium text-xs text-gray-400 mt-0.5">
                      {item.position || item.role}
                    </Text>
                  </View>
                </View>

                <StyledIcons
                  className="text-gray-900"
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 z-20"
        onPress={onAddNewStaff}
      >
        <StyledIcons className="text-white" name="add" size={28} />
      </Pressable>
    </View>
  );
}
