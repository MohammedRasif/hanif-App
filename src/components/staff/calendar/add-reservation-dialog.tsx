import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useForm } from "@tanstack/react-form";
import { Button, Dialog } from "heroui-native";
import React from "react";
import { View } from "react-native";
import { z } from "zod";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { clientName: string; serviceName: string }) => void;
};

const addReservationSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  serviceName: z.string().min(1, "Service name is required"),
});

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const form = useForm({
    defaultValues: {
      clientName: "",
      serviceName: "",
    },
    validators: {
      onChange: addReservationSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      form.reset();
      onOpenChange(false);
    },
  });

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
              <StyledIcons className="text-gray-500" name="close" size={20} />
            </Dialog.Close>
          </View>

          <Dialog.Description className="mb-4 text-gray-500 text-sm">
            Enter details to add a new appointment reservation.
          </Dialog.Description>

          {/* Form Input Fields */}
          <View className="gap-2">
            <form.Field name="clientName">
              {(field) => (
                <CommonInput
                  field={field}
                  label="Client Name"
                  placeholder="e.g. John Doe"
                />
              )}
            </form.Field>

            <form.Field name="serviceName">
              {(field) => (
                <CommonInput
                  field={field}
                  label="Service Name"
                  placeholder="e.g. Classic Haircut & Shave"
                />
              )}
            </form.Field>
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
              onPress={() => form.handleSubmit()}
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
