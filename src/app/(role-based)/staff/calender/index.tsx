import { Container } from "@/components/container";
import CustomCalendar from "@/lib/calender";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export default function CalenderIndex() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <CustomCalendar
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      >
        {/* Custom Fixed / Non-Scrollable Floating Action Overlay (Passed as Children) */}
        <View className="absolute bottom-6 right-6 items-end z-50">
          {/* Speed Dial Menu Items */}
          {isMenuOpen && (
            <View className="items-end mb-3 gap-2.5">
              <Pressable
                className="bg-black px-4 py-2.5 rounded-2xl shadow-md active:opacity-80"
                onPress={() => {
                  console.log("Add new reservation pressed");
                  setIsMenuOpen(false);
                }}
              >
                <Text className="font-semibold text-sm text-white">
                  Add new reservation
                </Text>
              </Pressable>

              <Pressable
                className="bg-black px-4 py-2.5 rounded-2xl shadow-md active:opacity-80"
                onPress={() => {
                  console.log("Add time off pressed");
                  setIsMenuOpen(false);
                }}
              >
                <Text className="font-semibold text-sm text-white">
                  Add time off
                </Text>
              </Pressable>
            </View>
          )}

          {/* Plus Action FAB Button */}
          <Pressable
            className={`h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95 ${
              isMenuOpen ? "rotate-45" : ""
            }`}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          >
            <StyledIonicons className="text-white" name="add" size={28} />
          </Pressable>
        </View>
      </CustomCalendar>
    </Container>
  );
}
