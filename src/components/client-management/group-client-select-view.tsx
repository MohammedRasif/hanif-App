import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useGetClientsQuery } from "@/Redux/feature/dashboard";
import { Image } from "expo-image";
import { Button } from "heroui-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { ClientItem } from "./client-types";

export interface GroupClientSelectViewProps {
  filterGroup?: "all" | "new";
  groupTitle?: string;
  onBack?: () => void;
  onProceed?: (selectedIds: string[]) => void;
}

export function GroupClientSelectView({
  groupTitle,
  filterGroup = "all",
  onBack,
  onProceed,
}: GroupClientSelectViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: clientsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClientsQuery(searchQuery ? { search: searchQuery } : undefined);

  const clientsData = clientsResponse?.data;

  // Extract array based on filterGroup prop ("new" vs "all")
  const rawClients: ClientItem[] =
    filterGroup === "new"
      ? Array.isArray(clientsData?.new_clients)
        ? clientsData.new_clients
        : []
      : Array.isArray(clientsData?.all_clients)
        ? clientsData.all_clients
        : Array.isArray(clientsData)
          ? (clientsData as any)
          : [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (rawClients.length > 0 && selectedIds.length === 0) {
      setSelectedIds(rawClients.map((c) => String(c.id)));
    }
  }, [rawClients]);

  const filteredClients = rawClients.filter((c) => {
    const nameStr = c.full_name || c.name || c.username || "";
    const phoneStr = c.phone || "";
    return (
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneStr.includes(searchQuery)
    );
  });

  const isAllSelected =
    filteredClients.length > 0 &&
    filteredClients.every((c) => selectedIds.includes(String(c.id)));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map((c) => String(c.id)));
    }
  };

  const toggleSelectClient = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getErrorMessage = () => {
    if (!error) return "Failed to load clients.";
    if (typeof error === "object" && "data" in error && error.data) {
      const d: any = error.data;
      return (
        d?.details || d?.message || d?.error || "Error fetching client list"
      );
    }
    return "Failed to load clients";
  };

  const displayTitle =
    groupTitle ||
    (filterGroup === "new"
      ? `New clients (${filteredClients.length})`
      : `All clients (${filteredClients.length})`);

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-3 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons
            className="text-gray-800"
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          {displayTitle}
        </Text>

        <View className="w-10" />
      </View>

      {/* Search Input */}
      <View className="px-6 mb-4">
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

      {/* Select All Toggle Bar */}
      <View className="px-6 py-2">
        <Pressable
          className="flex-row items-center py-2 self-start"
          onPress={toggleSelectAll}
        >
          <View
            className={`h-5 w-5 items-center justify-center rounded-md border ${
              isAllSelected
                ? "border-black bg-black"
                : "border-gray-300 bg-white"
            }`}
          >
            {isAllSelected && (
              <StyledIcons className="text-white" name="checkmark" size={14} />
            )}
          </View>

          <Text className="ml-3 font-semibold text-base text-gray-900">
            Select all
          </Text>
        </Pressable>
      </View>

      {/* Client List Rows */}
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
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
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
            const itemIdStr = String(item.id);
            const isSelected = selectedIds.includes(itemIdStr);
            const clientName =
              item.full_name || item.name || item.username || "Client";
            const clientImage = item.image || item.avatar;

            return (
              <Pressable
                className="flex-row items-center justify-between border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
                onPress={() => toggleSelectClient(itemIdStr)}
              >
                <View className="flex-row items-center gap-3">
                  {/* Item Checkbox */}
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-md border ${
                      isSelected
                        ? "border-black bg-black"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <StyledIcons
                        className="text-white"
                        name="checkmark"
                        size={14}
                      />
                    )}
                  </View>

                  {/* Avatar Icon / Image */}
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

                  {/* Info Text */}
                  <View>
                    <Text className="font-semibold text-base text-gray-900">
                      {clientName}
                    </Text>
                    {item.phone ? (
                      <Text className="mt-0.5 text-gray-400 text-xs font-normal">
                        {item.phone}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Chevron Right */}
                <StyledIcons
                  className="text-gray-900"
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Pinned Bottom Action Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <Button
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-main-primary focus:bg-main-primary/90"
          isDisabled={selectedIds.length === 0}
          onPress={() => onProceed?.(selectedIds)}
        >
          <Text className="font-semibold text-base text-white">
            Create message to {selectedIds.length} client
            {selectedIds.length === 1 ? "" : "s"}
          </Text>
          <StyledIcons className="text-white" name="arrow-forward" size={20} />
        </Button>
      </View>
    </View>
  );
}
