import { type ProfileMenuItem, SharedProfileScreen } from "@/components/shared";
import { getUserData } from "@/lib/storage";
import { useGetProfileQuery } from "@/Redux/feature/auth";
import { useGetShopDetailsQuery } from "@/Redux/feature/shop";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";

export default function AdminProfileScreen() {
  const router = useRouter();
  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 9;

  // 📡 GET /v1/shops/:id/
  const { data: shopResponse } = useGetShopDetailsQuery(shopId);

  // 📡 GET /v1/auth/profile/
  const { data: profileResponse } = useGetProfileQuery();

  const shopData = shopResponse?.data;
  const profileData = profileResponse?.data;

  const defaultCover =
    "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1751196563/b170870007dfa419295d949814474ab2_t_qm2pcq.jpg";
  const defaultLogo =
    "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";
  const defaultUserAvatar =
    "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

  const coverImageUrl = shopData?.cover_image || defaultCover;
  const avatarUrl = shopData?.logo || defaultLogo;
  const locationTitle = shopData?.name
    ? `${shopData.name}${shopData.location ? ` (${shopData.location})` : ""}`
    : "Bong Bang Saloon";

  const userName = profileData?.full_name || "James Carter";
  const userSubtitle =
    profileData?.email ||
    (profileData?.role ? `Role: ${profileData.role}` : "Shop Manager");
  const userAvatarUrl = profileData?.image || defaultUserAvatar;

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
      avatarUrl={avatarUrl}
      coverImageUrl={coverImageUrl}
      locationTitle={locationTitle}
      menuItems={ADMIN_MENU_ITEMS}
      onPressLocationDropdown={() => {
        console.log("Location dropdown clicked");
      }}
      onSignOut={() => router.replace("/auth/login")}
      userAvatarUrl={userAvatarUrl}
      userName={userName}
      userSubtitle={userSubtitle}
    />
  );
}
