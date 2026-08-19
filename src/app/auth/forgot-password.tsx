import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Stack, useRouter } from "expo-router";
import { Button, useToast } from "heroui-native";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { AuthInput } from "@/components/auth";
import { Container } from "@/components/container";
import { getErrorMessage, StyledIcons } from "@/lib";
import { useForgotPasswordMutation } from "@/Redux/feature/auth";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      const payload = {
        email: data.email,
      };

      console.log("[Submitting Forgot Password Form]:", payload);
      const res = await forgotPasswordApi(payload).unwrap();
      console.log("[Forgot Password API Success Response]:", res);

      toast.show({
        label: "OTP Code Sent",
        description:
          res?.details || "Please check your email for the reset code.",
        variant: "success",
        placement: "top",
      });

      router.push({
        pathname: "/auth/otp-code",
        params: { email: data.email, type: "forgot-password" },
      } as Href);
    } catch (error: any) {
      console.error("[Forgot Password API Error Response]:", error);
      const errorMessage = getErrorMessage(
        error,
        "Failed to send reset code. Please check your email address.",
      );

      toast.show({
        label: "Error Sending Code",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
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

          {/* Title and description */}
          <View className="mb-8">
            <Text className="font-bold text-3xl text-foreground">
              Forgot Password
            </Text>
            <Text className="mt-2 text-base text-muted">
              Enter the email of your account and we will send the email to
              reset your password.
            </Text>
          </View>

          {/* Email input field */}
          <AuthInput
            autoCapitalize="none"
            containerClassName="mb-6"
            control={control}
            errorMessage={errors.email?.message}
            keyboardType="email-address"
            label="Enter Email"
            name="email"
            placeholder="Plant@gmail.com"
          />
        </View>

        {/* Next Button */}
        <Button
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          isDisabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            {isLoading ? "Sending Code..." : "Next"}
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
