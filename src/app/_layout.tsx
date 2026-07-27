import { AppThemeProvider } from "@/contexts/app-theme-context";
import "@/global.css";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Uniwind } from "uniwind";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider
            config={{ devInfo: { stylingPrinciples: false } }}
          >
            <StackLayout />
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function StackLayout() {
  useEffect(() => {
    Uniwind.setTheme("light");
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
        statusBarTranslucent: true,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
