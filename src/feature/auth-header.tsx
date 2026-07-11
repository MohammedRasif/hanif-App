import { Lobster_400Regular, useFonts } from "@expo-google-fonts/lobster";
import { Text, View } from "react-native";

type Props = {
  title: string;
  desc: string;
};

export const AuthHeader = ({ title, desc }: Props) => {
  const [fontsLoaded] = useFonts({ Lobster_400Regular });
  return (
    <View className="mb-10 items-center">
      <Text
        className="mb-2 text-center font-normal text-4xl text-foreground"
        style={fontsLoaded ? { fontFamily: "Lobster_400Regular" } : undefined}
      >
        {title}
      </Text>
      <Text className="text-center text-base text-muted">{desc}</Text>
    </View>
  );
};
