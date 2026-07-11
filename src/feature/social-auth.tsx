import { StyledIcons } from "@/lib/styled-icons";
import { Pressable, Text, View } from "react-native";

export const SocialAuth = () => {
  return (
    <View className="mb-8 flex-row justify-center gap-4">
      {/* Google */}
      <Pressable className="h-14 w-14 items-center justify-center rounded-2xl  bg-[#F0F0F0]">
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>G</Text>
      </Pressable>

      {/* Apple */}
      <Pressable className="h-14 w-14 items-center justify-center rounded-2xl  bg-[#F0F0F0]">
        <StyledIcons className="text-foreground" name="logo-apple" size={24} />
      </Pressable>
    </View>
  );
};
