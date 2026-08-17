import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Link, Stack, useRouter } from "expo-router";
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
import { AuthHeader } from "@/feature/auth-header";
import { SocialAuth } from "@/feature/social-auth";
import { StyledIcons } from "@/lib";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { toast } = useToast();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (_data: LoginSchemaType) => {
    setIsLoading(true);

    try {
      // TODO: API integration
      // Example:
      // const res = await loginMutation.mutateAsync({
      //   email: _data.email,
      //   password: _data.password,
      // });
      // setAuth({ access: res.access, refresh: res.refresh }, res.user);

      toast.show({
        label: "Welcome back!",
        description: "Logged in successfully.",
        variant: "success",
        placement: "top",
      });

      router.replace("/(role)/user" as Href);
    } catch {
      toast.show({
        label: "Login Failed",
        description: "Login failed. Please check your credentials.",
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

      <View className="flex-1 justify-center bg-[#FFFFFF] px-6">
        <AuthHeader
          desc="Sign in to continue your beauty journey"
          title="Welcome Back!"
        />

        {/* Email Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Enter Email
          </Text>
          <TextField isInvalid={!!errors.email}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
                  <InputGroup.Prefix
                    className="absolute top-0 bottom-0 left-0 items-center justify-center pr-2 pl-4"
                    isDecorative
                  >
                    <StyledIcons
                      className="text-muted"
                      name="mail-outline"
                      size={20}
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    autoCapitalize="none"
                    className="h-full w-full border-transparent bg-transparent text-foreground"
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
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
                  <InputGroup.Prefix
                    className="absolute top-0 bottom-0 left-0 items-center justify-center pr-2 pl-4"
                    isDecorative
                  >
                    <StyledIcons
                      className="text-muted"
                      name="lock-closed-outline"
                      size={20}
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent text-foreground"
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

        {/* Remember Me + Forgot Password */}
        <View className="mb-8 flex-row items-center justify-between">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { value, onChange } }) => (
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
                    <StyledIcons
                      className="text-primary-foreground"
                      name="checkmark"
                      size={12}
                    />
                  )}
                </View>
                <Text className="text-foreground text-sm">Remember Me</Text>
              </Pressable>
            )}
          />

          <Link asChild href={"/auth/forgot-password" as Href}>
            <Pressable>
              <Text className="font-semibold text-foreground text-sm underline">
                Forgot Password?
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Login Button */}
        <Button
          className="mb-6 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            {isLoading ? "Logging in..." : "Log in"}
          </Button.Label>
        </Button>

        {/* Or divider */}
        <View className="mb-5 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-default-200" />
          <Text className="text-muted text-sm">Or</Text>
          <View className="h-px flex-1 bg-default-200" />
        </View>

        <SocialAuth />

        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-default-500 text-sm">
            Don't have an account?
          </Text>
          <Link asChild href={"/auth/register" as Href}>
            <Pressable>
              <Text className="font-semibold text-primary text-sm">
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Container>
  );
}
