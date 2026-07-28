import { StyledIcons } from "@/lib";
import Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

import { useAppTheme } from "@/contexts/app-theme-context";

export function ThemeToggle() {
  const { toggleTheme, isLight } = useAppTheme();

  return (
    <Pressable
      className="px-2.5"
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggleTheme();
      }}
    >
      {isLight ? (
        <Animated.View entering={ZoomIn} exiting={FadeOut} key="moon">
          <StyledIcons className="text-foreground" name="moon" size={20} />
        </Animated.View>
      ) : (
        <Animated.View entering={ZoomIn} exiting={FadeOut} key="sun">
          <StyledIcons className="text-foreground" name="sunny" size={20} />
        </Animated.View>
      )}
    </Pressable>
  );
}
