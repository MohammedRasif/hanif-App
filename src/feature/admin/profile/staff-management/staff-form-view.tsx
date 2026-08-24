import { StyledIcons } from "@/lib";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  MOCK_COUNTRY_CODES,
  MOCK_ROLES,
  MOCK_SERVICES_LIST,
} from "./mock-data";
import type { StaffMemberItem } from "./types";

interface StaffFormViewProps {
  onBack: () => void;
  onDelete?: (staffId: string) => void;
  onSave: (staff: StaffMemberItem) => void;
  staff?: StaffMemberItem | null;
}

export function StaffFormView({
  staff,
  onBack,
  onSave,
  onDelete,
}: StaffFormViewProps) {
  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [role, setRole] = useState<StaffMemberItem["role"]>(
    staff?.role || "Staff",
  );
  const [calendarAccess, setCalendarAccess] = useState(
    staff?.calendarAccess ?? true,
  );
  const [clientDetailsAccess, setClientDetailsAccess] = useState(
    staff?.clientDetailsAccess ?? true,
  );
  const [countryCode, setCountryCode] = useState(staff?.countryCode || "+44");
  const [phone, setPhone] = useState(staff?.phone || "");
  const [position, setPosition] = useState(staff?.position || "");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    staff?.services || ["Jhon", "doe", "doi", "kimiko"],
  );
  const [currentServiceSelect, setCurrentServiceSelect] = useState(
    MOCK_SERVICES_LIST[0],
  );

  // Modals for selection
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isCountryCodePickerOpen, setIsCountryCodePickerOpen] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);

  const handleAddService = (srv?: string) => {
    const target = srv || currentServiceSelect;
    if (target && !selectedServices.includes(target)) {
      setSelectedServices((prev) => [...prev, target]);
    }
  };

  const handleRemoveService = (serviceName: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== serviceName));
  };

  const handleSave = () => {
    const newStaffData: StaffMemberItem = {
      id: staff?.id || Date.now().toString(),
      name: name.trim() || "Staff Member",
      email: email.trim(),
      role,
      calendarAccess,
      clientDetailsAccess,
      countryCode,
      phone: phone.trim(),
      position: position.trim(),
      services: selectedServices,
      avatarUrl: staff?.avatarUrl,
    };
    onSave(newStaffData);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Header Bar */}
      <View className="px-6 pt-12 pb-4 flex-row items-center justify-between">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons
            className="text-gray-900"
            name="chevron-back"
            size={24}
          />
        </Pressable>

        <Text className="font-bold text-xl text-gray-900 tracking-tight">
          Add Staff members
        </Text>

        <View className="w-10" />
      </View>

      {/* Main Scrollable Form */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & Upload Button */}
        <View className="mb-5 flex-row items-center gap-3.5 pt-2">
          {staff?.avatarUrl ? (
            <Image
              className="h-14 w-14 rounded-full bg-gray-200"
              contentFit="cover"
              source={{ uri: staff.avatarUrl }}
            />
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-full bg-gray-200">
              <StyledIcons className="text-gray-900" name="person" size={26} />
            </View>
          )}

          <Pressable className="flex-row items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/60 px-4 py-2.5 active:bg-gray-100">
            <StyledIcons
              className="text-gray-900"
              name="cloud-upload-outline"
              size={18}
            />
            <Text className="font-medium text-sm text-gray-700">
              upload picture
            </Text>
          </Pressable>
        </View>

        {/* Field 1: Name */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">Name</Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              className="text-sm text-gray-900"
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#9CA3AF"
              value={name}
            />
          </View>
        </View>

        {/* Field 2: Email Address */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Email address
          </Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              autoCapitalize="none"
              className="text-sm text-gray-900"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
            />
          </View>
        </View>

        {/* Role & Permissions Card */}
        <View className="mb-5 rounded-3xl bg-[#F8F9FA]/80 p-4">
          {/* Role Dropdown */}
          <View className="mb-4">
            <Text className="mb-1.5 font-medium text-sm text-gray-700">
              Role
            </Text>
            <Pressable
              className="h-13 w-full flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsRolePickerOpen(true)}
            >
              <Text className="text-sm text-gray-900">{role}</Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>
          </View>

          {/* Calendar Access Switch */}
          <View className="flex-row items-center justify-between py-2.5">
            <View>
              <Text className="font-bold text-sm text-gray-900">
                Calendar access
              </Text>
              <Text className="font-medium text-xs text-gray-400 mt-0.5">
                Access all staff member
              </Text>
            </View>

            <Switch
              ios_backgroundColor="#e5e7eb"
              onValueChange={setCalendarAccess}
              thumbColor="#ffffff"
              trackColor={{ false: "#d1d5db", true: "#10B981" }}
              value={calendarAccess}
            />
          </View>

          {/* Clint Details Switch */}
          <View className="flex-row items-center justify-between py-2.5 border-t border-gray-100 mt-1">
            <View>
              <Text className="font-bold text-sm text-gray-900">
                Clint details
              </Text>
              <Text className="font-medium text-xs text-gray-400 mt-0.5">
                Visibility of clint details
              </Text>
            </View>

            <Switch
              ios_backgroundColor="#e5e7eb"
              onValueChange={setClientDetailsAccess}
              thumbColor="#ffffff"
              trackColor={{ false: "#d1d5db", true: "#10B981" }}
              value={clientDetailsAccess}
            />
          </View>
        </View>

        {/* Section: More Details */}
        <Text className="font-bold text-lg text-gray-900 mb-3">
          More details
        </Text>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Phone number
          </Text>
          <View className="h-13 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <Pressable
              className="flex-row items-center gap-1 pr-3 border-r border-gray-200"
              onPress={() => setIsCountryCodePickerOpen(true)}
            >
              <Text className="font-medium text-sm text-gray-900">
                {countryCode}
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={16}
              />
            </Pressable>

            <TextInput
              className="flex-1 pl-3 text-sm text-gray-900"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
            />
          </View>
        </View>

        {/* Position (optional) */}
        <View className="mb-5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Position (optional)
          </Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              className="text-sm text-gray-900"
              onChangeText={setPosition}
              placeholder="Position"
              placeholderTextColor="#9CA3AF"
              value={position}
            />
          </View>
        </View>

        {/* Section: Services */}
        <Text className="font-bold text-lg text-gray-900 mb-3">Services</Text>

        <View className="mb-5">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Services
          </Text>
          <View className="flex-row items-center gap-2.5">
            <Pressable
              className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsServicePickerOpen(true)}
            >
              <Text className="text-sm text-gray-900">
                {currentServiceSelect}
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>

            <Pressable
              className="h-13 w-13 items-center justify-center rounded-2xl bg-black active:bg-gray-800 shadow-xs"
              onPress={() => handleAddService()}
            >
              <StyledIcons className="text-white" name="add" size={22} />
            </Pressable>
          </View>

          {/* Badges / Chips */}
          <View className="flex-row flex-wrap gap-2.5 mt-3">
            {selectedServices.map((serviceName) => (
              <View
                className="flex-row items-center gap-2 rounded-full bg-gray-100/90 px-4 py-2.5"
                key={serviceName}
              >
                <Text className="font-medium text-sm text-gray-800">
                  {serviceName}
                </Text>
                <Pressable
                  className="p-0.5 active:opacity-60"
                  hitSlop={8}
                  onPress={() => handleRemoveService(serviceName)}
                >
                  <StyledIcons
                    className="text-gray-600"
                    name="close"
                    size={15}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Working Hours Navigation Card */}
        <Pressable className="mb-6 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4.5 active:bg-gray-50">
          <Text className="font-bold text-base text-gray-900">
            Working hours
          </Text>
          <StyledIcons
            className="text-gray-900"
            name="chevron-forward"
            size={18}
          />
        </Pressable>

        {/* Bottom Actions Row 1: Delete + Save */}
        <View className="flex-row items-center gap-3 mb-3">
          <Pressable
            className="h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-red-50"
            onPress={() => {
              if (staff?.id && onDelete) {
                onDelete(staff.id);
              } else {
                onBack();
              }
            }}
          >
            <StyledIcons
              className="text-red-500"
              name="trash-outline"
              size={22}
            />
          </Pressable>

          <Pressable
            className="h-14 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleSave}
          >
            <Text className="font-bold text-base text-white">Save</Text>
          </Pressable>
        </View>

        {/* Bottom Action Row 2: Add and sed invite */}
        <Pressable
          className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
          onPress={handleSave}
        >
          <Text className="font-bold text-base text-white">
            Add and sed invite
          </Text>
        </Pressable>
      </ScrollView>

      {/* Role Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsRolePickerOpen(false)}
        transparent
        visible={isRolePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Role
            </Text>
            {MOCK_ROLES.map((r) => (
              <Pressable
                className={`py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  role === r ? "bg-amber-500/10" : "active:bg-gray-100"
                }`}
                key={r}
                onPress={() => {
                  setRole(r as any);
                  setIsRolePickerOpen(false);
                }}
              >
                <Text
                  className={`font-medium text-base ${
                    role === r ? "text-[#FF9500] font-bold" : "text-gray-900"
                  }`}
                >
                  {r}
                </Text>
                {role === r && (
                  <StyledIcons
                    className="text-[#FF9500]"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Country Code Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsCountryCodePickerOpen(false)}
        transparent
        visible={isCountryCodePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Country Code
            </Text>
            {MOCK_COUNTRY_CODES.map((code) => (
              <Pressable
                className={`py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between ${
                  countryCode === code
                    ? "bg-amber-500/10"
                    : "active:bg-gray-100"
                }`}
                key={code}
                onPress={() => {
                  setCountryCode(code);
                  setIsCountryCodePickerOpen(false);
                }}
              >
                <Text
                  className={`font-medium text-base ${
                    countryCode === code
                      ? "text-[#FF9500] font-bold"
                      : "text-gray-900"
                  }`}
                >
                  {code}
                </Text>
                {countryCode === code && (
                  <StyledIcons
                    className="text-[#FF9500]"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Service Picker Modal */}
      <Modal
        animationType="fade"
        onRequestClose={() => setIsServicePickerOpen(false)}
        transparent
        visible={isServicePickerOpen}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <Text className="mb-3 font-bold text-xl text-gray-900">
              Select Service
            </Text>
            {MOCK_SERVICES_LIST.map((srv) => (
              <Pressable
                className="py-3 px-3.5 mb-1.5 rounded-xl flex-row items-center justify-between active:bg-gray-100"
                key={srv}
                onPress={() => {
                  setCurrentServiceSelect(srv);
                  handleAddService(srv);
                  setIsServicePickerOpen(false);
                }}
              >
                <Text className="font-medium text-base text-gray-900">
                  {srv}
                </Text>
                {selectedServices.includes(srv) && (
                  <StyledIcons
                    className="text-gray-400"
                    name="checkmark"
                    size={18}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
