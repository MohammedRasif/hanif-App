import { Container } from "@/components/container";
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface ClientItem {
  id: string;
  name: string;
  phone: string;
}

const MOCK_SELECT_CLIENTS: ClientItem[] = [
  { id: "1", name: "Sleek showerhead", phone: "+90908779" },
  { id: "2", name: "Sleek showerhead", phone: "+90908779" },
  { id: "3", name: "Sleek showerhead", phone: "+90908779" },
  { id: "4", name: "Sleek showerhead", phone: "+90908779" },
  { id: "5", name: "Sleek showerhead", phone: "+90908779" },
  { id: "6", name: "Sleek showerhead", phone: "+90908779" },
  { id: "7", name: "Sleek showerhead", phone: "+90908779" },
];

export default function GroupClientSelect() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    MOCK_SELECT_CLIENTS.map((c) => c.id),
  );

  const filteredClients = MOCK_SELECT_CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  const isAllSelected =
    filteredClients.length > 0 &&
    filteredClients.every((c) => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map((c) => c.id));
    }
  };

  const toggleSelectClient = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-3 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <StyledIcons
            className="text-gray-800"
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          All clint (200)
        </Text>

        <View className="w-10" />
      </View>

      {/* Search Input */}
      <View className="px-6 mb-4">
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
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
              onPress={() => toggleSelectClient(item.id)}
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

                {/* Avatar Icon */}
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                  <StyledIcons
                    className="text-gray-500"
                    name="person"
                    size={20}
                  />
                </View>

                {/* Info Text */}
                <View>
                  <Text className="font-semibold text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-gray-400 text-xs font-normal">
                    {item.phone}
                  </Text>
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

      {/* Pinned Bottom Orange Action Button */}
      <View className="absolute bottom-0 left-6 right-6">
        <Button
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-main-primary focus:bg-main-primary/90"
          onPress={() => {
            console.log("Create message to selected clients:", selectedIds);
            router.push("/(role)/staff/client/group-client-message-send");
          }}
        >
          <Text className="font-semibold text-base text-white">
            Create message to 233 clint
          </Text>
          <StyledIcons className="text-white" name="arrow-forward" size={20} />
        </Button>
      </View>
    </Container>
  );
}
