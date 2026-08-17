import { Lobster_400Regular, useFonts } from "@expo-google-fonts/lobster";
import { cn } from "heroui-native";
import { Text, View } from "react-native";

type Props = {
  title: string;
  desc: string;

  className?: string;
};

export const AuthHeader = ({ title, desc, className }: Props) => {
  const [fontsLoaded] = useFonts({ Lobster_400Regular });
  return (
    <View className={cn("mb-10 items-center", className)}>
      <Text
        className="mb-2 w-full text-center font-normal text-4xl text-foreground"
        style={fontsLoaded ? { fontFamily: "Lobster_400Regular" } : undefined}
      >
        {title}
      </Text>
      <Text className="text-center text-base text-muted">{desc}</Text>
    </View>
  );
};
