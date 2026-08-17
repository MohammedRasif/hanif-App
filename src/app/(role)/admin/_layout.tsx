import { TabBarIcon, useDefaultTabScreenOptions } from "@/components/shared";
import { Tabs } from "expo-router";
import React from "react";

export function AdminLayout() {
  const screenOptions = useDefaultTabScreenOptions();

  return (
    <Tabs backBehavior="history" screenOptions={screenOptions}>
      {/* 1. Admin Home Dashboard Tab */}
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

      {/* 2. Admin Booking Tab */}
      <Tabs.Screen
        name="booking/index"
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

      {/* 3. Admin Client Tab */}
      <Tabs.Screen
        name="client/index"
        options={{
          title: "Client",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              focusedIconName="people"
              iconName="people-outline"
            />
          ),
        }}
      />

      {/* 4. Admin Profile Tab */}
      <Tabs.Screen
        name="profile/index"
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

      {/* Hidden Sub-Routes (Accessible via navigation, NOT visible on bottom tab bar) */}
      <Tabs.Screen
        name="client/group-client-select"
        options={{
          href: null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="client/group-client-message"
        options={{
          href: null,
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="client/group-client-message-send"
        options={{
          href: null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

export default AdminLayout;
