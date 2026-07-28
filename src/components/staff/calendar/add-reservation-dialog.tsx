import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, InputGroup } from "heroui-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { clientName: string; serviceName: string }) => void;
};

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");

  const handleSave = () => {
    onSubmit({ clientName, serviceName });
    setClientName("");
    setServiceName("");
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-[90%] max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl">
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-gray-900 text-xl">
              Add New Reservation
            </Dialog.Title>
            <Dialog.Close>
              <StyledIonicons
                className="text-gray-500"
                name="close"
                size={20}
              />
            </Dialog.Close>
          </View>

          <Dialog.Description className="mb-4 text-gray-500 text-sm">
            Enter details to add a new appointment reservation.
          </Dialog.Description>

          {/* Form Input Fields */}
          <View className="gap-4">
            <View>
              <Text className="mb-1.5 font-semibold text-gray-700 text-xs">
                Client Name
              </Text>
              <InputGroup className="h-12 w-full flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                <InputGroup.Input
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setClientName}
                  placeholder="e.g. John Doe"
                  value={clientName}
                />
              </InputGroup>
            </View>

            <View>
              <Text className="mb-1.5 font-semibold text-gray-700 text-xs">
                Service Name
              </Text>
              <InputGroup className="h-12 w-full flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3">
                <InputGroup.Input
                  className="flex-1 text-gray-900 text-sm"
                  onChangeText={setServiceName}
                  placeholder="e.g. Classic Haircut & Shave"
                  value={serviceName}
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
              Save Reservation
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
