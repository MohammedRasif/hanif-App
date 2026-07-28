import type { Ionicons } from "@expo/vector-icons";
import { Link, Stack, type Href } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";

interface MenuItem {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}
const personalItems: MenuItem[] = [
  {
    title: "Personal Information",
    href: "/profile/personal-info" as Href,
    icon: "person-outline",
  },
  {
    title: "Notification",
    href: "/(tabs)/notification" as Href,
    icon: "notifications-outline",
  },
  {
    title: "Location Services",
    href: "/profile/location-services" as Href,
    icon: "location-outline",
  },
  {
    title: "Change Password",
    href: "/profile/change-password" as Href,
    icon: "lock-closed-outline",
  },
  {
    title: "Refund",
    href: "/profile/refund" as Href,
    icon: "receipt-outline",
  },
];

const supportItems: MenuItem[] = [
  {
    title: "Help center",
    href: "/profile/help-center" as Href,
    icon: "help-circle-outline",
  },
  {
    title: "Contact us",
    href: "/profile/contact-us" as Href,
    icon: "call-outline",
  },
  {
    title: "Terms & Condition",
    href: "/profile/terms" as Href,
    icon: "document-text-outline",
  },
  {
    title: "Privacy policy",
    href: "/profile/privacy" as Href,
    icon: "shield-outline",
  },
];

export default function ProfileScreen() {
  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-14 pb-8">
        {/* Profile Card Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Image
              className="h-16 w-16 rounded-full"
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
              }}
            />
            <View>
              <Text className="font-bold text-2xl text-foreground">
                Eleanor Smith
              </Text>
              <Text className="mt-1 text-default-400 text-sm">
                eleanor.smith@email.com
              </Text>
            </View>
          </View>
          {/* Edit icon button */}
          <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-default-100 active:opacity-75">
            <StyledIcons
              className="text-default-700"
              name="create-outline"
              size={18}
            />
          </Pressable>
        </View>

        {/* Section: Personal */}
        <Text className="mb-3 font-bold text-[#2D2D2D] text-base">
          Personal
        </Text>
        <MenuSection items={personalItems} />

        {/* Section: Support */}
        <Text className="mt-6 mb-3 font-bold text-[#2D2D2D] text-base">
          Support
        </Text>
        <MenuSection items={supportItems} />
      </View>
    </Container>
  );
}

// Reusable Menu Section list component that receives the array
function MenuSection({ items }: { items: MenuItem[] }) {
  return (
    <View className="gap-1 rounded-3xl bg-[#F8F9FA] p-3">
      {items.map((item) => (
        <Link asChild href={item.href} key={item.title}>
          <Pressable>
            <View className="flex-row items-center gap-4 rounded-2xl px-2 py-3 active:bg-default-100">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <StyledIcons
                  className="text-default-600"
                  name={item.icon}
                  size={20}
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-[#2D2D2D] text-sm">
                  {item.title}
                </Text>
              </View>
              <StyledIcons
                className="text-default-400"
                name="chevron-forward"
                size={18}
              />
            </View>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}
