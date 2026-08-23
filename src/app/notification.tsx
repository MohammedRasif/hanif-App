import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import {
  useGetNotificationsQuery,
  type NotificationItem,
} from "@/Redux/feature/auth";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const typeStyles: Record<string, { icon: any; bg: string; color: string }> = {
  booking: {
    icon: "calendar-outline",
    bg: "bg-[#E8F3FF]",
    color: "text-[#007AFF]",
  },
  confirmed: {
    icon: "calendar-outline",
    bg: "bg-[#E8F3FF]",
    color: "text-[#007AFF]",
  },
  reminder: {
    icon: "logo-usd",
    bg: "bg-[#FFF4E0]",
    color: "text-[#F0B100]",
  },
  cancelled: {
    icon: "document-text-outline",
    bg: "bg-[#F0E6FF]",
    color: "text-[#7F00FF]",
  },
  updated: {
    icon: "star",
    bg: "bg-[#FFEBEB]",
    color: "text-[#FF2D55]",
  },
  default: {
    icon: "notifications-outline",
    bg: "bg-[#E8F3FF]",
    color: "text-[#007AFF]",
  },
};

export default function NotificationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const { data: notificationsResponse, isLoading } = useGetNotificationsQuery();

  const notificationsList: NotificationItem[] =
    notificationsResponse?.data?.notifications || [];

  const filteredNotifications = notificationsList.filter((item) => {
    if (activeTab === "unread") {
      return !item.is_read;
    }
    return true;
  });

  const formatNotificationTime = (createdAtStr: string) => {
    if (!createdAtStr) return "Just now";
    try {
      const d = new Date(createdAtStr);
      if (Number.isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <Container isScrollable={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-[#FFFFFF] px-6 pt-14">
        {/* Header Row */}
        <View className="relative mb-6 flex-row items-center justify-between">
          <Pressable className="py-2 pr-4" onPress={() => router.back()}>
            <StyledIcons
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
                activeTab === "all" ? "text-brand" : "text-foreground"
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
                activeTab === "unread" ? "text-brand" : "text-foreground"
              }`}
            >
              Unread
            </Text>
          </Pressable>
        </View>

        {/* Notifications List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator color="#F0B100" size="small" />
            <Text className="mt-2 font-poppins text-xs text-gray-400">
              Loading notifications...
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 24 }}
            data={filteredNotifications}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-default-400 text-sm">
                  No notifications found
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const styles = typeStyles[item.type] ||
                typeStyles.default || {
                  icon: "notifications-outline" as const,
                  bg: "bg-[#E8F3FF]",
                  color: "text-[#007AFF]",
                };
              return (
                <View className="mb-5">
                  <View
                    className={`flex-row items-center gap-4 rounded-2xl p-4 ${
                      !item.is_read
                        ? "bg-[#FFFBF0] border border-[#FFE8A3]"
                        : "bg-[#F8F9FA]"
                    }`}
                  >
                    {/* Icon Circle */}
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${styles.bg}`}
                    >
                      <StyledIcons
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
                    • {formatNotificationTime(item.created_at)}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Container>
  );
}
