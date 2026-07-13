import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface TabBarIconProps {
  color: string;
  focused: boolean;
  focusedIconName: ComponentProps<typeof Ionicons>["name"];
  iconName: ComponentProps<typeof Ionicons>["name"];
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F0B100", // Active tab label & icon color (mockup yellow)
        tabBarInactiveTintColor: "#A3A3A3", // Inactive tab label & icon color
        animation: "fade", // Enable smooth fade transition animation between screens
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F5F5F5",
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      {/* Home Tab Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="home"
              iconName="home-outline"
            />
          ),
        }}
      />

      {/* Bookings Tab Screen */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="calendar"
              iconName="calendar-outline"
            />
          ),
        }}
      />

      {/* Profile Tab Screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="person"
              iconName="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({
  focused,
  color,
  iconName,
  focusedIconName,
}: TabBarIconProps) {
  const scale = useSharedValue(focused ? 1.15 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.7);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.15 : 1, { duration: 180 });
    opacity.value = withTiming(focused ? 1 : 0.7, { duration: 180 });
  }, [focused, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <StyledIcons
        color={color}
        name={focused ? focusedIconName : iconName}
        size={24}
      />
    </Animated.View>
  );
}
