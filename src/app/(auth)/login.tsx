import { Lobster_400Regular, useFonts } from "@expo-google-fonts/lobster";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Button, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";
import { SocialAuth } from "@/feature/social-auth";

const StyledIonicons = withUniwind(Ionicons);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [fontsLoaded] = useFonts({ Lobster_400Regular });

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center px-6 bg-[#FFFFFF]">
        {/* Header */}
        <View className="mb-10 items-center">
          <Text
            style={
              fontsLoaded ? { fontFamily: "Lobster_400Regular" } : undefined
            }
            className="mb-2 text-center text-4xl text-foreground font-normal"
          >
            Welcome Back!
          </Text>
          <Text className="text-center text-base text-muted">
            Sign in to continue your beauty journey
          </Text>
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-foreground">
            Enter Email
          </Text>
          <TextField>
            <InputGroup className="relative w-full flex-row items-center bg-white dark:bg-content1 border border-default-300 dark:border-default-200 rounded-2xl h-14">
              <InputGroup.Prefix
                isDecorative
                className="absolute left-0 top-0 bottom-0 items-center justify-center pl-4 pr-2"
              >
                <StyledIonicons
                  name="mail-outline"
                  size={20}
                  className="text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={email}
                onChangeText={setEmail}
                placeholder="Plant@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-transparent border-transparent text-foreground h-full w-full"
              />
            </InputGroup>
          </TextField>
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-foreground">
            Password
          </Text>
          <TextField>
            <InputGroup className="relative w-full flex-row items-center bg-white dark:bg-content1 border border-default-300 dark:border-default-200 rounded-2xl h-14">
              <InputGroup.Prefix
                isDecorative
                className="absolute left-0 top-0 bottom-0 items-center justify-center pl-4 pr-2"
              >
                <StyledIonicons
                  name="lock-closed-outline"
                  size={20}
                  className="text-muted"
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!isPasswordVisible}
                className="bg-transparent border-transparent text-foreground h-full w-full"
              />
              <InputGroup.Suffix className="absolute right-0 top-0 bottom-0 items-center justify-center pr-4 pl-2">
                <Pressable
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  hitSlop={12}
                >
                  <StyledIonicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    className="text-muted"
                  />
                </Pressable>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>
        </View>

        {/* Remember Me + Forgot Password */}
        <View className="mb-8 flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`h-5 w-5 items-center justify-center rounded border ${
                rememberMe
                  ? "border-primary bg-primary"
                  : "border-default-300 bg-background"
              }`}
            >
              {rememberMe && (
                <StyledIonicons
                  name="checkmark"
                  size={12}
                  className="text-primary-foreground"
                />
              )}
            </View>
            <Text className="text-sm text-foreground">Remember Me</Text>
          </Pressable>

          <Pressable>
            <Text className="text-sm font-semibold text-foreground underline">
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Button
          variant="primary"
          className="mb-6 rounded-full h-14 w-full bg-primary justify-center items-center"
          onPress={() => console.log("Login clicked")}
        >
          <Button.Label className="text-base font-semibold text-primary-foreground">
            Log in
          </Button.Label>
        </Button>

        {/* Or divider */}
        <View className="mb-5 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-default-200" />
          <Text className="text-sm text-muted">Or</Text>
          <View className="h-px flex-1 bg-default-200" />
        </View>

        <SocialAuth />

        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-default-500">
            Don't have an account?
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-sm font-semibold text-primary">
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Container>
  );
}
