import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { launchImageLibraryAsync } from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { z } from "zod";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";

const StyledImage = withUniwind(Image);

const contactUsSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
});

type ContactUsSchemaType = z.infer<typeof contactUsSchema>;

export default function ContactUsScreen() {
  const router = useRouter();

  // Attachments state
  const [attachments, setAttachments] = useState<string[]>([]);
  console.log("attachments", attachments);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsSchemaType>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      subject: "",
      description: "",
    },
    mode: "onChange",
  });

  const addAttachment = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((asset) => asset.uri);
      setAttachments((prev) => [...prev, ...newUris]);
    }
  };

  const removeAttachment = (uriToRemove: string) => {
    setAttachments((prev) => prev.filter((uri) => uri !== uriToRemove));
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(role)/user/profile");
    }
  };

  const onSubmit = (data: ContactUsSchemaType) => {
    console.log("Message sent with attachments:", data, attachments);
    handleBack();
  };

  return (
    <Container keyboardAvoiding>
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
              Contact Us
            </Text>
            <View className="w-6" />
          </View>

          {/* Form fields */}
          <View className="gap-4">
            {/* Subject Input */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Subject
              </Text>
              <TextField isInvalid={!!errors.subject}>
                <Controller
                  control={control}
                  name="subject"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputGroup className="h-14 justify-center rounded-2xl border border-default-200 bg-white px-4">
                      <InputGroup.Input
                        className="h-full w-full bg-transparent text-foreground"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="First words"
                        value={value}
                      />
                    </InputGroup>
                  )}
                />
                <FieldError>{errors.subject?.message}</FieldError>
              </TextField>
            </View>

            {/* Description Input */}
            <View>
              <Text className="mb-2 font-semibold text-foreground text-sm">
                Description
              </Text>
              <TextField isInvalid={!!errors.description}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputGroup className="h-32 justify-start rounded-2xl border border-default-200 bg-white p-4">
                      <InputGroup.Input
                        className="h-full w-full bg-transparent text-start text-foreground"
                        multiline
                        numberOfLines={6}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="First words"
                        style={{ textAlignVertical: "top" }}
                        value={value}
                      />
                    </InputGroup>
                  )}
                />
                <FieldError>{errors.description?.message}</FieldError>
              </TextField>
            </View>

            {/* Add attachment */}
            <Pressable
              className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl bg-[#F3F4F6] bg-default-100 py-3.5 active:opacity-75"
              onPress={addAttachment}
            >
              <StyledIcons
                className="text-foreground"
                name="attach-outline"
                size={18}
              />
              <Text className="font-semibold text-foreground text-sm">
                Add an attachment
              </Text>
            </Pressable>

            {/* Attachment preview list */}
            {attachments.length > 0 && (
              <View className="mt-4">
                <Text className="mb-3 font-semibold text-foreground text-sm">
                  Attachments ({attachments.length})
                </Text>
                <ScrollView
                  contentContainerStyle={{ gap: 12 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {attachments.map((uri) => (
                    <View
                      className="relative h-20 w-20 overflow-hidden rounded-2xl bg-default-100"
                      key={uri}
                    >
                      <StyledImage
                        className="h-full w-full"
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <Pressable
                        className="absolute top-1.5 right-1.5 h-6 w-6 items-center justify-center rounded-full bg-black/60 active:bg-black"
                        onPress={() => removeAttachment(uri)}
                      >
                        <StyledIcons
                          className="text-white"
                          name="close"
                          size={14}
                        />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Action Button */}
        <Button
          className="mt-8 h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
          onPress={handleSubmit(onSubmit)}
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
