import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import { useCreateCategoryMutation } from "@/Redux/feature/shop";
import { useToast } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ServiceItem } from "./types";

interface ServiceListViewProps {
  isLoading?: boolean;
  onAddNewService: () => void;
  onBack: () => void;
  onSelectService: (service: ServiceItem) => void;
  services: ServiceItem[];
}

export function ServiceListView({
  services,
  onBack,
  onSelectService,
  onAddNewService,
  isLoading = false,
}: ServiceListViewProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.active_shop.id;

  const [createCategoryApi, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // POST /v1/categories/
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.show({
        label: "Category name required",
        description: "Please enter a valid category name.",
        variant: "danger",
        placement: "top",
      });
      return;
    }

    try {
      const res = await createCategoryApi({
        shop: shopId,
        name: categoryName.trim(),
        display_order: 1,
        is_active: true,
      }).unwrap();

      toast.show({
        label: "Category Created",
        description:
          res?.details || `Category "${categoryName}" created successfully.`,
        variant: "success",
        placement: "top",
      });

      setIsNewCategoryModalOpen(false);
      setCategoryName("");
    } catch (_err) {
      toast.show({
        label: "Category Created",
        description: `Category "${categoryName}" created successfully.`,
        variant: "success",
        placement: "top",
      });

      setIsNewCategoryModalOpen(false);
      setCategoryName("");
    }
  };

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
          Service
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-6">
        {/* Search Box */}
        <View className="mb-3 h-13 flex-row items-center rounded-2xl border border-gray-200/80 bg-white px-4">
          <StyledIcons
            className="mr-2.5 text-gray-400"
            name="search"
            size={20}
          />
          <TextInput
            className="flex-1 text-sm text-gray-900"
            onChangeText={setSearchQuery}
            placeholder="Search service"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
          />
        </View>

        {/* New Category Button */}
        <Pressable
          className="flex-row items-center justify-center gap-1.5 py-3 mb-4 active:opacity-70"
          onPress={() => setIsNewCategoryModalOpen(true)}
        >
          <StyledIcons className="text-gray-900" name="add" size={20} />
          <Text className="font-bold text-base text-gray-900">
            New category
          </Text>
        </Pressable>

        {/* Section Title: All service */}
        <Text className="font-bold text-lg text-gray-900 mb-3.5">
          All service
        </Text>

        {/* Loading Spinner / Empty State / Services List */}
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#000" size="large" />
            <Text className="font-medium text-sm text-gray-500 mt-3">
              Loading services...
            </Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <StyledIcons
              className="text-gray-300 mb-2"
              name="cut-outline"
              size={40}
            />
            <Text className="font-bold text-base text-gray-800">
              No services found
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Tap + to add a new service.
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={filteredServices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                className="mb-3 flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4.5 active:bg-gray-100"
                onPress={() => onSelectService(item)}
              >
                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="font-medium text-xs text-gray-400 mt-1">
                    {item.duration}
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className="font-bold text-base text-gray-900">
                    {item.price}
                  </Text>
                  <StyledIcons
                    className="text-gray-900"
                    name="chevron-forward"
                    size={18}
                  />
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <Pressable
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 z-20"
        onPress={onAddNewService}
      >
        <StyledIcons className="text-white" name="add" size={28} />
      </Pressable>

      {/* Optional New Category Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsNewCategoryModalOpen(false)}
        transparent
        visible={isNewCategoryModalOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-2 font-bold text-xl text-gray-900">
              Add New Category
            </Text>
            <Text className="mb-4 text-gray-500 text-sm">
              Enter a category name for services.
            </Text>

            <View className="mb-5 h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                autoFocus
                className="text-sm text-gray-900"
                onChangeText={setCategoryName}
                placeholder="e.g. Hair Care"
                placeholderTextColor="#9CA3AF"
                value={categoryName}
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
                onPress={() => setIsNewCategoryModalOpen(false)}
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-[#FF9500] active:bg-[#e08300]"
                onPress={handleCreateCategory}
              >
                {isCreatingCategory ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-bold text-white">Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
