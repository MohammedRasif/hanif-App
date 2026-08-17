import { TabBarIcon, useDefaultTabScreenOptions } from "@/components/shared";
import { Tabs } from "expo-router";
import React from "react";

const StaffLayout = () => {
  const screenOptions = useDefaultTabScreenOptions();

  return (
    <Tabs screenOptions={screenOptions}>
      {/* 1. Staff Home Dashboard Tab */}
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

      {/* 2. Staff Calendar Schedule Tab */}
      <Tabs.Screen
        name="calender/index"
        options={{
          title: "Schedule",
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

      {/* 3. Staff Client List Tab */}
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

      {/* 4. Staff Profile & Settings Tab */}
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
};

export default StaffLayout;
