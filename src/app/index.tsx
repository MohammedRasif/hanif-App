import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppTheme } from "@/contexts/app-theme-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import { authScreens, otherScreens, type Screen } from "../data/screen-lists";

const StyledIonicons = withUniwind(Ionicons);

export default function HomePage() {
  const { currentTheme } = useAppTheme();

  return (
    <Container>
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
        <Text className="font-bold text-2xl text-foreground">Home</Text>
        <ThemeToggle />
        <Link asChild href="/(auth)/login">
          <Pressable>
            <Text className="font-semibold text-primary text-sm">Login</Text>
          </Pressable>
        </Link>
      </View>

      {/* Hero section */}
      <View className="items-center px-6 pt-8 pb-10">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-white">
          <StyledIonicons
            className="text-primary-foreground"
            name="rocket-outline"
            size={36}
          />
        </View>
        <Text className="mb-3 text-center font-bold text-3xl text-foreground">
          Expo Starter
        </Text>
        <Text className="text-center text-base text-default-500 leading-6">
          A solid foundation for building cross-platform apps with Expo, HeroUI
          Native, and Uniwind.
        </Text>
      </View>

      {/* Stats row */}
      <View className="mb-6 flex-row gap-3 px-6">
        {[
          { label: "Framework", value: "Expo 55" },
          { label: "Styling", value: "Uniwind" },
          { label: "Theme", value: currentTheme },
        ].map((item) => (
          <View
            className="flex-1 items-center rounded-2xl bg-content1 p-4"
            key={item.label}
          >
            <Text className="font-bold text-foreground text-lg capitalize">
              {item.value}
            </Text>
            <Text className="mt-1 text-default-400 text-xs">{item.label}</Text>
          </View>
        ))}
      </View>

      <ShowScreenItems screens={authScreens} title="Auth Screen" />
      <ShowScreenItems screens={otherScreens} title="Other Screen" />
    </Container>
  );
}

const ShowScreenItems = ({
  screens,
  title,
}: {
  title: string;
  screens: Screen[];
}) => (
  <View className="mb-6 px-6">
    <Text className="mb-3 font-semibold text-default-400 text-xs uppercase tracking-wider">
      {title}
    </Text>
    {screens.map((item) => (
      <Link asChild href={item.href} key={item.title}>
        <Pressable className="flex-row items-center gap-4 rounded-2xl bg-content1 p-4 active:opacity-75">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <StyledIonicons
              className="text-primary"
              name={item.icon}
              size={20}
            />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground text-sm">
              {item.title}
            </Text>
            <Text className="mt-0.5 text-default-400 text-xs">{item.desc}</Text>
          </View>
          <StyledIonicons
            className="text-default-300"
            name="chevron-forward"
            size={16}
          />
        </Pressable>
      </Link>
    ))}
  </View>
);
