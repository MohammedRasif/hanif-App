import { StyledIcons } from "@/lib";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MOCK_CATEGORIES, MOCK_STAFF_OPTIONS } from "./mock-data";
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
  const [category, setCategory] = useState(service?.category || "Skin Care");
  const [serviceName, setServiceName] = useState(service?.name || "Face wash");
  const [description, setDescription] = useState(
    service?.description || "Bring a new stylist onto the team.",
  );
  const [duration, setDuration] = useState(service?.duration || "30 min");
  const [price, setPrice] = useState(service?.price || "$67");
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    service?.staff || ["Jhon", "doe", "doi", "kimiko"],
  );

  const [currentStaffSelect, setCurrentStaffSelect] = useState(
    MOCK_STAFF_OPTIONS[0],
  );

  // Modals for selection
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);

  const handleAddStaff = (staffToAdd?: string) => {
    const target = staffToAdd || currentStaffSelect;
    if (target && !selectedStaff.includes(target)) {
      setSelectedStaff((prev) => [...prev, target]);
    }
  };

  const handleRemoveStaff = (staffName: string) => {
    setSelectedStaff((prev) => prev.filter((s) => s !== staffName));
  };

  const handleSave = () => {
    const savedData: ServiceItem = {
      id: service?.id || Date.now().toString(),
      name: serviceName.trim() || "Service",
      category,
      description,
      duration: duration.trim() || "30 min",
      price: price.trim().startsWith("$") ? price.trim() : `$${price.trim()}`,
      staff: selectedStaff,
    };
    onSave(savedData);
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
          {serviceName || "Face wash"}
        </Text>
        <Text className="text-gray-500 text-sm mb-6">
          Bring a new stylist onto the team.
        </Text>

        {/* Field 1: Category */}
        <View className="mb-4.5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Category
          </Text>
          <Pressable
            className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
            onPress={() => setIsCategoryPickerOpen(true)}
          >
            <Text className="text-sm text-gray-900">{category}</Text>
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
              placeholder="zffffvfvbs"
              placeholderTextColor="#9CA3AF"
              value={serviceName}
            />
          </View>
        </View>

        {/* Field 3: Description */}
        <View className="mb-4.5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Descrection
          </Text>
          <View className="min-h-[120px] rounded-2xl border border-gray-200 bg-white p-4">
            <TextInput
              className="text-sm text-gray-900"
              multiline
              numberOfLines={4}
              onChangeText={setDescription}
              placeholder="zffffvfvbs"
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
              Duration
            </Text>
            <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                className="text-sm text-gray-900"
                onChangeText={setDuration}
                placeholder="Plant@gmail.com"
                placeholderTextColor="#9CA3AF"
                value={duration}
              />
            </View>
          </View>

          {/* Price */}
          <View className="flex-1">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              price
            </Text>
            <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                className="text-sm text-gray-900"
                keyboardType="numeric"
                onChangeText={setPrice}
                placeholder="$67"
                placeholderTextColor="#9CA3AF"
                value={price}
              />
            </View>
          </View>
        </View>

        {/* Field 5: Stuff (Staff assignment) */}
        <View className="mb-6">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Stuff
          </Text>
          <View className="flex-row items-center gap-2.5">
            <Pressable
              className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsStaffPickerOpen(true)}
            >
              <Text className="text-sm text-gray-900">
                {currentStaffSelect}
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>

            <Pressable
              className="h-13 w-13 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-gray-100"
              onPress={() => handleAddStaff()}
            >
              <StyledIcons className="text-gray-900" name="add" size={22} />
            </Pressable>
          </View>

          {/* Staff Badges */}
          <View className="flex-row flex-wrap gap-2.5 mt-3">
            {selectedStaff.map((staffName) => (
              <View
                className="flex-row items-center gap-2 rounded-full bg-gray-100/90 px-4 py-2.5"
                key={staffName}
              >
                <Text className="font-medium text-sm text-gray-800">
                  {staffName}
                </Text>
                <Pressable
                  className="p-0.5 active:opacity-60"
                  hitSlop={8}
                  onPress={() => handleRemoveStaff(staffName)}
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

          {/* Save Button */}
          <Pressable
            className="h-14 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleSave}
          >
            <Text className="font-bold text-base text-white">Save</Text>
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
            {MOCK_CATEGORIES.map((cat) => (
              <Pressable
                className={`py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  category === cat ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setIsCategoryPickerOpen(false);
                }}
              >
                <Text
                  className={`font-medium text-base ${
                    category === cat
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {cat}
                </Text>
                {category === cat && (
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

      {/* Staff Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsStaffPickerOpen(false)}
        transparent
        visible={isStaffPickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Staff Member
            </Text>
            {MOCK_STAFF_OPTIONS.map((st) => (
              <Pressable
                className="py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between active:bg-gray-100"
                key={st}
                onPress={() => {
                  setCurrentStaffSelect(st);
                  handleAddStaff(st);
                  setIsStaffPickerOpen(false);
                }}
              >
                <Text className="font-medium text-base text-gray-900">
                  {st}
                </Text>
                {selectedStaff.includes(st) && (
                  <StyledIcons
                    className="text-gray-400"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
