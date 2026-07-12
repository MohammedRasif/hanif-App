import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Button, InputGroup, TextField } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function ContactUsScreen() {
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
              Contact Us
            </Text>
            <View className="w-6" />
          </View>

          {/* Form fields */}
          <View className="gap-4">
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Subject
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
                Description
              </Text>
              <TextField>
                <InputGroup className="h-32 justify-start rounded-2xl border border-default-200 bg-white p-4 text-foreground">
                  <InputGroup.Input
                    className="h-full w-full bg-transparent text-start text-foreground"
                    multiline
                    numberOfLines={6}
                    placeholder="First words"
                    style={{ textAlignVertical: "top" }}
                  />
                </InputGroup>
              </TextField>
            </View>

            {/* Add attachment */}
            <Pressable className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-default-100 py-3.5 active:opacity-75">
              <StyledIonicons
                className="text-foreground"
                name="attach-outline"
                size={18}
              />
              <Text className="font-semibold text-foreground text-sm">
                Add an attachment
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Action Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={() => router.back()}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            Send Message
          </Button.Label>
        </Button>
      </View>
    </Container>
  );
}
