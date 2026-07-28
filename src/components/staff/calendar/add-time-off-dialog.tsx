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

  // TanStack Form for Add Time Off
  const form = useForm({
    defaultValues: {
      endDate: "Today",
      reason: "",
      startDate: "Today",
    },
    validators: {
      onChange: addTimeOffSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({ ...value, barber, isAllDay });
      form.reset();
      onOpenChange(false);
    },
  });

  const dialogHeight = Math.max(screenHeight * 0.75, 520);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className="h-full w-full max-w-md flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-2xl"
          style={{ height: dialogHeight }}
        >
          {/* Main Content Area */}
          <View className="flex-1">
            {/* Centered Dialog Title */}
            <Text className="mb-6 font-bold text-2xl text-center text-gray-900 tracking-tight">
              Add time off
            </Text>

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Barber Profile Card */}
              <View className="mb-4 flex-row items-center gap-3.5 rounded-2xl border border-gray-100/80 bg-gray-50/80 p-3.5">
                <Image
                  contentFit="cover"
                  source={{ uri: barber.avatar }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
                <View>
                  <Text className="font-semibold text-base text-gray-900">
                    {barber.name}
                  </Text>
                  <Text className="mt-0.5 font-medium text-xs text-gray-400">
                    {barber.role}
                  </Text>
                </View>
              </View>

              {/* Reason Dropdown Field */}
              <View className="mb-3">
                <form.Field name="reason">
                  {(field) => (
                    <CommonInput
                      field={field}
                      placeholder="Reason"
                      suffix={
                        <StyledIcons
                          className="text-gray-700"
                          name="chevron-down"
                          size={18}
                        />
                      }
                    />
                  )}
                </form.Field>
              </View>

              {/* All Day Checkbox Toggle */}
              <Pressable
                className="mb-5 flex-row items-center gap-3 py-1"
                onPress={() => setIsAllDay(!isAllDay)}
              >
                <View
                  className={`h-6 w-6 items-center justify-center rounded-lg border ${
                    isAllDay
                      ? "border-black bg-black"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isAllDay && (
                    <StyledIcons
                      className="text-white"
                      name="checkmark"
                      size={16}
                    />
                  )}
                </View>
                <Text className="font-semibold text-base text-gray-900">
                  All day
                </Text>
              </Pressable>

              {/* Start Date & End Date Row */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <form.Field name="startDate">
                    {(field) => (
                      <CommonInput
                        field={field}
                        label="Start date"
                        placeholder="Today"
                        suffix={
                          <StyledIcons
                            className="text-gray-700"
                            name="chevron-down"
                            size={18}
                          />
                        }
                      />
                    )}
                  </form.Field>
                </View>

                <View className="flex-1">
                  <form.Field name="endDate">
                    {(field) => (
                      <CommonInput
                        field={field}
                        label="End date"
                        placeholder="Today"
                        suffix={
                          <StyledIcons
                            className="text-gray-700"
                            name="chevron-down"
                            size={18}
                          />
                        }
                      />
                    )}
                  </form.Field>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Pinned Bottom Save Button */}
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
