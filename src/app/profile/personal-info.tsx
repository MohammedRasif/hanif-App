import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Button, InputGroup, TextField } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function PersonalInfoScreen() {
  const router = useRouter();

  return (
    <Container>
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

          {/* Form Fields placeholders */}
          <View className="gap-4">
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Name
              </Text>
              <TextField>
                <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4 text-foreground">
                  <InputGroup.Input
                    className="h-full w-full bg-transparent text-foreground"
                    placeholder="First words"
                  />
                </InputGroup>
              </TextField>
            </View>

            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Email Address
              </Text>
              <TextField>
                <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4 text-foreground">
                  <InputGroup.Input
                    className="h-full w-full bg-transparent text-foreground"
                    placeholder="First words"
                  />
                </InputGroup>
              </TextField>
            </View>

            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Phone Number
              </Text>
              <TextField>
                <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4 text-foreground">
                  <InputGroup.Input
                    className="h-full w-full bg-transparent text-foreground"
                    placeholder="First words"
                  />
                </InputGroup>
              </TextField>
            </View>

            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Address
              </Text>
              <TextField>
                <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4 text-foreground">
                  <InputGroup.Input
                    className="h-full w-full bg-transparent text-foreground"
                    placeholder="123 Beauty Street, Salon City, SC 12345"
                  />
                </InputGroup>
              </TextField>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            onPress={() => router.back()}
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
