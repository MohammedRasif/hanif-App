// src/components/shop/ShopSettingsScreen.tsx
import { StyledIcons } from "@/lib";
import { getUserData, setUserData } from "@/lib/storage";
import {
  useGetShopDetailsQuery,
  useGetShopGalleryQuery,
  useUpdateShopDetailsMutation,
  useUpdateShopGalleryMutation,
} from "@/Redux/feature/shop";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MOCK_SHOP_SETTINGS } from "./mock-data";
import type { ShopSettingsData, ShopSettingsProps } from "./types";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";
const DEFAULT_COVER_IMAGE =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1751196563/b170870007dfa419295d949814474ab2_t_qm2pcq.jpg";

export function ShopSettingsScreen({ onBack }: ShopSettingsProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Get userData from storage
  const userData = getUserData();
  const shopId = userData?.active_shop?.id;

  // 📡 RTK Query Hooks for Shop Details and Gallery
  const {
    data: shopDetailsResponse,
    isLoading: isShopLoading,
    refetch: refetchDetails,
  } = useGetShopDetailsQuery(shopId, { refetchOnMountOrArgChange: true });

  const { data: galleryResponse, refetch: refetchGallery } =
    useGetShopGalleryQuery(shopId, { refetchOnMountOrArgChange: true });

  const [updateShopApi, { isLoading: isUpdatingShop }] =
    useUpdateShopDetailsMutation();
  const [updateGalleryApi] = useUpdateShopGalleryMutation();

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<{
    apiKey?: string;
    key: keyof ShopSettingsData;
    multiline?: boolean;
    title: string;
    value: string;
  } | null>(null);

  // Get data from API responses
  const apiShopData = shopDetailsResponse?.data;
  const apiGalleryData = galleryResponse?.data;

  // Get shop data with fallbacks - use userData values
  const getShopData = useCallback(() => {
    // Start with userData values as base
    const baseData = {
      shopName: userData?.active_shop?.name || "My Barber Shop",
      location: userData?.active_shop?.location || "Banani, Dhaka",
      aboutUs: apiShopData?.about_us || "Professional grooming services.",
      avatarUrl: userData?.active_shop?.logo || DEFAULT_PROFILE_IMAGE,
      coverUrl: userData?.active_shop?.cover_image || DEFAULT_COVER_IMAGE,
      gallery: [DEFAULT_COVER_IMAGE, DEFAULT_COVER_IMAGE],
      facebookUrl: apiShopData?.facebook || "",
      instagramUrl: apiShopData?.instagram || "",
      tiktokUrl: apiShopData?.tiktok || "",
      whatsapp: apiShopData?.whatsapp || "",
      phone: apiShopData?.phone || "",
      email: apiShopData?.email || "",
    };

    // If we have API data, use it (it's more up-to-date)
    if (apiShopData) {
      // Extract gallery images from API response
      let galleryImages: string[] = [];

      if (Array.isArray(apiGalleryData)) {
        galleryImages = apiGalleryData.map(
          (g: any) => g.image || DEFAULT_COVER_IMAGE,
        );
      }

      // Ensure we have at least 2 gallery images
      while (galleryImages.length < 2) {
        galleryImages.push(DEFAULT_COVER_IMAGE);
      }

      return {
        shopName: apiShopData.name || baseData.shopName,
        location: apiShopData.location || baseData.location,
        aboutUs: apiShopData.about_us || baseData.aboutUs,
        avatarUrl: apiShopData.logo || baseData.avatarUrl,
        coverUrl: apiShopData.cover_image || baseData.coverUrl,
        gallery: galleryImages,
        facebookUrl: apiShopData.facebook || baseData.facebookUrl,
        instagramUrl: apiShopData.instagram || baseData.instagramUrl,
        tiktokUrl: apiShopData.tiktok || baseData.tiktokUrl,
        whatsapp: apiShopData.whatsapp || baseData.whatsapp,
        phone: apiShopData.phone || baseData.phone,
        email: apiShopData.email || baseData.email,
      };
    }

    return baseData;
  }, [apiShopData, apiGalleryData, userData]);

  const shopData = getShopData();

  // Update user data in local storage
  const updateUserDataInStorage = useCallback((updatedShopData: any) => {
    try {
      const currentUserData = getUserData();
      if (currentUserData) {
        const updatedUserData = {
          ...currentUserData,
          active_shop: {
            ...currentUserData.active_shop,
            ...updatedShopData,
          },
        };
        setUserData(updatedUserData);
        console.log("User data updated in storage:", updatedUserData);
      }
    } catch (error) {
      console.error("Failed to update user data in storage:", error);
    }
  }, []);

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
    apiKey?: string,
    multiline = false,
  ) => {
    const val = shopData[key];
    setEditingField({
      title,
      key,
      apiKey: apiKey || key,
      value: typeof val === "string" ? val : "",
      multiline,
    });
    setIsEditModalOpen(true);
  };

  // 📷 Pick & Upload Logo (Profile/Avatar)
  const handlePickLogo = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show({
          label: "Permission Required",
          description: "Please allow access to media library.",
          variant: "danger",
          placement: "top",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        const selectedUri = result.assets[0].uri;
        const filename = selectedUri.split("/").pop() || "logo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const formData = new FormData();
        formData.append("logo", {
          uri: selectedUri,
          name: filename,
          type,
        } as any);

        const res = await updateShopApi({
          id: shopId,
          data: formData,
        }).unwrap();

        if (res.success) {
          // Update userData in storage with new logo
          updateUserDataInStorage({ logo: res.data?.logo || selectedUri });

          toast.show({
            label: "Success",
            description: res?.details || "Shop logo updated successfully.",
            variant: "success",
            placement: "top",
          });
          refetchDetails();
        }
      }
    } catch (error: any) {
      console.error("Logo upload error:", error);
      toast.show({
        label: "Upload Failed",
        description:
          error?.data?.details || error?.message || "Failed to update logo.",
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 🖼️ Pick & Upload Cover Image
  const handlePickCover = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show({
          label: "Permission Required",
          description: "Please allow access to media library.",
          variant: "danger",
          placement: "top",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        const selectedUri = result.assets[0].uri;
        const filename = selectedUri.split("/").pop() || "cover.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const formData = new FormData();
        formData.append("cover_image", {
          uri: selectedUri,
          name: filename,
          type,
        } as any);

        const res = await updateShopApi({
          id: shopId,
          data: formData,
        }).unwrap();

        if (res.success) {
          const coverImageUrl = res.data?.cover_image || selectedUri;
          updateUserDataInStorage({ cover_image: coverImageUrl });

          toast.show({
            label: "Success",
            description: res?.details || "Cover image updated successfully.",
            variant: "success",
            placement: "top",
          });
          refetchDetails();
        }
      }
    } catch (error: any) {
      console.error("Cover upload error:", error);
      toast.show({
        label: "Upload Failed",
        description:
          error?.data?.details ||
          error?.message ||
          "Failed to update cover image.",
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 🏞️ Upload Gallery Image
  const handleUploadGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show({
          label: "Permission Required",
          description: "Please allow access to media library.",
          variant: "danger",
          placement: "top",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploadingImage(true);
        const selectedUri = result.assets[0].uri;
        const filename = selectedUri.split("/").pop() || "gallery.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const formData = new FormData();
        formData.append("image", {
          uri: selectedUri,
          name: filename,
          type,
        } as any);

        const res = await updateGalleryApi({
          id: shopId,
          data: formData,
        }).unwrap();

        if (res.success) {
          toast.show({
            label: "Success",
            description: res?.details || "Gallery image uploaded successfully.",
            variant: "success",
            placement: "top",
          });
          refetchGallery();
          refetchDetails();
        }
      }
    } catch (error: any) {
      console.error("Gallery upload error:", error);
      toast.show({
        label: "Upload Failed",
        description:
          error?.data?.details ||
          error?.message ||
          "Failed to upload gallery image.",
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // PATCH /v1/shops/:id/
  const handleSaveField = async () => {
    if (!editingField) return;

    const apiKey = editingField.apiKey || editingField.key;
    const payload = {
      [apiKey]: editingField.value,
    };

    try {
      const res = await updateShopApi({
        id: shopId,
        data: payload,
      }).unwrap();

      if (res.success) {
        const updatedData: any = {};
        if (apiKey === "name") updatedData.name = editingField.value;
        else if (apiKey === "location")
          updatedData.location = editingField.value;
        else if (apiKey === "about_us")
          updatedData.about_us = editingField.value;
        else if (apiKey === "facebook")
          updatedData.facebook = editingField.value;
        else if (apiKey === "instagram")
          updatedData.instagram = editingField.value;
        else if (apiKey === "tiktok") updatedData.tiktok = editingField.value;
        else if (apiKey === "whatsapp")
          updatedData.whatsapp = editingField.value;
        else if (apiKey === "phone") updatedData.phone = editingField.value;
        else if (apiKey === "email") updatedData.email = editingField.value;

        updateUserDataInStorage(updatedData);

        toast.show({
          label: "Shop Updated!",
          description:
            res?.details || `${editingField.title} updated successfully.`,
          variant: "success",
          placement: "top",
        });

        refetchDetails();
        refetchGallery();
      }
    } catch (error: any) {
      console.error("Field update error:", error);
      toast.show({
        label: "Update Failed",
        description:
          error?.data?.details || error?.message || "Failed to update field.",
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsEditModalOpen(false);
      setEditingField(null);
    }
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
      {isShopLoading ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator color="#000" size="large" />
          <Text className="font-medium text-sm text-gray-500 mt-3">
            Loading shop details...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image Section */}
          <View className="mb-6 pt-1">
            <Text className="font-bold text-base text-gray-900 mb-2">
              Cover Image
            </Text>
            <View className="h-44 w-full rounded-2xl overflow-hidden bg-gray-200 relative">
              <Image
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                source={{ uri: shopData.coverUrl }}
              />
              <Pressable
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white items-center justify-center shadow-md active:scale-95 z-10"
                disabled={isUploadingImage}
                onPress={handlePickCover}
              >
                {isUploadingImage ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <StyledIcons
                    className="text-gray-900"
                    name="camera-outline"
                    size={16}
                  />
                )}
              </Pressable>
            </View>
            <Text className="mt-1 text-gray-400 text-xs">
              Tap the camera icon to change cover image
            </Text>
          </View>

          {/* Logo (Profile Avatar) Section */}
          <View className="mb-6">
            <Text className="font-bold text-base text-gray-900 mb-2">
              Shop Logo
            </Text>
            <View className="self-center relative">
              <Image
                style={{
                  width: 96, // 24 * 4 = 96
                  height: 96, // 24 * 4 = 96
                  borderRadius: 48, // Half of width/height for full circle
                  borderWidth: 4,
                  borderColor: "#ffffff",
                  backgroundColor: "#e5e7eb", // gray-200
                }}
                contentFit="cover"
                source={{ uri: shopData.avatarUrl }}
              />
              <Pressable
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white items-center justify-center shadow-md active:scale-95 border border-gray-100 z-10"
                disabled={isUploadingImage}
                onPress={handlePickLogo}
              >
                {isUploadingImage ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <StyledIcons
                    className="text-gray-900"
                    name="camera-outline"
                    size={14}
                  />
                )}
              </Pressable>
            </View>
            <Text className="mt-1 text-center text-gray-400 text-xs">
              Tap the camera icon to change logo
            </Text>
          </View>

          {/* Section 1: Shop Name */}
          <View className="mb-5">
            <Text className="font-bold text-base text-gray-900 mb-2">
              Shop name
            </Text>
            <Pressable
              className="rounded-2xl bg-[#F8F9FA] p-4 flex-row items-center justify-between active:bg-gray-100"
              onPress={() => openEditor("Shop name", "shopName", "name")}
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
              onPress={() => openEditor("Location", "location", "location")}
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
              onPress={() =>
                openEditor("About us", "aboutUs", "about_us", true)
              }
            >
              <Text className="font-medium text-sm text-gray-500 flex-1 mr-3 leading-5">
                {shopData.aboutUs || "No description provided"}
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
                <Text className="font-medium text-xs text-gray-900">
                  Upload
                </Text>
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
                    style={{ width: "100%", height: "100%" }}
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
              onPress={() =>
                openEditor("Facebook URL", "facebookUrl", "facebook")
              }
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
                  {shopData.facebookUrl || "Not set"}
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
              onPress={() =>
                openEditor("Instagram URL", "instagramUrl", "instagram")
              }
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
                  {shopData.instagramUrl || "Not set"}
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
              onPress={() => openEditor("TikTok URL", "tiktokUrl", "tiktok")}
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
                  {shopData.tiktokUrl || "Not set"}
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
              onPress={() =>
                openEditor("WhatsApp Number", "whatsapp", "whatsapp")
              }
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
                  {shopData.whatsapp || "Not set"}
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
              onPress={() => openEditor("Phone Number", "phone", "phone")}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <StyledIcons className="text-[#3B82F6]" name="call" size={20} />
                <View className="h-4 w-[1px] bg-gray-300 mx-3" />
                <Text
                  className="font-medium text-xs text-gray-700 flex-1"
                  numberOfLines={1}
                >
                  {shopData.phone || "Not set"}
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
              onPress={() => openEditor("Email Address", "email", "email")}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <StyledIcons className="text-[#3B82F6]" name="mail" size={20} />
                <View className="h-4 w-[1px] bg-gray-300 mx-3" />
                <Text
                  className="font-medium text-xs text-gray-700 flex-1"
                  numberOfLines={1}
                >
                  {shopData.email || "Not set"}
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
      )}

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
                {isUpdatingShop ? (
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
