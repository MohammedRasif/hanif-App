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
      onSubmit?.({ customerType: "new", ...value });
      form.reset();
      onOpenChange(false);
    },
  });

  const handleExistingSubmit = () => {
    const selectedCustomer = MOCK_CUSTOMERS.find(
      (c) => c.id === selectedCustomerId,
    );
    onSubmit?.({ customerType: "existing", customer: selectedCustomer });
    onOpenChange(false);
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Set explicit height to ~80% of screen height so dialog stays large & fixed in height
  const dialogHeight = Math.max(screenHeight * 0.8, 540);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className="w-full h-full max-w-md flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-2xl"
          style={{ height: dialogHeight }}
        >
          {/* Main Scrollable Header + Content */}
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
            <Text className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
              New booking
            </Text>
            <Text className="mb-5 text-gray-500 text-sm">
              Create an appitment in few quick steps
            </Text>

            {/* Customer Segment Tabs */}
            <View className="mb-5 flex-row rounded-2xl bg-gray-100/80 p-1.5 gap-2">
              <Pressable
                className={`flex-1 items-center justify-center py-3 px-3 rounded-xl border ${
                  activeTab === "existing"
                    ? "border-[#FF9500] bg-white shadow-xs"
                    : "border-transparent"
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
                    : "border-transparent"
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

            {/* TAB 1: Existing Customer */}
            {activeTab === "existing" && (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
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

                {/* Customer Selection List */}
                <View className="gap-2">
                  {filteredCustomers.map((customer) => {
                    const isSelected = selectedCustomerId === customer.id;
                    return (
                      <Pressable
                        className={`flex-row items-center gap-3 rounded-2xl p-3.5 border ${
                          isSelected
                            ? "border-[#FF9500] bg-orange-50/30"
                            : "border-transparent bg-gray-50"
                        }`}
                        key={customer.id}
                        onPress={() => setSelectedCustomerId(customer.id)}
                      >
                        <Image
                          contentFit="cover"
                          source={{ uri: customer.avatar }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <Text className="flex-1 font-semibold text-base text-gray-900">
                          {customer.name}
                        </Text>
                        {isSelected && (
                          <StyledIcons
                            className="text-[#FF9500]"
                            name="checkmark-circle"
                            size={22}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}

            {/* TAB 2: New Customer Form */}
            {activeTab === "new" && (
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-2">
                  <form.Field name="fullName">
                    {(field) => (
                      <CommonInput
                        field={field}
                        label="Full Name"
                        placeholder="Plant@gmail.com"
                      />
                    )}
                  </form.Field>

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

          {/* Pinned Bottom Action Button */}
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
