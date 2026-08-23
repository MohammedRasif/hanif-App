import { SharedProfileScreen, type ProfileMenuItem } from "@/components/shared";
import { useGetProfileQuery } from "@/Redux/feature/auth";
import { useGetStaffMeShopQuery } from "@/Redux/feature/dashboard";
import { useRouter } from "expo-router";
import React from "react";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

export default function StaffProfileScreen() {
  const router = useRouter();

  // 1. Fetch user auth profile (GET /v1/auth/profile/)
  const { data: userProfileResponse } = useGetProfileQuery();
  const userProfile = userProfileResponse?.data;

  // 2. Fetch staff shop info (GET /api/v1/barbers/me/shop/)
  const { data: shopResponse } = useGetStaffMeShopQuery();
  const shopData = shopResponse?.data;

  // User Profile Mapping
  const userName = userProfile?.full_name || userProfile?.username || "Barber";
  const userSubtitle =
    userProfile?.email || userProfile?.role || "Barber Staff";
  const userAvatarUrl = userProfile?.image || DEFAULT_AVATAR;

  // Shop Info Mapping
  const coverImageUrl =
    shopData?.banner ||
    "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1751196563/b170870007dfa419295d949814474ab2_t_qm2pcq.jpg";
  const avatarUrl = shopData?.logo || DEFAULT_AVATAR;
  const locationTitle = shopData?.name || "Hampdenpark Barber";

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
      avatarUrl={avatarUrl}
      coverImageUrl={coverImageUrl}
      locationTitle={locationTitle}
      menuItems={STAFF_MENU_ITEMS}
      onSignOut={() => router.replace("/auth/login")}
      userAvatarUrl={userAvatarUrl}
      userName={userName}
      userSubtitle={userSubtitle}
    />
  );
}
