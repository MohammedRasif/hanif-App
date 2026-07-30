import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface Professional {
  availability: string;
  id: string;
  image?: string;
  isAnyone?: boolean;
  isAvailableToday: boolean;
  name: string;
}

const PROFESSIONALS: Professional[] = [
  {
    availability: "Available today",
    id: "anyone",
    isAnyone: true,
    isAvailableToday: true,
    name: "Anyone",
  },
  {
    availability: "Available on 18 july",
    id: "1",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: false,
    name: "Esther Howard",
  },
  {
    availability: "Available today",
    id: "2",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: true,
    name: "Esther Howard",
  },
  {
    availability: "Available today",
    id: "3",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: true,
    name: "Esther Howard",
  },
  {
    availability: "Available today",
    id: "4",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: true,
    name: "Esther Howard",
  },
  {
    availability: "Available today",
    id: "5",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    isAvailableToday: true,
    name: "Esther Howard",
  },
];

export default function ChooseAProphetical() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>("anyone");

  return (
    <Container isScrollable={true}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white relative pb-24">
        {/* Top Header */}
        <View className="flex-row items-center px-6 pt-6 pb-4">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
            onPress={() => router.back()}
          >
            <StyledIcons
              className="text-gray-900"
              name="chevron-back"
              size={22}
            />
          </Pressable>
          <Text className="flex-1 text-center pr-10 font-poppins-bold text-lg text-gray-900">
            Choose a proffetinal
          </Text>
        </View>

        {/* Professionals 2-Column Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4 px-6 pt-2">
          {PROFESSIONALS.map((pro) => {
            const isSelected = selectedId === pro.id;
            return (
              <Pressable
                className={`w-[48%] rounded-2xl border bg-white p-2.5 ${
                  isSelected
                    ? "border-2 border-[#FE9A00] shadow-xs"
                    : "border-gray-100"
                }`}
                key={pro.id}
                onPress={() => setSelectedId(pro.id)}
              >
                {pro.isAnyone ? (
                  <View className="h-32 w-full items-center justify-center rounded-xl bg-gray-50/50">
                    <StyledIcons
                      className="text-gray-900"
                      name="person-outline"
                      size={54}
                    />
                  </View>
                ) : (
                  <View className="h-32 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      contentFit="cover"
                      source={{ uri: pro.image }}
                      style={{ height: "100%", width: "100%" }}
                    />
                  </View>
                )}

                <Text className="mt-2.5 text-center font-poppins-medium text-xs text-gray-900">
                  {pro.name}
                </Text>

                <Text
                  className={`mt-1 text-center font-poppins text-[10px] ${
                    pro.isAvailableToday ? "text-[#00B049]" : "text-gray-400"
                  }`}
                >
                  • {pro.availability}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom Sticky Action Bar */}
      <View className="border-t border-gray-100 bg-white px-6 py-4 flex-row items-center justify-between shadow-lg">
        <View>
          <Text className="font-poppins text-xs text-gray-400">3hr</Text>
          <Text className="font-poppins-bold text-xl text-gray-900">
            $12000
          </Text>
        </View>

        <Pressable
          className="rounded-2xl bg-[#FE9A00] px-8 py-3.5 active:opacity-90"
          onPress={() => router.push("/(role)/user/salon/confirm" as any)}
        >
          <Text className="font-poppins-semibold text-sm text-white">
            Book Now
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
