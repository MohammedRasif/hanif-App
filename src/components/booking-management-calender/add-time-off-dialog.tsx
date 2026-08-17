import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useForm } from "@tanstack/react-form";
import { Image } from "expo-image";
import { Button, Dialog } from "heroui-native";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { z } from "zod";

type Props = {
  barber?: {
    avatar?: string;
    name?: string;
    role?: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
};

const addTimeOffSchema = z.object({
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(1, "Reason is required"),
  startDate: z.string().min(1, "Start date is required"),
});

export function AddTimeOffDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  barber = {
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    name: "Isaac",
    role: "Barber",
  },
}: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const [isAllDay, setIsAllDay] = useState(true);

  const form = useForm({
    defaultValues: {
      endDate: "18-07-2026",
      reason: "",
      startDate: "18-07-2026",
    },
    validators: {
      onChange: addTimeOffSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        ...value,
        barber,
        isAllDay,
        timeOffDuration: isAllDay ? "All day" : "Partial day",
        timeOffReason: value.reason || "Time Off",
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
              Add time off
            </Dialog.Title>
            <Dialog.Close asChild>
              <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                <StyledIcons className="text-gray-600" name="close" size={20} />
              </Pressable>
            </Dialog.Close>
          </View>

          {/* Form Content */}
          <View className="flex-1">
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Selected Barber Card */}
              <View className="mb-4 flex-row items-center gap-3.5 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-3.5">
                <Image
                  className="h-12 w-12 rounded-full bg-gray-200"
                  contentFit="cover"
                  source={{ uri: barber.avatar }}
                />
                <View>
                  <Text className="font-bold text-base text-gray-900">
                    {barber.name}
                  </Text>
                  <Text className="font-medium text-gray-500 text-xs">
                    {barber.role}
                  </Text>
                </View>
              </View>

              {/* All Day Toggle Switch */}
              <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                <Text className="font-semibold text-base text-gray-900">
                  All day
                </Text>
                <Pressable
                  className={`h-7 w-12 items-center rounded-full p-0.5 transition-colors ${
                    isAllDay ? "bg-[#FF9500]" : "bg-gray-300"
                  }`}
                  onPress={() => setIsAllDay(!isAllDay)}
                >
                  <View
                    className={`h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                      isAllDay ? "translate-x-2.5 self-end" : "self-start"
                    }`}
                  />
                </Pressable>
              </View>

              <View className="gap-3.5">
                {/* Start Date */}
                <form.Field name="startDate">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        Start date
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="DD-MM-YYYY"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>

                {/* End Date */}
                <form.Field name="endDate">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        End date
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="DD-MM-YYYY"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                    </View>
                  )}
                </form.Field>

                {/* Reason */}
                <form.Field name="reason">
                  {(field) => (
                    <View>
                      <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                        Reason
                      </Text>
                      <CommonInput
                        className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="e.g. Personal vacation"
                        placeholderTextColor="#9CA3AF"
                        value={field.state.value}
                      />
                      {field.state.meta.errors ? (
                        <Text className="mt-1 text-red-500 text-xs">
                          {field.state.meta.errors.join(", ")}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </form.Field>
              </View>
            </ScrollView>
          </View>

          {/* Pinned Bottom Action Button */}
          <View className="pt-3 border-t border-gray-100">
            <Button
              className="h-14 w-full rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={() => form.handleSubmit()}
            >
              <Text className="font-bold text-base text-white">Save</Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
