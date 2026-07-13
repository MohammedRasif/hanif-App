import { StyledIcons } from "@/lib";
import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F0B100", // Active tab label & icon color (mockup yellow)
        tabBarInactiveTintColor: "#A3A3A3", // Inactive tab label & icon color
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F5F5F5",
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      {/* Home Tab Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <StyledIcons
              color={color}
              name={focused ? "home" : "home-outline"}
              size={24}
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
            <StyledIcons
              color={color}
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
            />
          ),
        }}
      />

      {/* Notifications Tab Screen */}
      {/* <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color, focused }) => (
            <StyledIcons
              color={color}
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
            />
          ),
        }}
      /> */}

      {/* Profile Tab Screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <StyledIcons
              color={color}
              name={focused ? "person" : "person-outline"}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
