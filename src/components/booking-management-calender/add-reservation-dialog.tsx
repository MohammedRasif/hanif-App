// add-reservation-dialog.tsx - Fixed version
import { StyledIcons } from "@/lib";
import {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  type Customer,
} from "@/Redux/feature/bookingCalendarApi";
import { Dialog } from "heroui-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebounce } from "@/hooks/useDebounce";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
};

export function AddReservationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [searchQuery, setSearchQuery] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Query for customers with search
  const { data: customersData, isFetching: isFetchingCustomers } =
    useGetCustomersQuery(
      {
        search: debouncedSearch || "",
        page: 1,
        page_size: 20,
      },
      {
        skip: activeTab !== "existing" || !isOpen,
      },
    );

  // Create customer mutation
  const [createCustomer, { isLoading: isCreatingCustomer }] =
    useCreateCustomerMutation();

  const customers = customersData?.data || [];

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setSelectedCustomer(null);
      setActiveTab("existing");
    }
  }, [isOpen]);

  // Handle customer selection - only set selectedCustomer, don't modify search
  const handleSelectCustomer = (customer: Customer) => {
    // If the same customer is clicked, deselect them
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(customer);
    }
  };

  // Handle done action
  const handleDone = async () => {
    if (activeTab === "existing") {
      if (selectedCustomer) {
        onSubmit?.({
          type: "existing",
          customer: selectedCustomer,
          customerId: selectedCustomer.id,
          fullName: selectedCustomer.full_name,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
        });
      } else {
        // No customer selected - show error or just return
        return;
      }
    } else {
      try {
        const newCustomerData = {
          full_name: fullName || "New Customer",
          email: email || "",
          phone: phoneNumber || "",
        };

        if (!newCustomerData.full_name) {
          return;
        }

        const response = await createCustomer(newCustomerData).unwrap();

        if (response.success) {
          onSubmit?.({
            type: "new",
            customer: response.data,
            customerId: response.data.id,
            fullName: response.data.full_name,
            email: response.data.email,
            phone: response.data.phone,
          });
        }
      } catch (error) {
        console.error("Failed to create customer:", error);
      }
    }
  };

  // Render customer item in list
  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const isSelected = selectedCustomer?.id === item.id;

    return (
      <TouchableOpacity
        className={`flex-row items-center justify-between px-4 py-3 border-b border-gray-100 ${
          isSelected ? "bg-orange-50" : ""
        }`}
        onPress={() => handleSelectCustomer(item)}
      >
        <View className="flex-1">
          <Text className="font-medium text-gray-900 text-sm">
            {item.full_name}
          </Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            {item.email && (
              <Text className="text-gray-500 text-xs">{item.email}</Text>
            )}
            {item.phone && (
              <Text className="text-gray-500 text-xs">{item.phone}</Text>
            )}
          </View>
        </View>
        {isSelected && (
          <StyledIcons
            className="text-[#FF9500]"
            name="checkmark-circle"
            size={20}
          />
        )}
      </TouchableOpacity>
    );
  };

  const isLoading = isFetchingCustomers || isCreatingCustomer;

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[92%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
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
            Create an appointments in few quick steps
          </Text>

          {/* Segment Tabs */}
          <View className="mb-5 flex-row gap-2.5">
            <Pressable
              className={`flex-1 items-center justify-center py-3 px-3 rounded-2xl border ${
                activeTab === "existing"
                  ? "border-[#FF9500] bg-white shadow-xs"
                  : "border-transparent bg-gray-100/80"
              }`}
              onPress={() => {
                setActiveTab("existing");
                setSelectedCustomer(null);
                setSearchQuery("");
              }}
            >
              <Text
                className={`font-semibold text-xs text-center ${
                  activeTab === "existing" ? "text-gray-900" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                Existing customer
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 items-center justify-center py-3 px-3 rounded-2xl border ${
                activeTab === "new"
                  ? "border-[#FF9500] bg-white shadow-xs"
                  : "border-transparent bg-gray-100/80"
              }`}
              onPress={() => {
                setActiveTab("new");
                setSelectedCustomer(null);
                setSearchQuery("");
              }}
            >
              <Text
                className={`font-semibold text-xs text-center ${
                  activeTab === "new" ? "text-gray-900" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                New customer
              </Text>
            </Pressable>
          </View>

          {/* Tab 1: Existing Customer */}
          {activeTab === "existing" ? (
            <View className="mb-4">
              <View className="h-13 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4 mb-2">
                <StyledIcons
                  className="mr-2.5 text-gray-400"
                  name="search"
                  size={20}
                />
                <TextInput
                  className="flex-1 text-sm text-gray-900"
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    // Don't clear selectedCustomer on search - keep selection if already selected
                  }}
                  placeholder="Search customer by name, email, or phone"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                />
                {isLoading && (
                  <ActivityIndicator size="small" color="#FF9500" />
                )}
              </View>

              {/* Show selected customer badge if any */}
              {/* {selectedCustomer && (
                <View className="mb-2 px-3 py-2 bg-[#FFF9F0] border border-[#FF9500]/30 rounded-xl flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs text-gray-500">Selected</Text>
                    <Text className="font-semibold text-gray-900 text-sm">
                      {selectedCustomer.full_name}
                    </Text>
                    {selectedCustomer.email && (
                      <Text className="text-gray-500 text-xs">{selectedCustomer.email}</Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => setSelectedCustomer(null)}
                    className="p-1"
                  >
                    <StyledIcons className="text-gray-400" name="close-circle" size={20} />
                  </Pressable>
                </View>
              )} */}

              {/* Customer List */}
              {customers.length > 0 ? (
                <FlatList
                  data={customers}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCustomerItem}
                  className="max-h-48 rounded-2xl border border-gray-100 bg-gray-50"
                  showsVerticalScrollIndicator={true}
                />
              ) : (
                !isLoading &&
                searchQuery && (
                  <View className="py-8 items-center">
                    <StyledIcons
                      className="text-gray-300 mb-2"
                      name="people-outline"
                      size={32}
                    />
                    <Text className="text-gray-500 text-sm text-center">
                      No customers found with "{searchQuery}"
                    </Text>
                    <Pressable
                      className="mt-3 px-4 py-2 bg-[#FF9500] rounded-full"
                      onPress={() => {
                        setFullName(searchQuery);
                        setActiveTab("new");
                      }}
                    >
                      <Text className="text-white font-medium text-sm">
                        Create new customer
                      </Text>
                    </Pressable>
                  </View>
                )
              )}

              {/* {!isLoading && !searchQuery && !selectedCustomer && (
                <View className="py-8 items-center">
                  <StyledIcons
                    className="text-gray-300 mb-2"
                    name="search-outline"
                    size={32}
                  />
                  <Text className="text-gray-500 text-sm text-center">
                    Search for an existing customer
                  </Text>
                </View>
              )} */}
            </View>
          ) : (
            /* Tab 2: New Customer Form */
            <View className="mb-6 gap-3.5">
              {/* Full Name */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Full Name *
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    className="text-sm text-gray-900"
                    onChangeText={setFullName}
                    placeholder="Enter full name"
                    placeholderTextColor="#9CA3AF"
                    value={fullName}
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Email
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    autoCapitalize="none"
                    className="text-sm text-gray-900"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="customer@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View>
                <Text className="mb-1.5 font-medium text-sm text-gray-700">
                  Phone Number
                </Text>
                <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
                  <TextInput
                    className="text-sm text-gray-900"
                    keyboardType="phone-pad"
                    onChangeText={setPhoneNumber}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Done Button */}
          <Pressable
            className={`h-14 w-full items-center justify-center rounded-2xl ${
              isLoading || (activeTab === "existing" && !selectedCustomer)
                ? "bg-gray-300"
                : "bg-[#FF9500] active:bg-[#e08300]"
            }`}
            onPress={handleDone}
            disabled={
              isLoading || (activeTab === "existing" && !selectedCustomer)
            }
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-bold text-base text-white">
                {activeTab === "new" ? "Create & Continue" : "Continue"}
              </Text>
            )}
          </Pressable>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
