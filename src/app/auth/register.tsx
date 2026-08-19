import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Link, Stack, useRouter } from "expo-router";
import { Button, useToast } from "heroui-native";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { AuthHeader, AuthInput, SocialAuth } from "@/components/auth";
import { Container } from "@/components/container";
import { getErrorMessage, StyledIcons } from "@/lib";
import { useRegisterMutation } from "@/Redux/feature/auth";

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
  const router = useRouter();
  const { toast } = useToast();
  const [registerApi, { isLoading }] = useRegisterMutation();

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

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        full_name: data.fullName,
        phone: data.phoneNumber,
      };

      console.log("[Submitting Register Form]:", payload);
      const res = await registerApi(payload).unwrap();
      console.log("[Register API Success Response]:", res);

      toast.show({
        label: "Account Created!",
        description:
          res?.details ||
          "Please enter the verification code sent to your email.",
        variant: "success",
        placement: "top",
      });

      router.push({
        pathname: "/auth/otp-code",
        params: { email: data.email, type: "register" },
      } as Href);
    } catch (error: any) {
      console.error("[Register API Error Response]:", error);
      const errorMessage = getErrorMessage(
        error,
        "Registration failed. Please try again.",
      );

      toast.show({
        label: "Registration Failed",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
    }
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
        <AuthInput
          control={control}
          errorMessage={errors.fullName?.message}
          label="Full Name"
          name="fullName"
          placeholder="Plant"
        />

        {/* Email Address Field */}
        <AuthInput
          autoCapitalize="none"
          control={control}
          errorMessage={errors.email?.message}
          keyboardType="email-address"
          label="Email Address"
          name="email"
          placeholder="Plant@gmail.com"
        />

        {/* Phone Number Field */}
        <AuthInput
          control={control}
          errorMessage={errors.phoneNumber?.message}
          keyboardType="phone-pad"
          label="Phone Number"
          name="phoneNumber"
          placeholder="0156614612"
        />

        {/* Password Field */}
        <AuthInput
          control={control}
          errorMessage={errors.password?.message}
          isPassword
          label="Password"
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
                      <StyledIcons
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
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            {isLoading ? "Creating Account..." : "Create Account"}
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
            Already have an account?
          </Text>
          <Link asChild href={"/auth/login" as Href}>
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
