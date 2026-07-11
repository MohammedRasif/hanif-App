import { Container } from "@/components/container";
import { notificationData } from "@/data/notification.data";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

const typeStyles = {
  confirmed: {
    icon: "calendar-outline" as const,
    bg: "bg-[#E8F3FF]",
    color: "text-[#007AFF]",
  },
  reminder: {
    icon: "logo-usd" as const,
    bg: "bg-[#FFF4E0]",
    color: "text-[#F0B100]",
  },
  cancelled: {
    icon: "document-text-outline" as const,
    bg: "bg-[#F0E6FF]",
    color: "text-[#7F00FF]",
  },
  updated: {
    icon: "star" as const,
    bg: "bg-[#FFEBEB]",
    color: "text-[#FF2D55]",
  },
  feedback: {
    icon: "star" as const,
    bg: "bg-[#FFEBEB]",
    color: "text-[#FF2D55]",
  },
};

export default function NotificationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const filteredNotifications = notificationData.filter((item) => {
    if (activeTab === "unread") {
      return item.isUnread;
    }
    return true;
  });

  return (
    <Container isScrollable={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-[#FFFFFF] px-6 pt-14">
        {/* Header Row */}
        <View className="relative mb-6 flex-row items-center justify-between">
          <Pressable className="py-2 pr-4" onPress={() => router.back()}>
            <StyledIonicons
              className="text-foreground"
              name="arrow-back"
              size={24}
            />
          </Pressable>
          <Text className="absolute right-0 left-0 -z-10 text-center font-bold text-foreground text-xl">
            Notification
          </Text>
          <View className="w-6" />
        </View>

        {/* Filter Pills */}
        <View className="mb-6 flex-row gap-2.5">
          <Pressable
            className={`rounded-full px-5 py-2 ${
              activeTab === "all" ? "bg-[#FFF9E6]" : "bg-[#F5F5F5]"
            }`}
            onPress={() => setActiveTab("all")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "all" ? "text-[#F0B100]" : "text-foreground"
              }`}
            >
              All
            </Text>
          </Pressable>
          <Pressable
            className={`rounded-full px-5 py-2 ${
              activeTab === "unread" ? "bg-[#FFF9E6]" : "bg-[#F5F5F5]"
            }`}
            onPress={() => setActiveTab("unread")}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === "unread" ? "text-[#F0B100]" : "text-foreground"
              }`}
            >
              Unread
            </Text>
          </Pressable>
        </View>

        {/* Notifications List */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-default-400 text-sm">
                No notifications found
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const styles = typeStyles[item.type];
            return (
              <View className="mb-5">
                <View className="flex-row items-center gap-4 rounded-2xl bg-[#F8F9FA] p-4 dark:bg-content1">
                  {/* Icon Circle */}
                  <View
                    className={`h-12 w-12 items-center justify-center rounded-full ${styles.bg}`}
                  >
                    <StyledIonicons
                      className={styles.color}
                      name={styles.icon}
                      size={22}
                    />
                  </View>
                  {/* Content */}
                  <View className="flex-1">
                    <Text className="font-semibold text-base text-foreground">
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-default-500 text-sm leading-normal">
                      {item.message}
                    </Text>
                  </View>
                </View>
                {/* Time Indicator */}
                <Text className="mt-1.5 ml-4 text-default-400 text-xs">
                  • {item.time}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Container>
  );
}
