import { StyledIcons } from "@/lib";
import { Menu } from "heroui-native";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  onOpenReservationDialog: () => void;
  onOpenTimeOffDialog: () => void;
};

export function StaffCalendarMenu({
  onOpenReservationDialog,
  onOpenTimeOffDialog,
}: Props) {
  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Menu>
        <Menu.Trigger asChild>
          <Pressable className="h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95">
            <StyledIcons className="text-white" name="add" size={28} />
          </Pressable>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Overlay />
          <Menu.Content
            align="end"
            className="w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
            placement="top"
            presentation="popover"
          >
            <Menu.Item
              className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-gray-100"
              onPress={onOpenReservationDialog}
            >
              <StyledIcons
                className="text-gray-700"
                name="calendar-outline"
                size={18}
              />
              <Menu.ItemTitle className="font-semibold text-gray-900 text-sm">
                Add new reservation
              </Menu.ItemTitle>
            </Menu.Item>

            <Menu.Item
              className="flex-row items-center gap-3 rounded-xl px-3 py-3 active:bg-gray-100"
              onPress={onOpenTimeOffDialog}
            >
              <StyledIcons
                className="text-gray-700"
                name="time-outline"
                size={18}
              />
              <Menu.ItemTitle className="font-semibold text-gray-900 text-sm">
                Add time off
              </Menu.ItemTitle>
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
    </View>
  );
}
