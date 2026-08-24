import { SharedProfileScreen, type ProfileMenuItem } from "@/components/shared";
import { useRouter } from "expo-router";
import React from "react";

export default function AdminProfileScreen() {
  const router = useRouter();

  const ADMIN_MENU_ITEMS: ProfileMenuItem[] = [
    {
      id: "personal-setting",
      label: "Personal setting",
      iconName: "settings-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/personal-setting");
      },
    },
    {
      id: "service-setup",
      label: "Service setup",
      iconName: "cut-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/service-setup");
      },
    },
    {
      id: "schedule-management",
      label: "Schedule management",
      iconName: "calendar-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/schedule-management");
      },
    },
    {
      id: "reports",
      label: "Reports",
      iconName: "bar-chart-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/reports");
      },
    },
    {
      id: "staff-management",
      label: "Staff management",
      iconName: "bar-chart-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/staff-management");
      },
    },
    {
      id: "shop-settings",
      label: "Shop Settings",
      iconName: "settings-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/shop-settings");
      },
    },
    {
      id: "reviews",
      label: "Reviews",
      iconName: "notifications-outline",
      onPress: () => {
        router.push("/(role)/admin/profile/reviews");
      },
    },
  ];

  return (
    <SharedProfileScreen
      avatarUrl="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300"
      coverImageUrl="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"
      locationTitle="Jazz barber (Hampdenpark)"
      menuItems={ADMIN_MENU_ITEMS}
      onPressLocationDropdown={() => {
        console.log("Location dropdown clicked");
      }}
      onSignOut={() => router.replace("/auth/login")}
      userAvatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      userName="James Carter"
      userSubtitle="Shop Manager · Carter's BarberPro"
    />
  );
}
