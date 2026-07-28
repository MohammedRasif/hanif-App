import { StyledIcons } from "@/lib";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function SalonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const services = [
    { name: "Hair Cut & Style", price: "$50", duration: "60 minutes" },
    { name: "Classic Facial", price: "$70", duration: "60 minutes" },
    { name: "Hair Color", price: "$120", duration: "2 hrs" },
    { name: "Facial Treatment", price: "$85", duration: "60 minutes" },
  ];

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between bg-white pb-8">
        <View>
          {/* Header image cover container */}
          <View className="h-64 justify-between bg-default-200 px-6 pt-14 pb-4">
            <View className="w-full flex-row items-center justify-between">
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full bg-white/80"
                onPress={() => router.back()}
              >
                <StyledIcons
                  className="text-foreground"
                  name="arrow-back"
                  size={20}
                />
              </Pressable>
              <View className="flex-row gap-3">
                <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/80">
                  <StyledIcons
                    className="text-foreground"
                    name="share-social-outline"
                    size={20}
                  />
                </Pressable>
                <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/80">
                  <StyledIcons
                    className="text-foreground"
                    name="heart-outline"
                    size={20}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Details */}
          <View className="px-6 pt-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-bold text-2xl text-foreground">
                Glam Beauty Salon
              </Text>
              <View className="flex-row items-center gap-1 rounded-lg bg-[#FFF9E6] px-2.5 py-1">
                <StyledIcons className="text-[#F0B100]" name="star" size={14} />
                <Text className="font-bold text-[#F0B100] text-xs">4.9</Text>
              </View>
            </View>
            <Text className="mb-6 text-default-400 text-sm">
              123 Beauty St, Downtown (ID: {id})
            </Text>

            {/* List of Services */}
            <Text className="mb-3 font-bold text-foreground text-sm">
              Services & Prices
            </Text>
            <View className="gap-3">
              {services.map((svc) => (
                <View
                  className="flex-row items-center justify-between rounded-2xl bg-[#F8F9FA] p-4"
                  key={svc.name}
                >
                  <View>
                    <Text className="font-semibold text-foreground text-sm">
                      {svc.name}
                    </Text>
                    <Text className="mt-1 text-default-400 text-xs">
                      {svc.duration}
                    </Text>
                  </View>
                  <Text className="font-bold text-[#F0B100] text-sm">
                    {svc.price}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="mt-8 px-6">
          <Button
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#F0B100]"
            onPress={() => router.push("/salon/book")}
            variant="primary"
          >
            <Button.Label className="font-semibold text-base text-primary-foreground">
              Book Appointment
            </Button.Label>
          </Button>
        </View>
      </View>
    </Container>
  );
}
