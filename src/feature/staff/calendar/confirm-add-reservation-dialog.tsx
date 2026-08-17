import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useForm } from "@tanstack/react-form";
import { Button, Dialog } from "heroui-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { z } from "zod";

type Props = {
  customerData?: any;
  isOpen: boolean;
  onBack?: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
};

const confirmReservationSchema = z.object({
  barber: z.string().min(1, "Barber selection is required"),
  dateTime: z.string().min(1, "Date & time is required"),
  endTime: z.string().min(1, "End time is required"),
  service: z.string().min(1, "Service selection is required"),
});

export function ConfirmAddReservationDialog({
  isOpen,
  onOpenChange,
  onBack,
  onSubmit,
  customerData,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();

  // TanStack Form for Confirm Reservation Details
  const form = useForm({
    defaultValues: {
      barber: "",
      dateTime: "12 july, 10:00 am",
      endTime: "10:50 am",
      service: "",
    },
    validators: {
      onChange: confirmReservationSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.({ ...customerData, ...value });
      form.reset();
      onOpenChange(false);
    },
  });

  const dialogHeight = Math.max(screenHeight * 0.8, 540);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className="h-full w-full max-w-md flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-2xl"
          style={{ height: dialogHeight }}
        >
          {/* Main Content Scroll Area */}
          <View className="flex-1">
            {/* Top Back Navigation */}
            <Pressable
              className="mb-2 flex-row items-center gap-1.5 self-start py-1"
              onPress={onBack || (() => onOpenChange(false))}
            >
              <StyledIcons
                className="text-gray-700"
                name="arrow-back"
                size={20}
              />
              <Text className="font-medium text-base text-gray-700">Back</Text>
            </Pressable>

            {/* Dialog Heading */}
            <Text className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
              New booking
            </Text>
            <Text className="mb-6 text-gray-500 text-sm">
              Create an appitment in few quick steps
            </Text>

            {/* Form Fields */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-2">
                {/* Barber Field */}
                <form.Field name="barber">
                  {(field) => (
                    <CommonInput
                      field={field}
                      label="Barber"
                      placeholder="Choose"
                      suffix={
                        <StyledIcons
                          className="text-gray-700"
                          name="chevron-down"
                          size={20}
                        />
                      }
                    />
                  )}
                </form.Field>

                {/* Service Field */}
                <form.Field name="service">
                  {(field) => (
                    <CommonInput
                      field={field}
                      label="Service"
                      placeholder="Choose"
                      suffix={
                        <StyledIcons
                          className="text-gray-700"
                          name="chevron-down"
                          size={20}
                        />
                      }
                    />
                  )}
                </form.Field>

                {/* Date & Time and End Time Row */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <form.Field name="dateTime">
                      {(field) => (
                        <CommonInput
                          field={field}
                          label="Date & time"
                          placeholder="12 july, 10:00 am"
                        />
                      )}
                    </form.Field>
                  </View>

                  <View className="flex-1">
                    <form.Field name="endTime">
                      {(field) => (
                        <CommonInput
                          field={field}
                          label="End"
                          placeholder="10:50 am"
                        />
                      )}
                    </form.Field>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Pinned Bottom Action Button */}
          <View className="pt-3 border-t border-gray-100">
            <Button
              className="h-14 w-full rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={() => form.handleSubmit()}
            >
              <Text className="font-bold text-base text-white">Done</Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
