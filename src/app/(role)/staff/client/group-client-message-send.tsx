import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function GroupClientMessageSend() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-3 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <StyledIcons
            className="text-gray-800"
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Message
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Image with Camera Icon Badge */}
        <View className="relative mb-5 overflow-hidden rounded-2xl">
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
            }}
            style={{ width: "100%", height: 210 }}
          />
          <Pressable className="absolute top-3 right-3 h-8 w-8 items-center justify-center rounded-full bg-white/80 active:bg-white shadow-xs">
            <StyledIcons
              className="text-gray-700"
              name="camera-outline"
              size={16}
            />
          </Pressable>
        </View>

        {/* Email Title Row with Pencil Edit Icon */}
        <View className="mb-4 flex-row items-center justify-center relative">
          <Text className="font-medium text-sm text-gray-500 text-center">
            Emai titel
          </Text>
          <Pressable className="absolute right-0 p-1">
            <StyledIcons
              className="text-gray-800"
              name="pencil-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Email Content Section */}
        <View className="mb-4">
          <Text className="mb-1.5 font-bold text-base text-gray-900">
            Emai content
          </Text>
          <Text className="text-gray-500 text-xs leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Sed lobortis dictumst
            fermentum tempus arcu vel. Cursus sed augue arcu congue amet. Nunc
            interdum donec aenean volutpat augue mauris semper quis. Etiam et
            netus ullamcorper nisl massa potenti lacinia odio.
          </Text>
        </View>

        {/* Divider */}
        <View className="my-3 border-b border-gray-100" />

        {/* SMS Content Section */}
        <View className="mb-4">
          <Text className="mb-1.5 font-bold text-base text-gray-900">Sms</Text>
          <Text className="text-gray-500 text-xs leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Sed lobortis dictumst
            fermentum tempus arcu vel. Cursus sed augue arcu congue amet. Nunc
            interdum donec aenean volutpat augue mauris semper quis. Etiam et
            netus ullamcorper nisl massa potenti lacinia odio.
          </Text>
        </View>
      </ScrollView>

      {/* Pinned Bottom Action Button */}
      <View className="absolute bottom-6 left-6 right-6">
        <Button
          className="h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-main-primary focus:bg-main-primary/90"
          onPress={() => {
            console.log("Create message clicked");
            router.push("/(role)/staff/client/group-client-message");
          }}
        >
          <Text className="font-semibold text-base text-white">
            Create message to 233 clint
          </Text>
          <StyledIcons className="text-white" name="arrow-forward" size={20} />
        </Button>
      </View>
    </Container>
  );
}
