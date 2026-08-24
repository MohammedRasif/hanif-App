import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import { useForm } from "@tanstack/react-form";
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
};

const newCustomerSchema = z.object({
  email: z.string().email("Valid email is required"),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(6, "Phone number is required"),
});

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = useState("");

  // TanStack Form with Zod validation for New Customer
  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
    },
    validators: {
      onChange: newCustomerSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.({
        type: "new",
        customer: value,
        fullName: value.fullName,
      });
    },
  });

  const handleExistingSubmit = () => {
    onSubmit?.({
      type: "existing",
      customer: { name: searchQuery.trim() || "Existing Customer" },
      fullName: searchQuery.trim() || "Existing Customer",
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content
          className="mx-4 max-h-[85%] rounded-4xl bg-white p-6 shadow-2xl"
          style={{ maxHeight: screenHeight * 0.85 }}
        >
          {/* Main Scrollable Content */}
          <View className="flex-1">
            {/* Top Back Navigation */}
            <Pressable
              className="mb-2 flex-row items-center gap-1.5 self-start py-1"
              onPress={() => onOpenChange(false)}
            >
              <StyledIcons
                className="text-gray-700"
                name="arrow-back"
                size={20}
              />
              <Text className="font-medium text-base text-gray-700">Back</Text>
            </Pressable>

            {/* Dialog Title & Subtitle */}
            <Dialog.Title className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
              New booking
            </Dialog.Title>
            <Text className="mb-5 text-gray-500 text-sm">
              Create an appitment in few quick steps
            </Text>

            {/* Segment Tabs: Existing Customer vs New Customer */}
            <View className="mb-5 flex-row rounded-2xl bg-gray-100/80 p-1.5 gap-2">
              <Pressable
                className={`flex-1 items-center justify-center py-3 px-3 rounded-xl border ${
                  activeTab === "existing"
                    ? "border-[#FF9500] bg-white shadow-xs"
                    : "border-transparent bg-transparent"
                }`}
                onPress={() => setActiveTab("existing")}
              >
                <Text
                  className={`font-semibold text-xs text-center ${
                    activeTab === "existing" ? "text-gray-900" : "text-gray-500"
                  }`}
                  numberOfLines={1}
                >
                  Existing customer
                </Text>
              </Pressable>

              <Pressable
                className={`flex-1 items-center justify-center py-3 px-3 rounded-xl border ${
                  activeTab === "new"
                    ? "border-[#FF9500] bg-white shadow-xs"
                    : "border-transparent bg-transparent"
                }`}
                onPress={() => setActiveTab("new")}
              >
                <Text
                  className={`font-semibold text-xs text-center ${
                    activeTab === "new" ? "text-gray-900" : "text-gray-500"
                  }`}
                  numberOfLines={1}
                >
                  New customer
                </Text>
              </Pressable>
            </View>

            {/* Tab Content */}
            {activeTab === "existing" ? (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Search Customer Input */}
                <CommonInput
                  containerClassName="mb-4"
                  onChangeText={setSearchQuery}
                  placeholder="Search customer"
                  prefix={
                    <StyledIcons
                      className="text-gray-400"
                      name="search"
                      size={18}
                    />
                  }
                  value={searchQuery}
                />
              </ScrollView>
            ) : (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-1 pt-1">
                  {/* Full Name */}
                  <form.Field name="fullName">
                    {(field) => (
                      <CommonInput
                        field={field}
                        label="Full Name"
                        placeholder="Plant@gmail.com"
                      />
                    )}
                  </form.Field>

                  {/* Email */}
                  <form.Field name="email">
                    {(field) => (
                      <CommonInput
                        autoCapitalize="none"
                        field={field}
                        keyboardType="email-address"
                        label="Email"
                        placeholder="Plant@gmail.com"
                      />
                    )}
                  </form.Field>

                  {/* Phone Number */}
                  <form.Field name="phoneNumber">
                    {(field) => (
                      <CommonInput
                        field={field}
                        keyboardType="phone-pad"
                        label="Phone Number"
                        placeholder="0156614612"
                      />
                    )}
                  </form.Field>
                </View>
              </ScrollView>
            )}
          </View>

          {/* Bottom Action Button */}
          <View className="pt-3 border-t border-gray-100">
            <Button
              className="h-14 w-full rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={() =>
                activeTab === "existing"
                  ? handleExistingSubmit()
                  : form.handleSubmit()
              }
            >
              <Text className="font-bold text-base text-white">Done</Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
