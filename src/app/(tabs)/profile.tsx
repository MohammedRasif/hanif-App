import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";

const StyledIonicons = withUniwind(Ionicons);

export default function ProfileScreen() {
  const menuItems = [
    {
      title: "Personal Information",
      href: "/profile/personal-info" as const,
      icon: "person-outline" as const,
    },
    {
      title: "Location Services",
      href: "/profile/location-services" as const,
      icon: "location-outline" as const,
    },
    {
      title: "Change Password",
      href: "/profile/change-password" as const,
      icon: "lock-closed-outline" as const,
    },
    {
      title: "Contact Us",
      href: "/profile/contact-us" as const,
      icon: "chatbubble-outline" as const,
    },
  ];

  return (
    <Container>
      <Stack.Screen options={{ title: "Profile" }} />

      <View className="flex-1 bg-white px-6 pt-14 pb-8">
        {/* Profile Card Header */}
        <View className="mb-8 flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-default-200">
            <StyledIonicons
              className="text-default-500"
              name="person"
              size={32}
            />
          </View>
          <View>
            <Text className="font-bold text-foreground text-xl">
              Eleanor Smith
            </Text>
            <Text className="mt-0.5 text-default-500 text-sm">
              eleanor.smith@email.com
            </Text>
          </View>
        </View>

        {/* Menu list */}
        <Text className="mb-3 font-bold text-default-400 text-xs uppercase tracking-wider">
          Personal
        </Text>
        <View className="gap-2.5">
          {menuItems.map((item) => (
            <Link asChild href={item.href} key={item.title}>
              <Pressable className="flex-row items-center gap-4 rounded-2xl bg-[#F8F9FA] p-4 active:opacity-75">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <StyledIonicons
                    className="text-primary"
                    name={item.icon}
                    size={20}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">
                    {item.title}
                  </Text>
                </View>
                <StyledIonicons
                  className="text-default-300"
                  name="chevron-forward"
                  size={16}
                />
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </Container>
  );
}
