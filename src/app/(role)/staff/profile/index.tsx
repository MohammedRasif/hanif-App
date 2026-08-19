import { SharedProfileScreen, type ProfileMenuItem } from "@/components/shared";
import { useRouter } from "expo-router";
import React from "react";

export default function StaffProfileScreen() {
  const router = useRouter();

  const STAFF_MENU_ITEMS: ProfileMenuItem[] = [
    {
      id: "service",
      label: "Service",
      iconName: "cut-outline",
      onPress: () => router.push("/(role)/staff/profile/service"),
    },
    {
      id: "working-hours",
      label: "Working Days & Hours",
      iconName: "calendar-outline",
      onPress: () => router.push("/(role)/staff/profile/working-hours"),
    },
    {
      id: "reports",
      label: "Reports",
      iconName: "bar-chart-outline",
      onPress: () => router.push("/(role)/staff/profile/reports"),
    },
    {
      id: "break-schedule",
      label: "Break Schedule",
      iconName: "settings-outline",
      onPress: () => router.push("/(role)/staff/profile/break-schedule"),
    },
    {
      id: "reviews",
      label: "Reviews",
      iconName: "notifications-outline",
      onPress: () => router.push("/(role)/staff/profile/reviews"),
    },
  ];

  return (
    <SharedProfileScreen
      avatarUrl="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300"
      coverImageUrl="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"
      locationTitle="Jazz barber (Hampdenpark)"
      menuItems={STAFF_MENU_ITEMS}
      onSignOut={() => router.replace("/auth/login")}
      userAvatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      userName="James Carter"
      userSubtitle="Barber"
    />
  );
}
