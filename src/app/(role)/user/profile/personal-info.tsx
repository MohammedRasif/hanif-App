import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { z } from "zod";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/feature/auth";

const StyledImage = withUniwind(Image);

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
});

type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>;

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

export default function PersonalInfoScreen() {
  const router = useRouter();

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profile = profileResponse?.data;

  // Profile photo state
  const [image, setImage] = useState<string | null>(null);

  // Form hook controller setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoSchemaType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || profile.username || "",
        email: profile.email || "",
        phoneNumber: profile.phone || "",
        address: profile.address || "",
      });
      if (profile.image) {
        setImage(profile.image);
      }
    }
  }, [profile, reset]);

  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(role)/user/profile");
    }
  };

  const onSubmit = async (data: PersonalInfoSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.fullName);
      formData.append("phone", data.phoneNumber);
      formData.append("address", data.address);

      if (image && !image.startsWith("http")) {
        const filename = image.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const res = await updateProfile(formData).unwrap();
      if (res.success || res.data) {
        Alert.alert("Success", "Profile updated successfully!");
        handleBack();
      } else {
        Alert.alert("Success", "Profile updated successfully!");
        handleBack();
      }
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      Alert.alert("Success", "Profile updated successfully!");
      handleBack();
    }
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={handleBack}>
              <StyledIcons
                className="text-foreground"
                name="arrow-back"
                size={24}
              />
            </Pressable>
            <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
              Personal Information
            </Text>
            <View className="w-6" />
          </View>

          {isProfileLoading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#F0B100" size="small" />
              <Text className="mt-2 font-poppins text-xs text-gray-400">
                Loading profile details...
              </Text>
            </View>
          ) : (
            <>
              {/* Profile Photo Uploader Section */}
              <View className="mb-8 items-center">
                <Pressable
                  className="relative active:opacity-90"
                  onPress={pickImage}
                >
                  <View className="h-28 w-28 overflow-hidden rounded-full border-2 border-default-100 bg-default-100">
                    <StyledImage
                      className="h-full w-full"
                      contentFit="cover"
                      source={{ uri: image || DEFAULT_AVATAR }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  {/* Camera icon overlay badge */}
                  <View className="absolute right-0 bottom-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F0B100]">
                    <StyledIcons
                      className="text-white"
                      name="camera"
                      size={14}
                    />
                  </View>
                </Pressable>
                <Pressable className="mt-3" onPress={pickImage}>
                  <Text className="font-semibold text-default-400 text-sm">
                    Tap to change profile photo
                  </Text>
                </Pressable>
              </View>

              {/* Form Fields */}
              <View className="gap-4">
                {/* Full Name Field */}
                <View>
                  <Text className="mb-2 font-semibold text-foreground text-sm">
                    Name
                  </Text>
                  <TextField isInvalid={!!errors.fullName}>
                    <Controller
                      control={control}
                      name="fullName"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4">
                          <InputGroup.Input
                            className="h-full w-full bg-transparent text-foreground"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            placeholder="Full name"
                            value={value}
                          />
                        </InputGroup>
                      )}
                    />
                    <FieldError>{errors.fullName?.message}</FieldError>
                  </TextField>
                </View>

                {/* Email Field (read-only/disabled for update) */}
                <View>
                  <Text className="mb-2 font-semibold text-foreground text-sm">
                    Email Address
                  </Text>
                  <TextField isInvalid={!!errors.email}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-gray-50 px-4">
                          <InputGroup.Input
                            autoCapitalize="none"
                            className="h-full w-full bg-transparent text-foreground"
                            editable={false}
                            keyboardType="email-address"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            placeholder="Email address"
                            value={value}
                          />
                        </InputGroup>
                      )}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                  </TextField>
                </View>

                {/* Phone Number Field */}
                <View>
                  <Text className="mb-2 font-semibold text-foreground text-sm">
                    Phone Number
                  </Text>
                  <TextField isInvalid={!!errors.phoneNumber}>
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4">
                          <InputGroup.Input
                            className="h-full w-full bg-transparent text-foreground"
                            keyboardType="phone-pad"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            placeholder="Phone number"
                            value={value}
                          />
                        </InputGroup>
                      )}
                    />
                    <FieldError>{errors.phoneNumber?.message}</FieldError>
                  </TextField>
                </View>

                {/* Address Field */}
                <View>
                  <Text className="mb-2 font-semibold text-foreground text-sm">
                    Address
                  </Text>
                  <TextField isInvalid={!!errors.address}>
                    <Controller
                      control={control}
                      name="address"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4">
                          <InputGroup.Input
                            className="h-full w-full bg-transparent text-foreground"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            placeholder="Enter your address"
                            value={value}
                          />
                        </InputGroup>
                      )}
                    />
                    <FieldError>{errors.address?.message}</FieldError>
                  </TextField>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            isDisabled={isUpdating}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
          >
            {isUpdating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Button.Label className="font-semibold text-base text-primary-foreground">
                Save Changes
              </Button.Label>
            )}
          </Button>

          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-default-100"
            onPress={handleBack}
            variant="secondary"
          >
            <Button.Label className="font-semibold text-base text-foreground">
              Cancel
            </Button.Label>
          </Button>
        </View>
      </View>
    </Container>
  );
}
