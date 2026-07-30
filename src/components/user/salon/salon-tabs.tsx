import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export interface TabItem {
  id: string;
  label: string;
}

export interface SalonTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  tabs: TabItem[];
}

export const SalonTabs = ({ tabs, activeTab, onTabChange }: SalonTabsProps) => {
  return (
    <View className="border-b border-gray-100/80">
      <ScrollView
        contentContainerStyle={{ gap: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              className="relative pb-2.5 items-center"
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
            >
              <Text
                className={
                  isActive
                    ? "font-poppins-bold text-base text-gray-900"
                    : "font-poppins-semibold text-base text-gray-400"
                }
              >
                {tab.label}
              </Text>

              {/* Active Underline Indicator */}
              {isActive ? (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gray-900" />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SalonTabs;
