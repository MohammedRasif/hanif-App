import { StyledIcons } from "@/lib";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  onOpenReservationDialog: () => void;
  // onOpenTimeOffDialog?: () => void;
};

export function BookingCalendarMenu({ onOpenReservationDialog }: Props) {
  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Pressable
        className="h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95"
        onPress={onOpenReservationDialog}
      >
        <StyledIcons className="text-white" name="add" size={28} />
      </Pressable>
    </View>
  );
}

// Alias for backwards compatibility
export const StaffCalendarMenu = BookingCalendarMenu;
