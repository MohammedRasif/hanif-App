import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, useToast } from "heroui-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { AuthInput } from "@/components/shared";
import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";

const changePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { email: _email, otp: _otp } = useLocalSearchParams<{
    email?: string;
    otp?: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (_data: ChangePasswordSchemaType) => {
    setIsLoading(true);

    try {
      // TODO: API integration
      // Example:
      // await resetPasswordMutation.mutateAsync({
      //   email: email || "",
      //   otp: otp || "",
      //   new_password: _data.password,
      //   confirm_password: _data.confirmPassword,
      // });

      toast.show({
        label: "Password Reset Successful",
        description: "Your password has been reset. Please log in.",
        variant: "success",
        placement: "top",
      });

      router.replace("/auth/login" as Href);
    } catch {
      toast.show({
        label: "Reset Failed",
        description: "Password reset failed. Please try again.",
        variant: "danger",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-[#FFFFFF] px-6 pt-14 pb-8">
        <View>
          {/* Back button */}
          <Pressable className="mb-6 self-start" onPress={() => router.back()}>
            <StyledIcons
              className="text-foreground"
              name="arrow-back"
              size={24}
            />
          </Pressable>

          {/* Title */}
          <View className="mb-8">
            <Text className="font-bold text-3xl text-foreground">
              Change password
            </Text>
          </View>

          {/* New Password Field */}
          <AuthInput
            control={control}
            errorMessage={errors.password?.message}
            isPassword
            label="Enter new Password"
            name="password"
            placeholder="••••••••"
          />

          {/* Confirm Password Field */}
          <AuthInput
            control={control}
            errorMessage={errors.confirmPassword?.message}
            isPassword
            label="Confirm Password"
            name="confirmPassword"
            placeholder="••••••••"
          />
        </View>

        {/* Change Password Button */}
        <Button
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
