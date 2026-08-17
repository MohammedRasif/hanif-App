import { TabBarIcon, useDefaultTabScreenOptions } from "@/components/shared";
import { Tabs } from "expo-router";
import React from "react";

export default function UserLayout() {
  const screenOptions = useDefaultTabScreenOptions();

  return (
    <Tabs screenOptions={screenOptions}>
      {/* 1. Home Tab Screen */}
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

      {/* 2. Booking Tab Screen */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Booking",
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

      {/* 3. Profile Tab Screen */}
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

      {/* Salon Sub-Routes (Hidden from bottom tab bar) */}
      <Tabs.Screen
        name="salon/[id]"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="salon/choose-a-proffetinal"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="salon/choose-a-service"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
    </Tabs>
  );
}
