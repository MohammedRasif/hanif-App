import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  FieldError,
  InputGroup,
  TextField,
  useToast,
} from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
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
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-foreground text-sm">
              Enter new Password
            </Text>
            <TextField isInvalid={!!errors.password}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
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
                        <StyledIcons
                          className="text-muted"
                          name={
                            isPasswordVisible
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
                  <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
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
                        <StyledIcons
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
