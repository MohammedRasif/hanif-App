import { TabBarIcon, defaultTabScreenOptions } from "@/components/shared";
import { Tabs } from "expo-router";
import React from "react";

export default function MainLayout() {
  return (
    <Tabs screenOptions={defaultTabScreenOptions}>
      {/* Home Tab Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="home"
              iconName="home-outline"
            />
          ),
        }}
      />

      {/* Bookings Tab Screen */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="calendar"
              iconName="calendar-outline"
            />
          ),
        }}
      />

      {/* Profile Tab Screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="person"
              iconName="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
