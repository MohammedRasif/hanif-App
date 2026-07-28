import { StyledIcons } from "@/lib";
import { Button, Dialog, InputGroup } from "heroui-native";
import React, { useState } from "react";
import { Text, View } from "react-native";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { timeOffDuration: string; timeOffReason: string }) => void;
};

export function AddTimeOffDialog({ isOpen, onOpenChange, onSubmit }: Props) {
  const [timeOffReason, setTimeOffReason] = useState("");
  const [timeOffDuration, setTimeOffDuration] = useState("");

  const handleSave = () => {
    onSubmit({ timeOffReason, timeOffDuration });
    setTimeOffReason("");
    setTimeOffDuration("");
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-[90%] max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-gray-900 text-xl">
              Add Time Off
            </Dialog.Title>
            <Dialog.Close>
              <StyledIcons className="text-gray-500" name="close" size={20} />
            </Dialog.Close>
          </View>

          <Dialog.Description className="mb-4 text-gray-500 text-sm">
            Schedule personal time off or a break duration.
          </Dialog.Description>

          {/* Form Input Fields */}
          <View className="gap-4">
            <View>
              <Text className="mb-1.5 font-semibold text-gray-700 text-xs">
                Reason / Note
              </Text>
              <InputGroup className="h-12 w-full flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                <InputGroup.Input
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setTimeOffReason}
                  placeholder="e.g. Lunch Break"
                  value={timeOffReason}
                />
              </InputGroup>
            </View>

            <View>
              <Text className="mb-1.5 font-semibold text-gray-700 text-xs">
                Duration
              </Text>
              <InputGroup className="h-12 w-full flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                <InputGroup.Input
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setTimeOffDuration}
                  placeholder="e.g. 1 hour"
                  value={timeOffDuration}
                />
              </InputGroup>
            </View>
          </View>

          {/* Dialog Actions */}
          <View className="mt-6 flex-row items-center justify-end gap-3">
            <Dialog.Close>
              <Button onPress={() => onOpenChange(false)} variant="tertiary">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              className="rounded-xl bg-black px-5"
              onPress={handleSave}
              variant="primary"
            >
              Confirm Time Off
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
