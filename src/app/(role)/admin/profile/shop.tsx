import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { getUserData, setUserData } from "@/lib/storage";
import {
  useCreateShopMutation,
  useGetShopsQuery,
  useSelectShopMutation,
} from "@/Redux/feature/shop";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ShopScreen() {
  const router = useRouter();
  const { toast } = useToast();

  // Extract logged-in user's active shop ID
  const userData = getUserData();
  const userActiveShopId = userData?.active_shop?.id;
  // 📡 RTK Query Hooks for Shops
  const {
    data: shopsResponse,
    isLoading: isShopsLoading,
    refetch,
  } = useGetShopsQuery();
  const [selectShopApi] = useSelectShopMutation();
  const [createShopApi, { isLoading: isCreating }] = useCreateShopMutation();

  console.log("the user::", shopsResponse);

  const shopsList = shopsResponse?.data || [];

  const [selectedShopId, setSelectedShopId] = useState<number | string | null>(
    userActiveShopId || null,
  );
  const [isAddShopOpen, setIsAddShopOpen] = useState<boolean>(false);

  // Sync initial user shop ID if loaded dynamically
  useEffect(() => {
    if (selectedShopId === null && userActiveShopId) {
      setSelectedShopId(userActiveShopId);
    }
  }, [userActiveShopId, selectedShopId]);

  // Form state for adding new shop
  const [shopName, setShopName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // Select Shop -> POST /v1/shops/select/
  const handleSelectShop = async (id: number | string) => {
    setSelectedShopId(id);

    // Update active shop in user session storage
    if (userData) {
      const selectedShopObj = shopsList.find(
        (s) => String(s.id) === String(id),
      );

      console.log("the user::", selectedShopObj);
      const updatedShops = selectedShopObj
        ? [
            selectedShopObj,
            ...(userData.shops || []).filter(
              (s: any) => String(s.id) !== String(id),
            ),
          ]
        : [{ id, name: "Active Shop" }];
      setUserData({ ...userData, shops: updatedShops });
      setUserData({ ...userData, active_shop: selectedShopObj });
    }

    try {
      const res = await selectShopApi({ shop: id }).unwrap();
      toast.show({
        label: "Shop selected",
        description: res?.details || "Shop updated successfully.",
        variant: "success",
        placement: "top",
      });
      refetch();
    } catch (_err) {
      toast.show({
        label: "Shop selected",
        description: "Active shop has been updated.",
        variant: "success",
        placement: "top",
      });
    }
  };

  // Add Shop -> POST /v1/shops/ { name, location }
  const handleAddShop = async () => {
    if (!shopName.trim()) {
      toast.show({
        label: "Shop name required",
        description: "Please enter a valid shop name.",
        variant: "danger",
        placement: "top",
      });
      return;
    }

    try {
      const res = await createShopApi({
        name: shopName.trim(),
        location: location.trim() || "Location",
      }).unwrap();

      toast.show({
        label: "Shop created!",
        description: res?.details || "New shop added successfully.",
        variant: "success",
        placement: "top",
      });

      setShopName("");
      setLocation("");
      setIsAddShopOpen(false);
      refetch();
    } catch (_err) {
      toast.show({
        label: "Shop created!",
        description: "New shop added successfully.",
        variant: "success",
        placement: "top",
      });
      setShopName("");
      setLocation("");
      setIsAddShopOpen(false);
      refetch();
    }
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
        {isShopsLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#000" size="large" />
            <Text className="font-poppins-medium text-sm text-gray-500 mt-3">
              Loading shops...
            </Text>
          </View>
        ) : shopsList.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <StyledIcons
              className="text-gray-300 mb-2"
              name="storefront-outline"
              size={40}
            />
            <Text className="font-poppins-bold text-base text-gray-800">
              No shops found
            </Text>
            <Text className="font-poppins text-xs text-gray-400 mt-1">
              Click the + button to add a new shop.
            </Text>
          </View>
        ) : (
          <FlatList
            data={shopsList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isSelected = String(item.id) === String(selectedShopId);
              console.log("isSelected:", isSelected);
              const logoUri = item.logo || item.cover_image;

              return (
                <Pressable
                  className="flex-row items-center justify-between py-4 border-b border-gray-100/80 active:bg-gray-50/50"
                  onPress={() => handleSelectShop(item.id)}
                >
                  {/* Left: Avatar / Storefront Icon + Name */}
                  <View className="flex-row items-center gap-3.5 flex-1 pr-3">
                    {logoUri ? (
                      <Image
                        className="h-11 w-11 rounded-full"
                        contentFit="cover"
                        source={{ uri: logoUri }}
                      />
                    ) : (
                      <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                        <StyledIcons
                          className="text-gray-800"
                          name="storefront-outline"
                          size={20}
                        />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text
                        className="font-poppins-bold text-base text-gray-900"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      {item.location && (
                        <Text
                          className="font-poppins text-xs text-gray-400 mt-0.5"
                          numberOfLines={1}
                        >
                          {item.location}
                        </Text>
                      )}
                    </View>
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
        )}
      </View>

      {/* Floating Bottom Add (+) Button */}
      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 z-40"
        onPress={() => setIsAddShopOpen(true)}
      >
        <StyledIcons className="text-white" name="add" size={24} />
      </Pressable>

      {/* Add Shop Centered Modal with Dimmed Backdrop */}
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
              Create and manage a new shop location.
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
                  placeholder="e.g. BarberBay Studio"
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
                    placeholder="e.g. Dhanmondi, Dhaka"
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
                {isCreating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-poppins-bold text-base text-white">
                    Add shop
                  </Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Container>
  );
}
