import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MOCK_SHOP_SETTINGS } from "./mock-data";
import type { ShopSettingsData, ShopSettingsProps } from "./types";

export function ShopSettingsScreen({ onBack }: ShopSettingsProps) {
  const router = useRouter();
  const [shopData, setShopData] =
    useState<ShopSettingsData>(MOCK_SHOP_SETTINGS);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<{
    key: keyof ShopSettingsData;
    multiline?: boolean;
    title: string;
    value: string;
  } | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const openEditor = (
    title: string,
    key: keyof ShopSettingsData,
    multiline = false,
  ) => {
    const val = shopData[key];
    setEditingField({
      title,
      key,
      value: typeof val === "string" ? val : "",
      multiline,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveField = () => {
    if (!editingField) return;
    setShopData((prev) => ({
      ...prev,
      [editingField.key]: editingField.value,
    }));
    setIsEditModalOpen(false);
    setEditingField(null);
  };

  const handleUploadGallery = () => {
    console.log("Upload gallery image clicked");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-3 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={handleBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Shop
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cover & Profile Picture Container */}
        <View className="mb-6 pt-1">
          {/* Cover Photo */}
          <View className="h-44 w-full rounded-2xl overflow-hidden bg-gray-200 relative">
            <Image
              className="h-full w-full"
              contentFit="cover"
              source={{ uri: shopData.coverUrl }}
            />
            <Pressable
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white items-center justify-center shadow-md active:scale-95"
              onPress={() => console.log("Change cover photo")}
            >
              <StyledIcons
                className="text-gray-900"
                name="camera-outline"
                size={16}
              />
            </Pressable>
          </View>

          {/* Profile Avatar overlapping */}
          <View className="-mt-12 self-center relative">
            <Image
              className="h-24 w-24 rounded-full border-4 border-white bg-gray-200"
              contentFit="cover"
              source={{ uri: shopData.avatarUrl }}
            />
            <Pressable
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white items-center justify-center shadow-md active:scale-95 border border-gray-100"
              onPress={() => console.log("Change avatar photo")}
            >
              <StyledIcons
                className="text-gray-900"
                name="camera-outline"
                size={14}
              />
            </Pressable>
          </View>
        </View>

        {/* Section 1: Shop Name */}
        <View className="mb-5">
          <Text className="font-bold text-base text-gray-900 mb-2">
            Shop name
          </Text>
          <Pressable
            className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Shop name", "shopName")}
          >
            <Text className="font-medium text-sm text-gray-900 flex-1 mr-2">
              {shopData.shopName}
            </Text>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section 2: Location */}
        <View className="mb-5">
          <Text className="font-bold text-base text-gray-900 mb-2">
            Location
          </Text>
          <Pressable
            className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Location", "location")}
          >
            <View className="flex-row items-center gap-2.5 flex-1 mr-2">
              <StyledIcons
                className="text-gray-900"
                name="location-outline"
                size={20}
              />
              <Text className="font-medium text-sm text-gray-900">
                {shopData.location}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section 3: About us */}
        <View className="mb-5">
          <Text className="font-bold text-base text-gray-900 mb-2">
            About us
          </Text>
          <Pressable
            className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-start justify-between active:bg-gray-100"
            onPress={() => openEditor("About us", "aboutUs", true)}
          >
            <Text className="font-medium text-sm text-gray-500 flex-1 mr-3 leading-5">
              {shopData.aboutUs}
            </Text>
            <StyledIcons
              className="text-gray-900 mt-0.5"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section 4: Gallery */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-bold text-base text-gray-900">Gallery</Text>
            <Pressable
              className="flex-row items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 active:bg-gray-50 shadow-xs"
              onPress={handleUploadGallery}
            >
              <StyledIcons
                className="text-gray-900"
                name="cloud-upload-outline"
                size={16}
              />
              <Text className="font-medium text-xs text-gray-900">Upload</Text>
            </Pressable>
          </View>

          {/* Gallery Thumbnails */}
          <View className="flex-row gap-2.5">
            {shopData.gallery.map((imgUri, index) => (
              <View
                className="h-20 flex-1 rounded-2xl overflow-hidden bg-gray-100"
                key={index}
              >
                <Image
                  className="h-full w-full"
                  contentFit="cover"
                  source={{ uri: imgUri }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Section 5: Social Media Links */}
        <View className="mb-6">
          <Text className="font-bold text-base text-gray-900 mb-3">
            Social media links
          </Text>

          {/* Facebook */}
          <Pressable
            className="mb-2.5 rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Facebook URL", "facebookUrl")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons
                className="text-[#1877F2]"
                name="logo-facebook"
                size={22}
              />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-600 flex-1"
                numberOfLines={1}
              >
                {shopData.facebookUrl}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>

          {/* Instagram */}
          <Pressable
            className="mb-2.5 rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Instagram URL", "instagramUrl")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons
                className="text-[#E1306C]"
                name="logo-instagram"
                size={22}
              />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-600 flex-1"
                numberOfLines={1}
              >
                {shopData.instagramUrl}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>

          {/* TikTok */}
          <Pressable
            className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("TikTok URL", "tiktokUrl")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons
                className="text-gray-900"
                name="logo-tiktok"
                size={22}
              />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-600 flex-1"
                numberOfLines={1}
              >
                {shopData.tiktokUrl}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section 6: Contact Information */}
        <View className="mb-6">
          <Text className="font-bold text-base text-gray-900 mb-3">
            Contact information
          </Text>

          {/* WhatsApp */}
          <Pressable
            className="mb-2.5 rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("WhatsApp Number", "whatsapp")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons
                className="text-[#25D366]"
                name="logo-whatsapp"
                size={22}
              />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-700 flex-1"
                numberOfLines={1}
              >
                {shopData.whatsapp}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>

          {/* Phone */}
          <Pressable
            className="mb-2.5 rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Phone Number", "phone")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons className="text-[#3B82F6]" name="call" size={20} />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-700 flex-1"
                numberOfLines={1}
              >
                {shopData.phone}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>

          {/* Email */}
          <Pressable
            className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
            onPress={() => openEditor("Email Address", "email")}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <StyledIcons className="text-[#3B82F6]" name="mail" size={20} />
              <View className="h-4 w-[1px] bg-gray-300 mx-3" />
              <Text
                className="font-medium text-xs text-gray-700 flex-1"
                numberOfLines={1}
              >
                {shopData.email}
              </Text>
            </View>
            <StyledIcons
              className="text-gray-900"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
        transparent
        visible={isEditModalOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-2 font-bold text-xl text-gray-900">
              Edit {editingField?.title}
            </Text>

            <View
              className={`mb-5 rounded-2xl border border-gray-200 bg-white px-4 ${
                editingField?.multiline
                  ? "min-h-[100px] py-3"
                  : "h-13 justify-center"
              }`}
            >
              <TextInput
                autoFocus
                className="text-sm text-gray-900"
                multiline={editingField?.multiline}
                numberOfLines={editingField?.multiline ? 4 : 1}
                onChangeText={(text) =>
                  setEditingField((prev) =>
                    prev ? { ...prev, value: text } : null,
                  )
                }
                placeholder={`Enter ${editingField?.title.toLowerCase()}`}
                placeholderTextColor="#9CA3AF"
                style={
                  editingField?.multiline
                    ? { textAlignVertical: "top" }
                    : undefined
                }
                value={editingField?.value}
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                className="h-12 flex-1 items-center justify-center rounded-xl bg-[#FF9500] active:bg-[#e08300]"
                onPress={handleSaveField}
              >
                <Text className="font-bold text-white">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
