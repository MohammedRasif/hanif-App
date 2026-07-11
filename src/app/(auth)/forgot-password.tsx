import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { z } from "zod";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

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

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    console.log("Forgot password submit:", data);
    // Navigate to OTP code screen after submit
    router.push("/(auth)/otp-code");
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-[#FFFFFF] px-6 pt-14 pb-8">
        <View>
          {/* Back button */}
          <Pressable className="mb-6 self-start" onPress={() => router.back()}>
            <StyledIonicons
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
          <View className="mb-6">
            <Text className="mb-2 font-semibold text-foreground text-sm">
              Enter Email
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
        </View>

        {/* Next Button */}
        <Button
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Next
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
