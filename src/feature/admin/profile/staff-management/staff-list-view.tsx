import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import type { StaffMemberItem } from "./types";

interface StaffListViewProps {
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
                {item.avatarUrl ? (
                  <Image
                    className="h-12 w-12 rounded-full bg-gray-200"
                    contentFit="cover"
                    source={{ uri: item.avatarUrl }}
                  />
                ) : (
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <StyledIcons
                      className="text-gray-900"
                      name="person"
                      size={22}
                    />
                  </View>
                )}

                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-0.5">
                    {item.role}
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
