import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import {
  MOCK_CLIENT_LIST,
  MOCK_GROUPS,
  type ClientGroupItem,
  type ClientItem,
} from "./client-types";

export interface ClientListViewProps {
  clients?: ClientItem[];
  groups?: ClientGroupItem[];
  onPressAdd?: () => void;
  onSelectClient?: (client: ClientItem) => void;
  onSelectGroup?: (group: ClientGroupItem) => void;
  title?: string;
}

export function ClientListView({
  title = "Clint",
  clients = MOCK_CLIENT_LIST,
  groups = MOCK_GROUPS,
  onSelectGroup,
  onSelectClient,
  onPressAdd,
}: ClientListViewProps) {
  const [activeTab, setActiveTab] = useState<"list" | "groups">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  return (
    <View className="flex-1 bg-white">
      {/* Top Title */}
      <View className="px-6 pt-12 pb-3">
        <Text className="font-bold text-2xl text-gray-900 tracking-tight">
          {title}
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6 mb-3">
        <CommonInput
          containerClassName="mb-0"
          onChangeText={setSearchQuery}
          placeholder="Search customer"
          prefix={
            <StyledIcons className="text-gray-400" name="search" size={18} />
          }
          value={searchQuery}
        />
      </View>

      {/* Segmented Tab Switcher (List (211) | groups) */}
      <View className="px-6 mb-3">
        <View className="flex-row rounded-full bg-gray-100/80 p-1.5 gap-2">
          <Pressable
            className={`flex-1 items-center justify-center py-2.5 px-4 rounded-full ${
              activeTab === "list" ? "bg-black shadow-xs" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("list")}
          >
            <Text
              className={`font-semibold text-xs ${
                activeTab === "list" ? "text-white" : "text-gray-600"
              }`}
            >
              List (211)
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 items-center justify-center py-2.5 px-4 rounded-full ${
              activeTab === "groups" ? "bg-black shadow-xs" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("groups")}
          >
            <Text
              className={`font-semibold text-xs ${
                activeTab === "groups" ? "text-white" : "text-gray-600"
              }`}
            >
              groups
            </Text>
          </Pressable>
        </View>
      </View>

      {/* TAB 1: List View */}
      {activeTab === "list" && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          data={filteredClients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center gap-3.5 border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
              onPress={() => onSelectClient?.(item)}
            >
              {/* Avatar Circle */}
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                <StyledIcons
                  className="text-gray-500"
                  name="person"
                  size={20}
                />
              </View>

              {/* Client Info Text */}
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900">
                  {item.name}
                </Text>
                <Text className="mt-0.5 text-gray-400 text-xs font-normal">
                  {item.phone}
                </Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* TAB 2: groups View */}
      {activeTab === "groups" && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
              onPress={() => onSelectGroup?.(item)}
            >
              <View className="flex-row items-center gap-3.5">
                {/* Circle Avatar Icon */}
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                  <StyledIcons
                    className="text-gray-500"
                    name="person"
                    size={20}
                  />
                </View>

                {/* Group Title */}
                <Text className="font-semibold text-sm text-gray-900">
                  {item.title}
                </Text>
              </View>

              {/* Chevron Right Icon */}
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

      {/* Bottom Floating Black Add Button (+) */}
      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95"
        onPress={onPressAdd}
      >
        <StyledIcons className="text-white" name="add" size={24} />
      </Pressable>
    </View>
  );
}
