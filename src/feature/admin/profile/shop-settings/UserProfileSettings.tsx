// src/components/profile/ProfileUpdateForm.tsx
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/feature/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useToast } from "heroui-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { z } from "zod";
import { getUserData, setUserData } from "@/lib/storage"; // Import storage functions

// Schema for profile update
const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number")
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address is too long")
    .optional()
    .or(z.literal("")),
  image: z.any().optional(),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

type ProfileUpdateFormProps = {
  onBack?: () => void;
};

export function ProfileUpdateForm({ onBack }: ProfileUpdateFormProps) {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Get stored user data from MMKV
  const storedUserData = getUserData();
  console.log("Stored user data:", storedUserData);

  // Get profile data from API
  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const profile = profileResponse?.data;

  // Update profile mutation
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    trigger,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: profile?.full_name || storedUserData?.full_name || "",
      phone: profile?.phone || storedUserData?.phone || "",
      address: profile?.address || storedUserData?.address || "",
      image: undefined,
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        image: undefined,
      });
      if (profile.image) {
        setImageUri(profile.image);
      }
      setIsImageChanged(false);
    }
  }, [profile, reset]);

  // Cancel edit mode - reset form to original values
  const handleCancelEdit = () => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        image: undefined,
      });
      if (profile.image) {
        setImageUri(profile.image);
      } else {
        setImageUri(null);
      }
      setImageFile(null);
      setIsImageChanged(false);
    }
    setIsEditMode(false);
  };

  // Pick image from gallery
  const pickImage = async () => {
    if (!isEditMode) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      toast.show({
        label: "Permission Denied",
        description:
          "We need access to your photos to update your profile image.",
        variant: "danger",
        placement: "top",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);

      // Create a file object for FormData
      let file: any;

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const fileName = asset.uri.split("/").pop() || "profile-image.jpg";
        file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
      } else {
        file = {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.uri.split("/").pop() || "profile-image.jpg",
        };
      }

      setImageFile(file);
      setIsImageChanged(true);

      setValue("image", file, {
        shouldDirty: true,
        shouldValidate: true,
      });

      await trigger("image");
    }
  };

  // Update local storage with new user data
  const updateLocalUserData = (updatedData: any) => {
    try {
      // Get current stored user data
      const currentUserData = getUserData();

      // Merge with updated data
      const newUserData = {
        ...currentUserData,
        ...updatedData,
      };

      // Save back to storage
      setUserData(newUserData);

      console.log("Local storage updated with:", newUserData);
    } catch (error) {
      console.error("Failed to update local user data:", error);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      const formData = new FormData();

      // Add text fields
      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.address) formData.append("address", data.address);

      // Add image if selected
      if (imageFile) {
        if (Platform.OS === "web") {
          formData.append("image", imageFile);
        } else {
          formData.append("image", {
            uri: imageFile.uri,
            type: imageFile.type,
            name: imageFile.name,
          } as any);
        }
      }

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        // Update local storage with the new data
        if (response.data) {
          updateLocalUserData({
            full_name: response.data.full_name,
            phone: response.data.phone,
            address: response.data.address,
            image: response.data.image,
          });
        }

        toast.show({
          label: "Profile Updated",
          description: "Your profile has been updated successfully.",
          variant: "success",
          placement: "top",
        });

        // Refetch profile data from API
        await refetchProfile();

        // Reset form with new data
        if (response.data) {
          reset({
            full_name: response.data.full_name || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
            image: undefined,
          });
          if (response.data.image) {
            setImageUri(response.data.image);
          } else {
            setImageUri(null);
          }
        }
        setImageFile(null);
        setIsImageChanged(false);
        setIsEditMode(false);
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage =
        error?.data?.details ||
        error?.message ||
        "Failed to update profile. Please try again.";
      toast.show({
        label: "Update Failed",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
    }
  };

  // Check if form has any changes (including image)
  const hasChanges = isDirty || isImageChanged;

  if (isLoadingProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#FF9500" size="large" />
        <Text className="mt-4 text-gray-500 text-sm">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with Back Button and Title */}
      <View className="flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack || (() => router.back())}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>
        <Text className="font-bold text-xl text-gray-900">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        // className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6">
          {/* Profile Image Section */}
          <View className="items-center mb-8">
            <TouchableOpacity
              className="relative"
              onPress={pickImage}
              activeOpacity={isEditMode ? 0.8 : 1}
              disabled={!isEditMode}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 3,
                    borderColor: isEditMode ? "#FF9500" : "#E5E7EB",
                    opacity: isEditMode ? 1 : 0.8,
                  }}
                  contentFit="cover"
                />
              ) : (
                <View
                  className={`w-30 h-30 rounded-full bg-gray-200 items-center justify-center border-3 ${isEditMode ? "border-[#FF9500]" : "border-gray-300"}`}
                >
                  <StyledIcons
                    className="text-gray-400"
                    name="person"
                    size={50}
                  />
                </View>
              )}
              {isEditMode && (
                <View className="absolute bottom-0 right-0 bg-[#FF9500] rounded-full p-2.5 border-2 border-white">
                  <StyledIcons className="text-white" name="camera" size={16} />
                </View>
              )}
            </TouchableOpacity>
            <Text className="mt-2 text-gray-500 text-xs">
              {isEditMode ? "Tap to change profile picture" : ""}
            </Text>
            {imageFile && isEditMode && (
              <Text className="mt-1 text-green-600 text-xs">
                New image selected
              </Text>
            )}
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Full Name */}
            <Controller
              control={control}
              name="full_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Full Name {!isEditMode && "•"}
                  </Text>
                  <View
                    className={`h-13 rounded-2xl border px-4 justify-center ${
                      isEditMode
                        ? errors.full_name
                          ? "border-red-500 bg-white"
                          : "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <TextInput
                      className={`text-sm ${isEditMode ? "text-gray-900" : "text-gray-500"}`}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      editable={isEditMode}
                    />
                  </View>
                  {errors.full_name && isEditMode && (
                    <Text className="mt-1 text-red-500 text-xs">
                      {errors.full_name.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Phone */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Phone Number {!isEditMode && "•"}
                  </Text>
                  <View
                    className={`h-13 rounded-2xl border px-4 justify-center ${
                      isEditMode
                        ? errors.phone
                          ? "border-red-500 bg-white"
                          : "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <TextInput
                      className={`text-sm ${isEditMode ? "text-gray-900" : "text-gray-500"}`}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      keyboardType="phone-pad"
                      editable={isEditMode}
                    />
                  </View>
                  {errors.phone && isEditMode && (
                    <Text className="mt-1 text-red-500 text-xs">
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Address {!isEditMode && "•"}
                  </Text>
                  <View
                    className={`h-13 rounded-2xl border px-4 justify-center ${
                      isEditMode
                        ? errors.address
                          ? "border-red-500 bg-white"
                          : "border-gray-200 bg-white"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <TextInput
                      className={`text-sm ${isEditMode ? "text-gray-900" : "text-gray-500"}`}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your address"
                      placeholderTextColor="#9CA3AF"
                      value={value}
                      editable={isEditMode}
                    />
                  </View>
                  {errors.address && isEditMode && (
                    <Text className="mt-1 text-red-500 text-xs">
                      {errors.address.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Text className="font-medium">Role: {profile?.role}</Text>
          </View>

          {/* Bottom Actions */}
          <View className="mt-8">
            {!isEditMode ? (
              <Pressable
                className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
                onPress={() => setIsEditMode(true)}
              >
                <Text className="font-bold text-base text-white">
                  Edit Profile
                </Text>
              </Pressable>
            ) : (
              <View className="flex-row gap-3">
                <Pressable
                  className="h-14 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
                  onPress={handleCancelEdit}
                  disabled={isUpdating}
                >
                  <Text className="font-semibold text-base text-gray-700">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  className={`h-14 flex-1 items-center justify-center rounded-2xl ${
                    isUpdating || !hasChanges
                      ? "bg-gray-300"
                      : "bg-[#FF9500] active:bg-[#e08300]"
                  }`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isUpdating || !hasChanges}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text className="font-bold text-base text-white">
                      Update
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
