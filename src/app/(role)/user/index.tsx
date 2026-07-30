import { Link, useRouter, type Href } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";

export default function HomeScreen() {
  const router = useRouter();

  const shopList = [
    {
      id: "1",
      location: "Los Angeles, CA  •  0.8 mi",
      rating: "4.9",
      reviews: "364 reviews",
      title: "Barbers Bay",
      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      location: "Los Angeles, CA  •  0.8 mi",
      rating: "4.9",
      reviews: "364 reviews",
      title: "Barbers Bay",
      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "3",
      location: "Los Angeles, CA  •  0.8 mi",
      rating: "4.9",
      reviews: "364 reviews",
      title: "Barbers Bay",
      img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <Container isScrollable={true}>
      <View className="flex-1 bg-white px-6 pt-14 pb-8">
        {/* Header Section */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              className="h-12 w-12 rounded-full"
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              }}
            />
            <View>
              <Text className="font-bold text-foreground text-lg">
                Welcome, Maïa
              </Text>
              <Text className="mt-0.5 text-default-400 text-xs">
                Let's find your next treatment
              </Text>
            </View>
          </View>
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-default-100 active:opacity-75"
            onPress={() => router.push("/notification")}
          >
            <StyledIcons
              className="text-default-600"
              name="notifications"
              size={20}
            />
          </Pressable>
        </View>

        {/* Choose Shop Vertical List */}
        <View>
          <Text className="mb-4 font-bold text-foreground text-xl tracking-tight">
            Choose shop
          </Text>
          <View className="gap-4">
            {shopList.map((shop) => (
              <Link
                asChild
                href={`/(role)/user/salon/${shop.id}` as Href}
                key={shop.id}
              >
                <Pressable className="w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-3.5 shadow-xs active:opacity-95">
                  {/* Image cover with rating overlay */}
                  <View className="relative h-44 w-full overflow-hidden rounded-2xl bg-default-100">
                    <Image
                      className="h-full w-full"
                      source={{ uri: shop.img }}
                    />
                    <View className="absolute top-3 right-3 flex-row items-center gap-1.5 rounded-xl bg-black/60 px-2.5 py-1">
                      <Text className="font-bold text-[#F0B100] text-xs">
                        {shop.rating}
                      </Text>
                      <Text className="font-medium text-[10px] text-white/90">
                        {shop.reviews}
                      </Text>
                    </View>
                  </View>
                  {/* Info */}
                  <View className="pt-3 px-1">
                    <Text className="font-bold text-base text-foreground">
                      {shop.title}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                      <StyledIcons
                        className="text-gray-400"
                        name="location-outline"
                        size={14}
                      />
                      <Text className="text-gray-500 text-xs font-normal">
                        {shop.location}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </View>
    </Container>
  );
}
