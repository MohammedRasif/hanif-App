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
        name="bookings/index"
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

      {/* Hidden Sub-Routes (Hidden from bottom tab bar) */}
      <Tabs.Screen
        name="profile/change-password"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/contact-us"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/help-center"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/location-services"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/personal-info"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/privacy"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/refund"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="profile/terms"
        options={{ href: null, tabBarItemStyle: { display: "none" } }}
      />
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
