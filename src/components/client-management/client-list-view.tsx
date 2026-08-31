// ClientListView.tsx
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  type Customer,
} from "@/Redux/feature/bookingCalendarApi";
import { Dialog } from "heroui-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { ClientGroupItem, ClientItem } from "./client-types";
import { useDebounce } from "@/hooks/useDebounce";

export interface ClientListViewProps {
  onPressAdd?: () => void;
  onSelectClient?: (client: ClientItem) => void;
  onSelectGroup?: (group: ClientGroupItem) => void;
  title?: string;
}

export function ClientListView({
  title = "Client",
  onSelectGroup,
  onSelectClient,
  onPressAdd,
}: ClientListViewProps) {
  const [activeTab, setActiveTab] = useState<"list" | "groups">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: clientsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomersQuery(
    debouncedSearch
      ? { search: debouncedSearch, page: 1, page_size: 50 }
      : { page: 1, page_size: 50 },
    { refetchOnMountOrArgChange: true },
  );

  const clientsData = clientsResponse?.data;

  // Extract all_clients and new_clients arrays safely
  const allClients: ClientItem[] = Array.isArray(clientsData?.all_clients)
    ? clientsData.all_clients
    : Array.isArray(clientsData)
      ? (clientsData as any)
      : [];

  const newClients: ClientItem[] = Array.isArray(clientsData?.new_clients)
    ? clientsData.new_clients
    : [];

  // Filter all clients by search query for the "List" tab
  const filteredClients = allClients.filter((c) => {
    const nameStr = c.full_name || c.name || c.username || "";
    const phoneStr = c.phone || "";
    return (
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneStr.includes(searchQuery)
    );
  });

  // Build dynamic group categories matching user requirement
  const dynamicGroups: ClientGroupItem[] = [
    {
      id: "all",
      key: "all",
      title: `All clients (${allClients.length})`,
      count: allClients.length,
    },
    {
      id: "new",
      key: "new",
      title: `New clients (${newClients.length})`,
      count: newClients.length,
    },
  ];

  const getErrorMessage = () => {
    if (!error) return "Failed to load clients. Please check your network.";
    if (typeof error === "object" && "data" in error && error.data) {
      const d: any = error.data;
      return (
        d?.details || d?.message || d?.error || "Error fetching client list"
      );
    }
    return "Failed to load clients";
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Title */}
      <View className="px-6 pt-12 pb-3">
        <Text className="font-bold text-2xl text-gray-900 tracking-tight">
          {title}
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6 mb-3">
        <CommonInput
          containerClassName="mb-0"
          onChangeText={setSearchQuery}
          placeholder="Search customer by name or phone"
          prefix={
            <StyledIcons className="text-gray-400" name="search" size={18} />
          }
          value={searchQuery}
        />
      </View>

      {/* Segmented Tab Switcher */}
      <View className="px-6 mb-3">
        <View className="flex-row rounded-full bg-gray-100/80 p-1.5 gap-2">
          <Pressable
            className={`flex-1 items-center justify-center py-2.5 px-4 rounded-full ${
              activeTab === "list" ? "bg-black shadow-xs" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("list")}
          >
            <Text
              className={`font-semibold text-xs ${
                activeTab === "list" ? "text-white" : "text-gray-600"
              }`}
            >
              List ({filteredClients.length})
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 items-center justify-center py-2.5 px-4 rounded-full ${
              activeTab === "groups" ? "bg-black shadow-xs" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("groups")}
          >
            <Text
              className={`font-semibold text-xs ${
                activeTab === "groups" ? "text-white" : "text-gray-600"
              }`}
            >
              groups ({dynamicGroups.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* TAB 1: List View */}
      {activeTab === "list" && (
        <>
          {isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator color="#F0B100" size="small" />
              <Text className="mt-2 font-poppins text-xs text-gray-400">
                Loading clients...
              </Text>
            </View>
          ) : isError ? (
            <View className="items-center justify-center py-16 px-6">
              <StyledIcons
                className="text-red-400 mb-2"
                name="alert-circle-outline"
                size={36}
              />
              <Text className="font-poppins-medium text-red-500 text-sm text-center">
                {getErrorMessage()}
              </Text>
              <Pressable
                className="mt-4 rounded-full bg-black px-5 py-2 active:opacity-80"
                onPress={() => refetch()}
              >
                <Text className="font-semibold text-white text-xs">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 100,
              }}
              data={filteredClients}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={
                <View className="items-center justify-center py-20">
                  <StyledIcons
                    className="text-gray-300 mb-2"
                    name="people-outline"
                    size={40}
                  />
                  <Text className="font-poppins-medium text-gray-400 text-sm text-center">
                    {searchQuery
                      ? `No clients found matching "${searchQuery}"`
                      : "No data here"}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const clientName =
                  item.full_name || item.name || item.username || "Client";
                const clientImage = item.image || item.avatar;

                return (
                  <Pressable
                    className="flex-row items-center gap-3.5 border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
                    onPress={() => onSelectClient?.(item)}
                  >
                    {/* Avatar Image / Fallback Circle */}
                    {clientImage ? (
                      <Image
                        contentFit="cover"
                        source={{ uri: clientImage }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    ) : (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                        <StyledIcons
                          className="text-gray-500"
                          name="person"
                          size={20}
                        />
                      </View>
                    )}

                    {/* Client Info Text */}
                    <View className="flex-1">
                      <Text className="font-semibold text-sm text-gray-900">
                        {clientName}
                      </Text>
                      {item.phone ? (
                        <Text className="mt-0.5 text-gray-400 text-xs font-normal">
                          {item.phone}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* TAB 2: groups View */}
      {activeTab === "groups" && (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          data={dynamicGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              className="flex-row items-center justify-between border-b border-gray-100/80 py-3.5 active:bg-gray-50/50"
              onPress={() => onSelectGroup?.(item)}
            >
              <View className="flex-row items-center gap-3.5">
                {/* Circle Avatar Icon */}
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200/80">
                  <StyledIcons
                    className="text-gray-500"
                    name="people-outline"
                    size={20}
                  />
                </View>

                {/* Group Title */}
                <Text className="font-semibold text-sm text-gray-900">
                  {item.title}
                </Text>
              </View>

              {/* Chevron Right Icon */}
              <StyledIcons
                className="text-gray-900"
                name="chevron-forward"
                size={18}
              />
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Floating Black Add Button (+) */}
      <Pressable
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg active:scale-95"
        onPress={() => setIsCreateDialogOpen(true)}
      >
        <StyledIcons className="text-white" name="add" size={24} />
      </Pressable>

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetch();
          if (onPressAdd) onPressAdd();
        }}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Create Customer Dialog Component                                           */
/* -------------------------------------------------------------------------- */

type CreateCustomerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

function CreateCustomerDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateCustomerDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [createCustomer] = useCreateCustomerMutation();

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setEmail("");
      setPhone("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!fullName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await createCustomer({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      }).unwrap();

      if (response.success) {
        onOpenChange(false);
        onSuccess?.();
        // Show success toast if you have a toast system
        // toast.show({ label: "Customer created successfully!", variant: "success" });
      }
    } catch (error) {
      console.error("Failed to create customer:", error);
      // Show error toast if you have a toast system
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay without onPress to prevent closing on outside click */}
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content
          className="w-[92%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl"
          // Prevent closing on outside click
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
        >
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-2xl text-gray-900">
              New Customer
            </Dialog.Title>
            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => onOpenChange(false)}
            >
              <StyledIcons className="text-gray-600" name="close" size={20} />
            </Pressable>
          </View>

          <Text className="mb-5 text-gray-500 text-sm">
            Add a new customer to your list
          </Text>

          {/* Form Fields */}
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
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-3 pt-2">
            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
              onPress={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <Text className="font-semibold text-base text-gray-700">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              className={`h-14 flex-1 items-center justify-center rounded-2xl ${
                isLoading
                  ? "bg-gray-400"
                  : fullName.trim()
                    ? "bg-[#FF9500] active:bg-[#e08300]"
                    : "bg-gray-300"
              }`}
              onPress={handleCreate}
              disabled={isLoading || !fullName.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="font-bold text-base text-white">Create</Text>
              )}
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

// Also need to import TextInput from react-native
import { TextInput } from "react-native";
