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
  View,
  useWindowDimensions,
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
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const MOCK_CUSTOMERS = [
  {
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    id: "1",
    name: "Mike Johnson",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    id: "2",
    name: "Sarah Williams",
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    id: "3",
    name: "Alex Rivera",
  },
];

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("1");

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

  const filteredCustomers = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNext = () => {
    if (activeTab === "existing") {
      const selected = MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId);
      onSubmit?.({
        type: "existing",
        customer: selected,
        fullName: selected?.name,
      });
    } else {
      form.handleSubmit();
    }
  };

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
            <View className="h-1.5 flex-1 rounded-full bg-gray-200" />
            <View className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </View>

          <Text className="mb-3 font-semibold text-gray-700 text-sm">
            Step 1 of 3: Customer Information
          </Text>

          {/* Tab Switcher: Existing vs New Customer */}
          <View className="mb-5 flex-row rounded-2xl bg-gray-100 p-1">
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
                activeTab === "existing" ? "bg-white shadow-xs" : ""
              }`}
              onPress={() => setActiveTab("existing")}
            >
              <Text
                className={`font-semibold text-sm ${
                  activeTab === "existing" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Existing Customer
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 items-center justify-center rounded-xl py-2.5 ${
                activeTab === "new" ? "bg-white shadow-xs" : ""
              }`}
              onPress={() => setActiveTab("new")}
            >
              <Text
                className={`font-semibold text-sm ${
                  activeTab === "new" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                New Customer
              </Text>
            </Pressable>
          </View>

          {/* Tab Content Container */}
          <View className="flex-1">
            {activeTab === "existing" ? (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Search Bar */}
                <View className="mb-4 flex-row items-center rounded-2xl border border-gray-200/80 bg-gray-50 px-3.5 py-2.5">
                  <StyledIcons
                    className="mr-2 text-gray-400"
                    name="search"
                    size={18}
                  />
                  <CommonInput
                    className="flex-1 text-gray-900 text-sm"
                    onChangeText={setSearchQuery}
                    placeholder="Search existing customers..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                  />
                </View>

                {/* Customer List */}
                <View className="gap-2.5">
                  {filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomerId === cust.id;
                    return (
                      <Pressable
                        className={`flex-row items-center justify-between rounded-2xl border p-3.5 ${
                          isSelected
                            ? "border-[#FF9500] bg-amber-500/5"
                            : "border-gray-100 bg-gray-50/60 active:bg-gray-100"
                        }`}
                        key={cust.id}
                        onPress={() => setSelectedCustomerId(cust.id)}
                      >
                        <View className="flex-row items-center gap-3">
                          <Image
                            className="h-11 w-11 rounded-full bg-gray-200"
                            contentFit="cover"
                            source={{ uri: cust.avatar }}
                          />
                          <Text className="font-semibold text-base text-gray-900">
                            {cust.name}
                          </Text>
                        </View>
                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#FF9500] bg-[#FF9500]"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <StyledIcons
                              className="text-white"
                              name="checkmark"
                              size={14}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-3.5 pt-1">
                  {/* Full Name */}
                  <form.Field name="fullName">
                    {(field) => (
                      <View>
                        <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                          Full name
                        </Text>
                        <CommonInput
                          className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                          onBlur={field.handleBlur}
                          onChangeText={field.handleChange}
                          placeholder="e.g. Mike Johnson"
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

                  {/* Phone Number */}
                  <form.Field name="phoneNumber">
                    {(field) => (
                      <View>
                        <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                          Phone number
                        </Text>
                        <CommonInput
                          className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                          keyboardType="phone-pad"
                          onBlur={field.handleBlur}
                          onChangeText={field.handleChange}
                          placeholder="e.g. 0123456789"
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

                  {/* Email */}
                  <form.Field name="email">
                    {(field) => (
                      <View>
                        <Text className="mb-1.5 font-medium text-gray-700 text-sm">
                          Email address
                        </Text>
                        <CommonInput
                          autoCapitalize="none"
                          className="h-12 rounded-2xl border border-gray-200 bg-gray-50/50 px-4 text-gray-900 text-sm"
                          keyboardType="email-address"
                          onBlur={field.handleBlur}
                          onChangeText={field.handleChange}
                          placeholder="e.g. mike@example.com"
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
            )}
          </View>

          {/* Pinned Bottom Action Button */}
          <View className="pt-3 border-t border-gray-100">
            <Button
              className="h-14 w-full rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleNext}
            >
              <Text className="font-bold text-base text-white">
                Next: Select Service
              </Text>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
