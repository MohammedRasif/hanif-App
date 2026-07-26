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
    href: "/(auth)/login" as const,
    icon: "log-in-outline" as const,
  },
  {
    title: "Register Screen",
    desc: "Create a new account",
    href: "/(auth)/register" as const,
    icon: "person-add-outline" as const,
  },
  {
    title: "Forgot Password",
    desc: "Request password reset",
    href: "/(auth)/forgot-password" as const,
    icon: "help-circle-outline" as const,
  },
  {
    title: "OTP Verification",
    desc: "Verify OTP code input",
    href: "/(auth)/otp-code" as const,
    icon: "key-outline" as const,
  },
  {
    title: "Change Password",
    desc: "Reset new password / PIN",
    href: "/(auth)/change-password" as const,
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

export const calendarScreens: Screen[] = [
  {
    title: "Calendar Kit View",
    desc: "Schedule view using @howljs/calendar-kit",
    href: "/calender/calendar-kit" as Href,
    icon: "calendar-outline" as const,
  },
  {
    title: "Big Calendar View",
    desc: "Schedule view using react-native-big-calendar",
    href: "/calender/big-calendar" as Href,
    icon: "calendar-number-outline" as const,
  },
  {
    title: "Week View",
    desc: "Schedule view using react-native-week-view",
    href: "/calender/week-view" as Href,
    icon: "today-outline" as const,
  },
  {
    title: "Custom Calendar View",
    desc: "Custom zero-dependency schedule timeline view",
    href: "/calender/custom-calendar" as Href,
    icon: "grid-outline" as const,
  },
];

export const mainScreens: Screen[] = [
  {
    title: "Home Screen",
    desc: "Home page",
    href: "/(tabs)" as Href,
    icon: "home-outline" as const,
  },
  {
    title: "Bookings Screen",
    desc: "Bookings page",
    href: "/(tabs)/bookings" as Href,
    icon: "calendar-outline" as const,
  },
  {
    title: "Profile Screen",
    desc: "Profile page",
    href: "/(tabs)/profile" as Href,
    icon: "person-outline" as const,
  },
];
