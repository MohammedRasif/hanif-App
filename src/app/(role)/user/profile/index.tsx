import type { Ionicons } from "@expo/vector-icons";
import { Link, Stack, type Href } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import { useGetProfileQuery } from "@/Redux/feature/auth";

interface MenuItem {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}
const personalItems: MenuItem[] = [
  {
    title: "Personal Information",
    href: "/(role)/user/profile/personal-info" as Href,
    icon: "person-outline",
  },
  {
    title: "Notification",
    href: "/notification" as Href,
    icon: "notifications-outline",
  },
  {
    title: "Location Services",
    href: "/(role)/user/profile/location-services" as Href,
    icon: "location-outline",
  },
  {
    title: "Change Password",
    href: "/(role)/user/profile/change-password" as Href,
    icon: "lock-closed-outline",
  },
  {
    title: "Refund",
    href: "/(role)/user/profile/refund" as Href,
    icon: "receipt-outline",
  },
];

const supportItems: MenuItem[] = [
  {
    title: "Help center",
    href: "/(role)/user/profile/help-center" as Href,
    icon: "help-circle-outline",
  },
  {
    title: "Contact us",
    href: "/(role)/user/profile/contact-us" as Href,
    icon: "call-outline",
  },
  {
    title: "Terms & Condition",
    href: "/(role)/user/profile/terms" as Href,
    icon: "document-text-outline",
  },
  {
    title: "Privacy policy",
    href: "/(role)/user/profile/privacy" as Href,
    icon: "shield-outline",
  },
];

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

export default function ProfileScreen() {
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const profile = profileResponse?.data;

  const fullName = profile?.full_name || profile?.username || "User";
  const email = profile?.email || "";
  const avatarUri = profile?.image || DEFAULT_AVATAR;

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-6 pt-14 pb-8">
        {/* Profile Card Header */}
        <View className="mb-8 flex-row items-center justify-between">
          {isLoading ? (
            <View className="flex-row items-center gap-4 py-2">
              <ActivityIndicator color="#F0B100" size="small" />
              <Text className="font-poppins text-xs text-gray-400">
                Loading profile...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-4">
              <Image
                className="h-16 w-16 rounded-full"
                source={{
                  uri: avatarUri,
                }}
              />
              <View>
                <Text className="font-bold text-2xl text-foreground">
                  {fullName}
                </Text>
                {email ? (
                  <Text className="mt-1 text-default-400 text-sm">{email}</Text>
                ) : null}
              </View>
            </View>
          )}

          {/* Edit icon button */}
          <Link
            asChild
            href="/(role)/user/profile/personal-info"
            key="edit-icon"
          >
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-default-100 active:opacity-75">
              <StyledIcons
                className="text-default-700"
                name="create-outline"
                size={18}
              />
            </Pressable>
          </Link>
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
