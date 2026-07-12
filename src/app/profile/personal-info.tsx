import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { z } from "zod";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);
const StyledImage = withUniwind(Image);

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(6, "Phone number must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
});

type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoScreen() {
  const router = useRouter();

  // Profile photo state
  const [image, setImage] = useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  );

  // Form hook controller setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoSchemaType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "Eleanor Smith",
      email: "eleanor.smith@email.com",
      phoneNumber: "123456789",
      address: "123 Beauty Street, Salon City, SC 12345",
    },
    mode: "onChange",
  });

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

  const onSubmit = (data: PersonalInfoSchemaType) => {
    console.log("Personal info updated successfully:", data, image);
    router.back();
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white px-6 pt-14 pb-8">
        <View>
          {/* Header row */}
          <View className="relative mb-8 flex-row items-center justify-between">
            <Pressable className="py-2 pr-4" onPress={() => router.back()}>
              <StyledIonicons
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
                  source={{ uri: image ?? "" }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              {/* Camera icon overlay badge */}
              <View className="absolute right-0 bottom-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F0B100]">
                <StyledIonicons
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

          {/* Form Fields with validations */}
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
                        placeholder="First words"
                        value={value}
                      />
                    </InputGroup>
                  )}
                />
                <FieldError>{errors.fullName?.message}</FieldError>
              </TextField>
            </View>

            {/* Email Field */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Email Address
              </Text>
              <TextField isInvalid={!!errors.email}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4">
                      <InputGroup.Input
                        autoCapitalize="none"
                        className="h-full w-full bg-transparent text-foreground"
                        keyboardType="email-address"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="First words"
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
                        placeholder="First words"
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
                        placeholder="123 Beauty Street, Salon City, SC 12345"
                        value={value}
                      />
                    </InputGroup>
                  )}
                />
                <FieldError>{errors.address?.message}</FieldError>
              </TextField>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
          >
            <Button.Label className="font-semibold text-base text-primary-foreground">
              Save Changes
            </Button.Label>
          </Button>

          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-default-100"
            onPress={() => router.back()}
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
