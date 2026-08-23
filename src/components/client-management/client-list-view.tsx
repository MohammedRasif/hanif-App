import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useGetClientsQuery } from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { ClientGroupItem, ClientItem } from "./client-types";

export interface ClientListViewProps {
  onPressAdd?: () => void;
  onSelectClient?: (client: ClientItem) => void;
  onSelectGroup?: (group: ClientGroupItem) => void;
  title?: string;
}

export function ClientListView({
  title = "Client",
  onSelectGroup,
  onSelectClient,
  onPressAdd,
}: ClientListViewProps) {
  const [activeTab, setActiveTab] = useState<"list" | "groups">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: clientsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery(searchQuery ? { search: searchQuery } : undefined);

  const clientsData = clientsResponse?.data;

  // Extract all_clients and new_clients arrays safely
  const allClients: ClientItem[] = Array.isArray(clientsData?.all_clients)
    ? clientsData.all_clients
    : Array.isArray(clientsData)
      ? (clientsData as any)
      : [];

  const newClients: ClientItem[] = Array.isArray(clientsData?.new_clients)
    ? clientsData.new_clients
    : [];

  // Filter all clients by search query for the "List" tab
  const filteredClients = allClients.filter((c) => {
    const nameStr = c.full_name || c.name || c.username || "";
    const phoneStr = c.phone || "";
    return (
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneStr.includes(searchQuery)
    );
  });

  // Build dynamic group categories matching user requirement
  const dynamicGroups: ClientGroupItem[] = [
    {
      id: "all",
      key: "all",
      title: `All clients (${allClients.length})`,
      count: allClients.length,
    },
    {
      id: "new",
      key: "new",
      title: `New clients (${newClients.length})`,
      count: newClients.length,
    },
  ];

  const getErrorMessage = () => {
    if (!error) return "Failed to load clients. Please check your network.";
    if (typeof error === "object" && "data" in error && error.data) {
      const d: any = error.data;
      return (
        d?.details || d?.message || d?.error || "Error fetching client list"
      );
    }
    return "Failed to load clients";
  };

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
          placeholder="Search customer by name or phone"
          prefix={
            <StyledIcons className="text-gray-400" name="search" size={18} />
          }
          value={searchQuery}
        />
      </View>

      {/* Segmented Tab Switcher */}
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
              List ({filteredClients.length})
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
              groups ({dynamicGroups.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* TAB 1: List View */}
      {activeTab === "list" && (
        <>
          {isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator color="#F0B100" size="small" />
              <Text className="mt-2 font-poppins text-xs text-gray-400">
                Loading clients...
              </Text>
            </View>
          ) : isError ? (
            <View className="items-center justify-center py-16 px-6">
              <StyledIcons
                className="text-red-400 mb-2"
                name="alert-circle-outline"
                size={36}
              />
              <Text className="font-poppins-medium text-red-500 text-sm text-center">
                {getErrorMessage()}
              </Text>
              <Pressable
                className="mt-4 rounded-full bg-black px-5 py-2 active:opacity-80"
                onPress={() => refetch()}
              >
                <Text className="font-semibold text-white text-xs">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 100,
              }}
              data={filteredClients}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={
                <View className="items-center justify-center py-20">
                  <StyledIcons
                    className="text-gray-300 mb-2"
                    name="people-outline"
                    size={40}
                  />
                  <Text className="font-poppins-medium text-gray-400 text-sm text-center">
                    {searchQuery
                      ? `No clients found matching "${searchQuery}"`
                      : "No data here"}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const clientName =
                  item.full_name || item.name || item.username || "Client";
                const clientImage = item.image || item.avatar;

                return (
                  <Pressable
                    className="flex-row items-center gap-3.5 border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
                    onPress={() => onSelectClient?.(item)}
                  >
                    {/* Avatar Image / Fallback Circle */}
                    {clientImage ? (
                      <Image
                        contentFit="cover"
                        source={{ uri: clientImage }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    ) : (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                        <StyledIcons
                          className="text-gray-500"
                          name="person"
                          size={20}
                        />
                      </View>
                    )}

                    {/* Client Info Text */}
                    <View className="flex-1">
                      <Text className="font-semibold text-sm text-gray-900">
                        {clientName}
                      </Text>
                      {item.phone ? (
                        <Text className="mt-0.5 text-gray-400 text-xs font-normal">
                          {item.phone}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* TAB 2: groups View */}
      {activeTab === "groups" && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          data={dynamicGroups}
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
                    name="people-outline"
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
