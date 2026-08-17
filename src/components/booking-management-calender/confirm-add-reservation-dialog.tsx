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
      barber: "Isaac",
      dateTime: "11:00 AM",
      endTime: "11:40 AM",
      service: "Hair Cut & Style",
    },
    validators: {
      onChange: confirmReservationSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.({
        ...customerData,
        ...value,
        barberName: value.barber,
        price: "$85.00",
        serviceDuration: "40 min",
        serviceName: value.service,
      });
    },
  });

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content
          className="mx-4 max-h-[85%] rounded-[28px] bg-white p-6 shadow-2xl"
          style={{ maxHeight: screenHeight * 0.85 }}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-2xl text-gray-900">
              Add new reservation
            </Dialog.Title>
            <Dialog.Close asChild>
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                <StyledIcons className="text-gray-600" name="close" size={20} />
              </Pressable>
            </Dialog.Close>
          </View>

          {/* Stepper Indicator */}
          <View className="mb-6 flex-row items-center gap-2">
            <View className="h-1.5 flex-1 rounded-full bg-[#FF9500]" />
            <View className="h-1.5 flex-1 rounded-full bg-[#FF9500]" />
            <View className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </View>

          <Text className="mb-3 font-semibold text-gray-700 text-sm">
            Step 2 of 3: Service Details
          </Text>

          {/* Form Content */}
          <View className="flex-1">
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-3.5 pt-1">
                {/* Selected Service */}
                <form.Field name="service">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        Service
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="e.g. Hair Cut & Style"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>

                {/* Assigned Barber */}
                <form.Field name="barber">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        Barber
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="e.g. Isaac"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>

                {/* Date & Time */}
                <form.Field name="dateTime">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        Start Time
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="e.g. 11:00 AM"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>

                {/* End Time */}
                <form.Field name="endTime">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        End Time
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="e.g. 11:40 AM"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>
              </View>
            </ScrollView>
          </View>

          {/* Pinned Bottom Actions */}
          <View className="flex-row items-center gap-3 pt-3 border-t border-gray-100">
            <Button
              className="h-14 flex-1 rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
              onPress={onBack}
            >
              <Text className="font-semibold text-base text-gray-700">
                Back
              </Text>
            </Button>
            <Button
              className="h-14 flex-1 rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={() => form.handleSubmit()}
            >
              <Text className="font-bold text-base text-white">
                Next: Review
              </Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
