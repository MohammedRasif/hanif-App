import { StyledIcons } from "@/lib";
import { Dialog } from "heroui-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
};

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleDone = () => {
    if (activeTab === "existing") {
      onSubmit?.({
        type: "existing",
        customer: { name: searchQuery.trim() || "Existing Customer" },
        fullName: searchQuery.trim() || "Existing Customer",
      });
    } else {
      onSubmit?.({
        type: "new",
        customer: { fullName, email, phoneNumber },
        fullName: fullName || "New Customer",
        email,
        phoneNumber,
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[92%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Top Back Navigation */}
          <Pressable
            className="mb-2 flex-row items-center gap-1.5 self-start py-1"
            onPress={() => onOpenChange(false)}
          >
            <StyledIcons
              className="text-gray-700"
              name="arrow-back"
              size={20}
            />
            <Text className="font-medium text-base text-gray-700">Back</Text>
          </Pressable>

          {/* Dialog Title & Subtitle */}
          <Dialog.Title className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
            New booking
          </Dialog.Title>
          <Text className="mb-5 text-gray-500 text-sm">
            Create an apartment in few quick steps
          </Text>

          {/* Segment Tabs: Existing Customer vs New Customer */}
          <View className="mb-5 flex-row gap-2.5">
            <Pressable
              className={`flex-1 items-center justify-center py-3 px-3 rounded-2xl border ${
                activeTab === "existing"
                  ? "border-[#FF9500] bg-white shadow-xs"
                  : "border-transparent bg-gray-100/80"
              }`}
              onPress={() => setActiveTab("existing")}
            >
              <Text
                className={`font-semibold text-xs text-center ${
                  activeTab === "existing" ? "text-gray-900" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                Existing customer
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 items-center justify-center py-3 px-3 rounded-2xl border ${
                activeTab === "new"
                  ? "border-[#FF9500] bg-white shadow-xs"
                  : "border-transparent bg-gray-100/80"
              }`}
              onPress={() => setActiveTab("new")}
            >
              <Text
                className={`font-semibold text-xs text-center ${
                  activeTab === "new" ? "text-gray-900" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                New customer
              </Text>
            </Pressable>
          </View>

          {/* Tab 1: Existing Customer */}
          {activeTab === "existing" ? (
            <View className="mb-6">
              <View className="h-13 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
                <StyledIcons
                  className="mr-2.5 text-gray-400"
                  name="search"
                  size={20}
                />
                <TextInput
                  className="flex-1 text-sm text-gray-900"
                  onChangeText={setSearchQuery}
                  placeholder="Search customer"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                />
              </View>
            </View>
          ) : (
            /* Tab 2: New Customer Form */
            <View className="mb-6 gap-3.5">
              {/* Full Name */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Full Name
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    className="text-sm text-gray-900"
                    onChangeText={setFullName}
                    placeholder="Plant@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Email
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    autoCapitalize="none"
                    className="text-sm text-gray-900"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="Plant@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Phone Number
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    className="text-sm text-gray-900"
                    keyboardType="phone-pad"
                    onChangeText={setPhoneNumber}
                    placeholder="0156614612"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Done Button */}
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleDone}
          >
            <Text className="font-bold text-base text-white">Done</Text>
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
