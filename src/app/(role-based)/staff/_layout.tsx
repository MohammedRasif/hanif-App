import { TabBarIcon, defaultTabScreenOptions } from "@/components/shared";
import { Tabs } from "expo-router";
import React from "react";

const StaffLayout = () => {
  return (
    <Tabs screenOptions={defaultTabScreenOptions}>
      {/* Staff Home Dashboard Tab */}
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

      {/* Staff Calendar Schedule Tab */}
      <Tabs.Screen
        name="calender"
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
    </Tabs>
  );
};

export default StaffLayout;
