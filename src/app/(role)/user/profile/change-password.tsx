import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useChangePasswordMutation } from "@/Redux/feature/auth";
import { Stack, useRouter } from "expo-router";
import { Button, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [vis1, setVis1] = useState(false);
  const [vis2, setVis2] = useState(false);
  const [vis3, setVis3] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(role)/user/profile");
    }
  };

  const handleSaveChanges = async () => {
    if (!password || !newPassword || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Validation Error",
        "New password and Confirm password do not match.",
      );
      return;
    }

    try {
      const res = await changePassword({
        password,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      if (res.success || res.details || res.message) {
        Alert.alert(
          "Success",
          res.details || res.message || "Password changed successfully!",
        );
        handleBack();
      } else {
        Alert.alert("Success", "Password changed successfully!");
        handleBack();
      }
    } catch (err: any) {
      console.error("Change password error:", err);
      const errMsg =
        err?.data?.details ||
        err?.data?.message ||
        err?.data?.error ||
        "Failed to change password. Please check your current password.";
      Alert.alert("Error", errMsg);
    }
  };

  return (
    <Container>
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
              Change Password
            </Text>
            <View className="w-6" />
          </View>

          {/* Password Inputs */}
          <View className="gap-4">
            {/* Current Password Field */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Current Password
              </Text>
              <TextField>
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-default-200 bg-white">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-4 text-foreground"
                    onChangeText={setPassword}
                    placeholder="Enter current password"
                    secureTextEntry={!vis1}
                    value={password}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable onPress={() => setVis1(!vis1)}>
                      <StyledIcons
                        className="text-default-400"
                        name={vis1 ? "eye-off-outline" : "eye-outline"}
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              </TextField>
            </View>

            {/* New Password Field */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                New Password
              </Text>
              <TextField>
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-default-200 bg-white">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-4 text-foreground"
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry={!vis2}
                    value={newPassword}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable onPress={() => setVis2(!vis2)}>
                      <StyledIcons
                        className="text-default-400"
                        name={vis2 ? "eye-off-outline" : "eye-outline"}
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              </TextField>
            </View>

            {/* Confirm New Password Field */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Confirm New Password
              </Text>
              <TextField>
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-default-200 bg-white">
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-4 text-foreground"
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={!vis3}
                    value={confirmPassword}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable onPress={() => setVis3(!vis3)}>
                      <StyledIcons
                        className="text-default-400"
                        name={vis3 ? "eye-off-outline" : "eye-outline"}
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              </TextField>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            isDisabled={isLoading}
            onPress={handleSaveChanges}
            variant="primary"
          >
            {isLoading ? (
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
