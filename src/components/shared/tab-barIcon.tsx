import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface TabBarIconProps {
  color: string;
  focused: boolean;
  focusedIconName: ComponentProps<typeof Ionicons>["name"];
  iconName: ComponentProps<typeof Ionicons>["name"];
}

export function TabBarIcon({
  focused,
  color,
  iconName,
  focusedIconName,
}: TabBarIconProps) {
  return (
    <View style={focused ? { transform: [{ scale: 1.1 }] } : undefined}>
      <StyledIcons
        color={color}
        name={focused ? focusedIconName : iconName}
        size={24}
      />
    </View>
  );
}

export function useDefaultTabScreenOptions() {
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding to ensure no overlap with Android 3-button navigation, gesture bars, or hardware buttons
  const bottomPadding =
    insets.bottom > 0 ? insets.bottom : Platform.OS === "android" ? 6 : 4;
  const tabHeight = 52 + bottomPadding;

  return {
    headerShown: false,
    tabBarActiveTintColor: "#F0B100",
    tabBarInactiveTintColor: "#525252",
    tabBarHideOnKeyboard: true,
    animation: "fade" as const,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600" as const,
      marginTop: 2,
    },
    tabBarStyle: {
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: "#F0F0F0",
      height: tabHeight,
      paddingBottom: bottomPadding,
      paddingTop: 6,
      elevation: 8,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
  };
}

export const defaultTabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: "#F0B100",
  tabBarInactiveTintColor: "#525252",
  tabBarHideOnKeyboard: true,
  animation: "fade" as const,
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 2,
  },
  tabBarStyle: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    height: 70,
    paddingBottom: 12,
    paddingTop: 8,
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
};
