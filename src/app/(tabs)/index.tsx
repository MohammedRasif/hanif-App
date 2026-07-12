import { Ionicons } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import { InputGroup, TextField } from "heroui-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    {
      name: "Barber",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Nails",
      img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Skin care",
      img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Massage",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Makeup",
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const spatialOffers = [
    {
      id: "1",
      title: "Welcome, Maïa",
      subtitle: "Let's find your next treatment",
      rating: "4.9",
      reviews: "364 reviews",
      img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      title: "Chic Boutique",
      subtitle: "Top rated haircut styling services",
      rating: "4.8",
      reviews: "182 reviews",
      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
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
            onPress={() => router.push("/(tabs)/notification")}
          >
            <StyledIonicons
              className="text-default-600"
              name="notifications"
              size={20}
            />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="mb-6">
          <TextField>
            <InputGroup className="h-12 flex-row items-center rounded-full border-transparent bg-[#F8F9FA] px-4">
              <InputGroup.Prefix className="mr-2">
                <StyledIonicons
                  className="text-default-400"
                  name="search"
                  size={20}
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                className="h-full flex-1 bg-transparent text-foreground text-sm placeholder-default-400"
                placeholder="Search salons or services..."
              />
            </InputGroup>
          </TextField>
        </View>

        {/* Promo Banner Card */}
        <View className="relative mb-6 h-44 overflow-hidden rounded-3xl bg-default-800">
          <Image
            className="absolute inset-0 h-full w-full opacity-60"
            source={{
              uri: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
            }}
          />
          {/* Text and Button content */}
          <View className="flex-1 justify-between p-5">
            <View>
              <Text className="font-semibold text-white/80 text-xs uppercase tracking-wider">
                Get Special Discount
              </Text>
              <Text className="mt-1 font-bold text-2xl text-white">
                Up to 30%
              </Text>
            </View>
            <Pressable
              className="self-start rounded-full bg-[#F0B100] px-6 py-2.5 active:opacity-90"
              onPress={() => router.push("/salon/1" as Href)}
            >
              <Text className="font-bold text-white text-xs">Book Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-foreground text-lg">
            Categories
          </Text>
          <ScrollView
            contentContainerStyle={{ gap: 16 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((cat) => (
              <View className="items-center" key={cat.name}>
                <View className="mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-[#F0B100] bg-white p-0.5">
                  <Image
                    className="h-full w-full rounded-full"
                    source={{ uri: cat.img }}
                  />
                </View>
                <Text className="font-semibold text-foreground text-xs">
                  {cat.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Spatial Offers Section */}
        <View>
          <Text className="mb-4 font-bold text-foreground text-lg">
            Spatial offers
          </Text>
          <ScrollView
            contentContainerStyle={{ gap: 16 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {spatialOffers.map((offer) => (
              <Link asChild href={`/salon/${offer.id}` as Href} key={offer.id}>
                <Pressable className="w-64 overflow-hidden rounded-3xl border border-default-100 bg-white pb-4 active:opacity-95">
                  {/* Image cover with rating overlay */}
                  <View className="relative h-40 bg-default-100">
                    <Image
                      className="h-full w-full"
                      source={{ uri: offer.img }}
                    />
                    <View className="absolute top-3 right-3 flex-row items-center gap-1.5 rounded-xl bg-black/60 px-2 py-1">
                      <Text className="font-bold text-[#F0B100] text-xs">
                        {offer.rating}
                      </Text>
                      <Text className="font-medium text-[10px] text-white/90">
                        {offer.reviews}
                      </Text>
                    </View>
                  </View>
                  {/* Info */}
                  <View className="px-4 pt-3">
                    <Text className="font-bold text-base text-foreground">
                      {offer.title}
                    </Text>
                    <Text
                      className="mt-1 text-default-400 text-xs"
                      numberOfLines={2}
                    >
                      {offer.subtitle}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>
      </View>
    </Container>
  );
}
