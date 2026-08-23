import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export interface Screen {
  desc: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export const authScreens: Screen[] = [
  {
    title: "Login Screen",
    desc: "Sign in to continue your journey",
    href: "/auth/login" as Href,
    icon: "log-in-outline" as const,
  },
  {
    title: "Register Screen",
    desc: "Create a new account",
    href: "/auth/register" as Href,
    icon: "person-add-outline" as const,
  },
  {
    title: "Forgot Password",
    desc: "Request password reset",
    href: "/auth/forgot-password" as Href,
    icon: "help-circle-outline" as const,
  },
  {
    title: "OTP Verification",
    desc: "Verify OTP code input",
    href: "/auth/otp-code" as Href,
    icon: "key-outline" as const,
  },
  {
    title: "Change Password",
    desc: "Reset new password / PIN",
    href: "/auth/change-password" as Href,
    icon: "lock-closed-outline" as const,
  },
];

export const otherScreens: Screen[] = [
  {
    title: "Splash Screen",
    desc: "First splash / welcome page",
    href: "/splash" as const,
    icon: "flash-outline" as const,
  },
  {
    title: "Notification Screen",
    desc: "View notifications list",
    href: "/notification" as Href,
    icon: "notifications-outline" as const,
  },
];

export const mainScreens: Screen[] = [
  {
    title: "User Screen",
    desc: "All User related  page",
    href: "/(role)/user" as Href,
    icon: "man-outline" as const,
  },
  {
    title: "Barber / Staff Screen",
    desc: "All Barber & Staff related page",
    href: "/(role)/staff" as Href,
    icon: "home-outline" as const,
  },
  {
    title: "Admin Screen",
    desc: "All Admin related page",
    href: "/(role)/admin" as Href,
    icon: "shield-checkmark-outline" as const,
  },
];

// export const mainScreens: Screen[] = [
//   {
//     title: "Home Screen",
//     desc: "Home page",
//     href: "/(tabs)" as Href,
//     icon: "home-outline" as const,
//   },
//   {
//     title: "Staff Dashboard",
//     desc: "Staff schedule and metrics dashboard",
//     href: "/(role-based)/staff" as Href,
//     icon: "people-outline" as const,
//   },
//   {
//     title: "Bookings Screen",
//     desc: "Bookings page",
//     href: "/(tabs)/bookings" as Href,
//     icon: "calendar-outline" as const,
//   },
//   {
//     title: "Profile Screen",
//     desc: "Profile page",
//     href: "/(tabs)/profile" as Href,
//     icon: "person-outline" as const,
//   },
// ];
