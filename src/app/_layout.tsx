import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { useFonts } from "@expo-google-fonts/poppins/useFonts";
import { SplashScreen, Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Uniwind } from "uniwind";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import "@/global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

import { Provider } from "react-redux";
import { store } from "@/Redux/store";

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient());
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AppThemeProvider>
            <HeroUINativeProvider
              config={{
                devInfo: { stylingPrinciples: false },
                toast: {
                  defaultProps: {
                    placement: "top",
                  },
                },
              }}
            >
              <QueryClientProvider client={queryClient}>
                <StackLayout />
              </QueryClientProvider>
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </Provider>
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
