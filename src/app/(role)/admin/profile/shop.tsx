import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export interface ShopItem {
  avatarUrl?: string;
  id: string;
  isIcon?: boolean;
  name: string;
}

const INITIAL_SHOPS: ShopItem[] = [
  {
    id: "1",
    name: "Jazz barber",
    avatarUrl:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=150",
  },
  {
    id: "2",
    name: "Head short",
    isIcon: true,
  },
  {
    id: "3",
    name: "Look change",
    isIcon: true,
  },
];

export default function ShopScreen() {
  const router = useRouter();
  const [shops, setShops] = useState<ShopItem[]>(INITIAL_SHOPS);
  const [selectedShopId, setSelectedShopId] = useState<string>("1");
  const [isAddShopOpen, setIsAddShopOpen] = useState<boolean>(false);

  // Form state for adding new shop
  const [shopName, setShopName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleAddShop = () => {
    if (!shopName.trim()) return;

    const newShop: ShopItem = {
      id: Date.now().toString(),
      name: shopName.trim(),
      isIcon: true,
    };

    setShops((prev) => [...prev, newShop]);
    setSelectedShopId(newShop.id);
    setShopName("");
    setLocation("");
    setIsAddShopOpen(false);
  };

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <Text className="font-poppins-bold text-lg text-gray-900 tracking-tight">
          Shop
        </Text>

        <View className="w-10" />
      </View>

      {/* Shop List */}
      <View className="px-6 pt-2 flex-1">
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedShopId === item.id;
            return (
              <Pressable
                className="flex-row items-center justify-between py-4 border-b border-gray-100/80 active:bg-gray-50/50"
                onPress={() => setSelectedShopId(item.id)}
              >
                {/* Left: Avatar / Storefront Icon + Name */}
                <View className="flex-row items-center gap-3.5">
                  {item.avatarUrl ? (
                    <Image
                      className="h-10 w-10 rounded-full"
                      contentFit="cover"
                      source={{ uri: item.avatarUrl }}
                    />
                  ) : (
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <StyledIcons
                        className="text-gray-900"
                        name="storefront-outline"
                        size={20}
                      />
                    </View>
                  )}

                  <Text className="font-poppins-bold text-base text-gray-900">
                    {item.name}
                  </Text>
                </View>

                {/* Right: Radio Selection Circle */}
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full ${
                    isSelected ? "border-2 border-black" : "bg-[#e5e7eb]"
                  }`}
                >
                  {isSelected && (
                    <View className="h-3 w-3 rounded-full bg-black" />
                  )}
                </View>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Bottom Add (+) Button */}
      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 z-40"
        onPress={() => setIsAddShopOpen(true)}
      >
        <StyledIcons className="text-white" name="add" size={24} />
      </Pressable>

      {/* Add Shop Centered Modal with Dimmed/Blurred Backdrop */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsAddShopOpen(false)}
        transparent={true}
        visible={isAddShopOpen}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/60 px-6"
          onPress={() => setIsAddShopOpen(false)}
        >
          {/* Modal Container */}
          <Pressable
            className="w-full rounded-[28px] bg-white p-6 shadow-2xl"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header with Title and Close Button */}
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-poppins-bold text-2xl text-gray-900">
                Add Shop
              </Text>
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full active:bg-gray-100"
                onPress={() => setIsAddShopOpen(false)}
              >
                <StyledIcons className="text-gray-800" name="close" size={20} />
              </Pressable>
            </View>

            {/* Subtitle */}
            <Text className="mb-6 font-poppins text-sm text-gray-500">
              Bring a new stylist onto the team.
            </Text>

            {/* Form Fields */}
            <View className="gap-4">
              {/* Field 1: Shop Name */}
              <View>
                <Text className="mb-1.5 font-poppins-medium text-sm text-gray-700">
                  Shop name
                </Text>
                <TextInput
                  className="h-13 w-full rounded-2xl border border-gray-200 bg-white px-4 font-poppins text-sm text-gray-900"
                  onChangeText={setShopName}
                  placeholder="e.g. Jazz barber"
                  placeholderTextColor="#9ca3af"
                  value={shopName}
                />
              </View>

              {/* Field 2: Location */}
              <View>
                <Text className="mb-1.5 font-poppins-medium text-sm text-gray-700">
                  Location
                </Text>
                <View className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4">
                  <TextInput
                    className="flex-1 font-poppins text-sm text-gray-900"
                    onChangeText={setLocation}
                    placeholder="Plant@gmail.com"
                    placeholderTextColor="#9ca3af"
                    value={location}
                  />
                  <StyledIcons
                    className="text-black"
                    name="location-outline"
                    size={20}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                className="mt-3 h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
                onPress={handleAddShop}
              >
                <Text className="font-poppins-bold text-base text-white">
                  Add shop
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Container>
  );
}
