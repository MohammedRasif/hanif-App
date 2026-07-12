import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Link, Stack } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { z } from "zod";

import { Container } from "@/components/container";
import { AuthHeader } from "@/feature/auth-header";
import { SocialAuth } from "@/feature/social-auth";

const StyledIonicons = withUniwind(Ionicons);

const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(6, "Phone number must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agree: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: RegisterSchemaType) => {
    console.log("Registration successful:", data);
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center bg-[#FFFFFF] px-6 py-8">
        <AuthHeader
          className="mt-10"
          desc="Join us and Start your beauty journey today"
          title="Create Account!"
        />

        {/* Full Name Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Full Name
          </Text>
          <TextField isInvalid={!!errors.fullName}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white dark:border-default-200 dark:bg-content1">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent px-4 text-foreground"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Plant@gmail.com"
                    value={value}
                  />
                </InputGroup>
              )}
            />
            <FieldError>{errors.fullName?.message}</FieldError>
          </TextField>
        </View>

        {/* Email Address Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Email Address
          </Text>
          <TextField isInvalid={!!errors.email}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white dark:border-default-200 dark:bg-content1">
                  <InputGroup.Input
                    autoCapitalize="none"
                    className="h-full w-full border-transparent bg-transparent px-4 text-foreground"
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Plant@gmail.com"
                    value={value}
                  />
                </InputGroup>
              )}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </TextField>
        </View>

        {/* Phone Number Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Phone Number
          </Text>
          <TextField isInvalid={!!errors.phoneNumber}>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white dark:border-default-200 dark:bg-content1">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent px-4 text-foreground"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="0156614612"
                    value={value}
                  />
                </InputGroup>
              )}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </TextField>
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Password
          </Text>
          <TextField isInvalid={!!errors.password}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white dark:border-default-200 dark:bg-content1">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-4 text-foreground"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="••••••••"
                    secureTextEntry={!isPasswordVisible}
                    value={value}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable
                      hitSlop={12}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <StyledIonicons
                        className="text-muted"
                        name={
                          isPasswordVisible ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              )}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </TextField>
        </View>

        {/* Confirm Password Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Confirm Password
          </Text>
          <TextField isInvalid={!!errors.confirmPassword}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white dark:border-default-200 dark:bg-content1">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-4 text-foreground"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="••••••••"
                    secureTextEntry={!isConfirmPasswordVisible}
                    value={value}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable
                      hitSlop={12}
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                    >
                      <StyledIonicons
                        className="text-muted"
                        name={
                          isConfirmPasswordVisible
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              )}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </TextField>
        </View>

        {/* Terms and Conditions Checkbox */}
        <View className="mb-8 flex-row items-center justify-between">
          <Controller
            control={control}
            name="agree"
            render={({ field: { value, onChange } }) => (
              <View className="w-full">
                <Pressable
                  className="flex-row items-center gap-2"
                  onPress={() => onChange(!value)}
                >
                  <View
                    className={`h-5 w-5 items-center justify-center rounded border ${
                      value
                        ? "border-primary bg-primary"
                        : "border-[#E5E5E5] bg-background"
                    }`}
                  >
                    {value && (
                      <StyledIonicons
                        className="text-primary-foreground"
                        name="checkmark"
                        size={12}
                      />
                    )}
                  </View>
                  <Text className="flex-row flex-wrap text-foreground text-sm">
                    I agree to the{" "}
                    <Text className="font-bold underline">
                      Terms & Conditions & Privacy Policy.
                    </Text>
                  </Text>
                </Pressable>
                {errors.agree && (
                  <Text className="mt-1 text-danger text-xs">
                    {errors.agree.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Create Account Button */}
        <Button
          className="mb-6 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Create Account
          </Button.Label>
        </Button>

        {/* Or divider */}
        <View className="mb-5 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-default-200" />
          <Text className="text-muted text-sm">Or</Text>
          <View className="h-px flex-1 bg-default-200" />
        </View>

        <SocialAuth />

        {/* Sign In Link */}
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-default-500 text-sm">
            Alerdy have an account?
          </Text>
          <Link asChild href={"/(auth)/login" as Href}>
            <Pressable>
              <Text className="font-semibold text-primary text-sm">
                Sign In
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Container>
  );
}
