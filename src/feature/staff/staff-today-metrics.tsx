import React from "react";
import { Text, View } from "react-native";

export interface StaffMetric {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_METRICS: StaffMetric[] = [
  { id: "1", label: "Booking", value: "25" },
  { id: "2", label: "Completed", value: "25" },
  { id: "3", label: "Revenue", value: "$8788" },
];

export function StaffTodayMetrics({
  metrics = DEFAULT_METRICS,
}: {
  metrics?: StaffMetric[];
}) {
  return (
    <View className="px-6 mb-6">
      <Text className="font-bold text-xl text-[#525252] mb-3 tracking-tight">
        Today
      </Text>
      <View className="flex-row gap-3">
        {metrics.map((metric) => (
          <View
            className="flex-1 bg-[#FAFAFA]! p-4 rounded-2xl border border-gray-100/60"
            key={metric.id}
          >
            <Text className="text-gray-400 text-xs font-medium">
              {metric.label}
            </Text>
            <Text className="font-bold text-lg text-gray-900 mt-1">
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
