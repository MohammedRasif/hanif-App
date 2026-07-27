import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import { useEffect, type ComponentProps } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

export const defaultTabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: "#F0B100",
  tabBarInactiveTintColor: "#A3A3A3",
  animation: "fade" as const,
  tabBarStyle: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    height: 64,
    paddingBottom: 10,
    paddingTop: 8,
  },
};
