import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export interface AdminMetric {
  iconColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
  id: string;
  label: string;
  value: string;
}

const DEFAULT_METRICS: AdminMetric[] = [
  {
    id: "1",
    label: "Today's Bookings",
    value: "25",
    iconName: "calendar-outline",
    iconColor: "#60a5fa",
  },
  {
    id: "2",
    label: "Completed",
    value: "2",
    iconName: "people-outline",
    iconColor: "#34d399",
  },
  {
    id: "3",
    label: "In service",
    value: "2",
    iconName: "time-outline",
    iconColor: "#fb923c",
  },
  {
    id: "4",
    label: "Revenue Today",
    value: "$250",
    iconName: "trending-up-outline",
    iconColor: "#f59e0b",
  },
];

export function AdminTodayMetrics({
  metrics = DEFAULT_METRICS,
}: {
  metrics?: AdminMetric[];
}) {
  return (
    <View className="px-6 my-2">
      <View className="gap-3">
        {/* Row 1: Today's Bookings & Completed */}
        <View className="flex-row gap-3">
          {metrics.slice(0, 2).map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        {/* Row 2: In service & Revenue Today */}
        <View className="flex-row gap-3">
          {metrics.slice(2, 4).map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>
      </View>
    </View>
  );
}

function MetricCard({ metric }: { metric: AdminMetric }) {
  return (
    <View className="flex-1 rounded-3xl border border-gray-100 bg-[#fbfbfc] p-4.5 shadow-xs">
      <View className="flex-row items-center gap-1.5">
        <StyledIcons
          color={metric.iconColor}
          name={metric.iconName}
          size={16}
        />
        <Text className="font-poppins-medium text-default-400 text-xs">
          {metric.label}
        </Text>
      </View>
      <Text className="mt-2 font-poppins-bold text-2xl text-foreground leading-tight">
        {metric.value}
      </Text>
    </View>
  );
}
