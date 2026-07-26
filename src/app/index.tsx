import logo from "@/assets/logo.png";
import { Container } from "@/components/container";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

import {
  authScreens,
  mainScreens,
  otherScreens,
  type Screen,
} from "../data/screen-lists";

const StyledIonicons = withUniwind(Ionicons);

export default function HomePage() {
  return (
    <Container className={`bg-white`}>
      <View className="items-center px-6 pt-8 pb-10">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-white">
          <Image className="h-full w-full rounded-full p-10" source={logo} />
        </View>
        <Text className="mb-3 text-center font-bold text-3xl text-black">
          Barbers Bay
        </Text>
        <Text className="text-center text-base text-default-500 leading-6">
          Your one-stop destination for all things grooming and style.
        </Text>
      </View>

      <ShowScreenItems screens={mainScreens} title="Main Screen" />
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
