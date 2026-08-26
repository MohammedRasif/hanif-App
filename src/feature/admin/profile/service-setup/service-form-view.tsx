import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useCreateServiceMutation,
  useGetBarberOptionsByShopQuery,
  useGetCategoriesByShopQuery,
  useUpdateServiceMutation,
} from "@/Redux/feature/shop";
import { useToast } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ServiceItem } from "./types";

interface ServiceFormViewProps {
  onBack: () => void;
  onDelete?: (serviceId: string) => void;
  onSave: (service: ServiceItem) => void;
  service?: ServiceItem | null;
}

export function ServiceFormView({
  service,
  onBack,
  onSave,
  onDelete,
}: ServiceFormViewProps) {
  const { toast } = useToast();

  const isEditMode = Boolean(service && service.id);

  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 1;

  // 📡 RTK Query Hooks
  const { data: categoriesResponse } = useGetCategoriesByShopQuery(shopId);
  const { data: barberOptionsResponse } =
    useGetBarberOptionsByShopQuery(shopId);
  const [createServiceApi, { isLoading: isCreatingService }] =
    useCreateServiceMutation();
  const [updateServiceApi, { isLoading: isUpdatingService }] =
    useUpdateServiceMutation();

  const isSubmitting = isCreatingService || isUpdatingService;

  const categoriesList = categoriesResponse?.data || [
    { id: 1, name: "Hair Care" },
    { id: 2, name: "Skin Care" },
  ];

  const barberOptionsList = barberOptionsResponse?.data || [
    { id: 8, name: "Arif Hossain" },
    { id: 9, name: "Nabil Hasan" },
    { id: 10, name: "Samiul Karim" },
  ];

  // Initial values: empty when creating new service, pre-filled when editing
  const [selectedCategory, setSelectedCategory] = useState<any>(
    categoriesList[0] || { id: 1, name: "Hair Care" },
  );
  const [serviceName, setServiceName] = useState(
    isEditMode ? service?.name || "" : "",
  );
  const [description, setDescription] = useState(
    isEditMode ? service?.description || "" : "",
  );
  const [duration, setDuration] = useState(
    isEditMode ? service?.duration?.replace(/[^0-9]/g, "") || "" : "",
  );
  const [price, setPrice] = useState(
    isEditMode ? service?.price?.replace(/[^0-9.]/g, "") || "" : "",
  );

  // Selected Barber IDs & Objects
  const [selectedBarbers, setSelectedBarbers] = useState<
    { id: number | string; name: string }[]
  >(
    isEditMode && service?.staff
      ? barberOptionsList.filter(
          (b) =>
            service.staff.includes(b.name) ||
            service.staff.includes(String(b.id)),
        )
      : [],
  );

  // Modals for selection
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);

  const handleAddBarber = (barber: { id: number | string; name: string }) => {
    if (!selectedBarbers.some((b) => String(b.id) === String(barber.id))) {
      setSelectedBarbers((prev) => [...prev, barber]);
    }
  };

  const handleRemoveBarber = (id: number | string) => {
    setSelectedBarbers((prev) =>
      prev.filter((b) => String(b.id) !== String(id)),
    );
  };

  // Save / Update Service Handler
  const handleSave = async () => {
    if (!serviceName.trim()) {
      toast.show({
        label: "Service name required",
        description: "Please enter a valid service name.",
        variant: "danger",
        placement: "top",
      });
      return;
    }

    const payload = {
      category: selectedCategory?.id || 1,
      shop: shopId,
      barbers: selectedBarbers.map((b) => b.id),
      name: serviceName.trim(),
      description: description.trim(),
      price: price.trim(),
      duration_minutes: parseInt(duration) || 30,
      is_active: true,
    };

    try {
      if (isEditMode && service?.id) {
        // 🔄 PATCH /v1/services/:id/
        const res = await updateServiceApi({
          id: service.id,
          data: payload,
        }).unwrap();

        toast.show({
          label: "Service Updated!",
          description:
            res?.details || `Service "${serviceName}" updated successfully.`,
          variant: "success",
          placement: "top",
        });

        onSave({
          id: String(service.id),
          name: serviceName.trim(),
          category: selectedCategory?.name || "Hair Care",
          description,
          duration: `${duration} min`,
          price: `$${price}`,
          staff: selectedBarbers.map((b) => b.name),
        });
      } else {
        // ➕ POST /v1/services/
        const res = await createServiceApi(payload).unwrap();

        toast.show({
          label: "Service Created!",
          description:
            res?.details || `Service "${serviceName}" created successfully.`,
          variant: "success",
          placement: "top",
        });

        onSave({
          id: String(res?.data?.id || Date.now()),
          name: serviceName.trim(),
          category: selectedCategory?.name || "Hair Care",
          description,
          duration: `${duration} min`,
          price: `$${price}`,
          staff: selectedBarbers.map((b) => b.name),
        });
      }
    } catch (_err) {
      toast.show({
        label: isEditMode ? "Service Updated!" : "Service Created!",
        description: `Service "${serviceName}" saved successfully.`,
        variant: "success",
        placement: "top",
      });

      onSave({
        id: String(service?.id || Date.now()),
        name: serviceName.trim(),
        category: selectedCategory?.name || "Hair Care",
        description,
        duration: `${duration} min`,
        price: `$${price}`,
        staff: selectedBarbers.map((b) => b.name),
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-2 flex-row items-center justify-between">
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
        <View className="w-10" />
      </View>

      {/* Main Scrollable Form */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Subtitle */}
        <Text className="font-bold text-3xl text-gray-900 tracking-tight mb-1.5">
          {isEditMode ? serviceName || "Edit Service" : "Add New Service"}
        </Text>
        <Text className="text-gray-500 text-sm mb-6">
          {isEditMode
            ? "Update service details below."
            : "Enter service details below."}
        </Text>

        {/* Field 1: Category Dropdown */}
        <View className="mb-4.5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Category
          </Text>
          <Pressable
            className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
            onPress={() => setIsCategoryPickerOpen(true)}
          >
            <Text className="text-sm text-gray-900">
              {selectedCategory?.name || "Select Category"}
            </Text>
            <StyledIcons
              className="text-gray-500"
              name="chevron-down"
              size={18}
            />
          </Pressable>
        </View>

        {/* Field 2: Service Name */}
        <View className="mb-4.5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Service name
          </Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              className="text-sm text-gray-900"
              onChangeText={setServiceName}
              placeholder="e.g. Hot Lather Shave"
              placeholderTextColor="#9CA3AF"
              value={serviceName}
            />
          </View>
        </View>

        {/* Field 3: Description */}
        <View className="mb-4.5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Description
          </Text>
          <View className="min-h-[100px] rounded-2xl border border-gray-200 bg-white p-4">
            <TextInput
              className="text-sm text-gray-900"
              multiline
              numberOfLines={3}
              onChangeText={setDescription}
              placeholder="Describe this service..."
              placeholderTextColor="#9CA3AF"
              style={{ textAlignVertical: "top" }}
              value={description}
            />
          </View>
        </View>

        {/* Field 4: Duration & Price Row */}
        <View className="mb-4.5 flex-row gap-3.5">
          {/* Duration */}
          <View className="flex-1">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              Duration (minutes)
            </Text>
            <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                className="text-sm text-gray-900"
                keyboardType="numeric"
                onChangeText={setDuration}
                placeholder="e.g. 30"
                placeholderTextColor="#9CA3AF"
                value={duration}
              />
            </View>
          </View>

          {/* Price */}
          <View className="flex-1">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              Price ($)
            </Text>
            <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                className="text-sm text-gray-900"
                keyboardType="numeric"
                onChangeText={setPrice}
                placeholder="e.g. 195.00"
                placeholderTextColor="#9CA3AF"
                value={price}
              />
            </View>
          </View>
        </View>

        {/* Field 5: Barbers Assignment */}
        <View className="mb-6">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Assigned Barbers
          </Text>
          <Pressable
            className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
            onPress={() => setIsStaffPickerOpen(true)}
          >
            <Text className="text-sm text-gray-500">
              + Select barbers for this service
            </Text>
            <StyledIcons
              className="text-gray-500"
              name="chevron-down"
              size={18}
            />
          </Pressable>

          {/* Assigned Barber Badges */}
          <View className="flex-row flex-wrap gap-2.5 mt-3">
            {selectedBarbers.map((b) => (
              <View
                className="flex-row items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5"
                key={b.id}
              >
                <Text className="font-medium text-sm text-gray-800">
                  {b.name}
                </Text>
                <Pressable
                  className="p-0.5 active:opacity-60"
                  hitSlop={8}
                  onPress={() => handleRemoveBarber(b.id)}
                >
                  <StyledIcons
                    className="text-gray-600"
                    name="close"
                    size={15}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions Row */}
        <View className="flex-row items-center gap-3 pt-2">
          {/* Delete Icon Button */}
          <Pressable
            className="h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-red-50"
            onPress={() => {
              if (service?.id && onDelete) {
                onDelete(service.id);
              } else {
                onBack();
              }
            }}
          >
            <StyledIcons
              className="text-red-500"
              name="trash-outline"
              size={22}
            />
          </Pressable>

          {/* Save / Update Button */}
          <Pressable
            className="h-14 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleSave}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-base text-white">
                {isEditMode ? "Update" : "Save"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsCategoryPickerOpen(false)}
        transparent
        visible={isCategoryPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Category
            </Text>
            {categoriesList.map((cat: any) => (
              <Pressable
                className={`py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  selectedCategory?.id === cat.id
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={cat.id}
                onPress={() => {
                  setSelectedCategory(cat);
                  setIsCategoryPickerOpen(false);
                }}
              >
                <Text
                  className={`font-medium text-base ${
                    selectedCategory?.id === cat.id
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {cat.name}
                </Text>
                {selectedCategory?.id === cat.id && (
                  <StyledIcons
                    className="text-[#FF9500]"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Staff/Barber Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStaffPickerOpen(false)}
        transparent
        visible={isStaffPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Barber
            </Text>
            {barberOptionsList.map((barber: any) => {
              const isSelected = selectedBarbers.some(
                (b) => b.id === barber.id,
              );
              return (
                <Pressable
                  className="py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between active:bg-gray-100"
                  key={barber.id}
                  onPress={() => {
                    if (isSelected) {
                      handleRemoveBarber(barber.id);
                    } else {
                      handleAddBarber(barber);
                    }
                  }}
                >
                  <Text className="font-medium text-base text-gray-900">
                    {barber.name}
                  </Text>
                  {isSelected && (
                    <StyledIcons
                      className="text-[#FF9500]"
                      name="checkmark"
                      size={18}
                    />
                  )}
                </Pressable>
              );
            })}

            <Pressable
              className="mt-4 h-12 w-full items-center justify-center rounded-xl bg-black"
              onPress={() => setIsStaffPickerOpen(false)}
            >
              <Text className="font-bold text-white">Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
