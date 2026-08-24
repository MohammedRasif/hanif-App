import { StyledIcons } from "@/lib";
import Haptics from "expo-haptics";
import { Platform, Pressable, View } from "react-native";

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
        <View key="moon">
          <StyledIcons className="text-foreground" name="moon" size={20} />
        </View>
      ) : (
        <View key="sun">
          <StyledIcons className="text-foreground" name="sunny" size={20} />
        </View>
      )}
    </Pressable>
  );
}
