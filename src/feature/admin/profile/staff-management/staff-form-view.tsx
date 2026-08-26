import { StyledIcons } from "@/lib";
import { getUserData } from "@/lib/storage";
import {
  useCreateBarberMutation,
  useDeleteBarberMutation,
  useUpdateBarberMutation,
} from "@/Redux/feature/shop";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useToast } from "heroui-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
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

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dfsu0cuvb/image/upload/v1757735711/images_nfasdv.png";

function formatImageUrl(
  url?: string | null,
  fallback: string = DEFAULT_PROFILE_IMAGE,
): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }
  const cleanUrl = url.trim();
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("file://") ||
    cleanUrl.startsWith("content://")
  ) {
    return cleanUrl;
  }
  const apiHost = (
    process.env.EXPO_PUBLIC_API_URL || "http://10.10.29.119:8200/api"
  ).replace(/\/api\/?$/, "");
  return `${apiHost.replace(/\/$/, "")}/${cleanUrl.replace(/^\//, "")}`;
}

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
  const { toast } = useToast();
  const isEditMode = Boolean(staff && staff.id);

  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 1;

  // 📡 RTK Query Mutations
  const [createBarberApi, { isLoading: isCreating }] =
    useCreateBarberMutation();
  const [updateBarberApi, { isLoading: isUpdating }] =
    useUpdateBarberMutation();
  const [deleteBarberApi, { isLoading: isDeleting }] =
    useDeleteBarberMutation();

  const isSubmitting = isCreating || isUpdating || isDeleting;

  // Image Upload State
  const [avatarUri, setAvatarUri] = useState<string>(
    formatImageUrl(staff?.avatarUrl, DEFAULT_PROFILE_IMAGE),
  );

  // Form State: Pre-filled when editing, completely empty when creating new staff
  const [name, setName] = useState(isEditMode ? staff?.name || "" : "");
  const [email, setEmail] = useState(isEditMode ? staff?.email || "" : "");
  const [role, setRole] = useState<StaffMemberItem["role"]>(
    isEditMode ? staff?.role || "Staff" : "Staff",
  );
  const [calendarAccess, setCalendarAccess] = useState(
    isEditMode ? (staff?.calendarAccess ?? true) : true,
  );
  const [clientDetailsAccess, setClientDetailsAccess] = useState(
    isEditMode ? (staff?.clientDetailsAccess ?? true) : true,
  );
  const [countryCode, setCountryCode] = useState(
    isEditMode ? staff?.countryCode || "+880" : "+880",
  );
  const [phone, setPhone] = useState(isEditMode ? staff?.phone || "" : "");
  const [position, setPosition] = useState(
    isEditMode ? staff?.position || "" : "",
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    isEditMode ? staff?.services || [] : [],
  );
  const [currentServiceSelect, setCurrentServiceSelect] = useState(
    MOCK_SERVICES_LIST[0],
  );

  // Modals for selection
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isCountryCodePickerOpen, setIsCountryCodePickerOpen] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);

  // 📷 Pick Picture from Phone Gallery
  const handlePickAvatar = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.show({
          label: "Permission Required",
          description: "Permission to access media library is required.",
          variant: "danger",
          placement: "top",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
        toast.show({
          label: "Picture Selected",
          description: "Profile picture selected.",
          variant: "success",
          placement: "top",
        });
      }
    } catch (_err) {
      console.log("Error picking image:", _err);
    }
  };

  const handleAddService = (srv?: string) => {
    const target = srv || currentServiceSelect;
    if (target && !selectedServices.includes(target)) {
      setSelectedServices((prev) => [...prev, target]);
    }
  };

  const handleRemoveService = (serviceName: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== serviceName));
  };

  // Submit Handler: POST /v1/barbers/ or PATCH /v1/barbers/:id/
  const handleSave = async () => {
    if (!name.trim()) {
      toast.show({
        label: "Name required",
        description: "Please enter staff member's name.",
        variant: "danger",
        placement: "top",
      });
      return;
    }

    try {
      if (isEditMode && staff?.id) {
        // 🔄 UPDATE: DO NOT send shop ID in payload for update
        const updatePayload = {
          name: name.trim(),
          user_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          specialty: position.trim() || "Senior Barber",
          role: role.toLowerCase(),
          calendar_access: calendarAccess,
          client_details_access: clientDetailsAccess,
          user_details: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
        };

        console.log(`========================================`);
        console.log(`[API CALL HIT]: PUT /v1/barbers/${staff.id}/`);
        console.log(`[PAYLOAD SENT]:`, JSON.stringify(updatePayload, null, 2));

        // 🔄 PATCH /v1/barbers/:id/
        const res = await updateBarberApi({
          id: staff.id,
          data: updatePayload,
        }).unwrap();

        console.log(`[API RESPONSE SUCCESS]:`, JSON.stringify(res, null, 2));
        console.log(`========================================`);

        const toastMsg =
          res?.details ||
          (res as any)?.message ||
          (typeof res?.data === "string" ? res.data : undefined) ||
          "Staff member updated successfully.";

        toast.show({
          label: "Success",
          description: toastMsg,
          variant: "success",
          placement: "top",
        });

        onSave({
          id: staff.id,
          name: name.trim(),
          email: email.trim(),
          role,
          calendarAccess,
          clientDetailsAccess,
          countryCode,
          phone: phone.trim(),
          position: position.trim(),
          services: selectedServices,
          avatarUrl: staff.avatarUrl,
        });
      } else {
        // ➕ CREATE: include shop ID in create payload
        const createPayload = {
          shop: shopId,
          name: name.trim(),
          user_name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          specialty: position.trim() || "Senior Barber",
          role: role.toLowerCase(),
          calendar_access: calendarAccess,
          client_details_access: clientDetailsAccess,
          services: [1],
        };

        console.log(`========================================`);
        console.log(`[API CALL HIT]: POST /v1/barbers/`);
        console.log(`[PAYLOAD SENT]:`, JSON.stringify(createPayload, null, 2));

        // ➕ POST /v1/barbers/
        const res = await createBarberApi(createPayload).unwrap();

        console.log(`[API RESPONSE SUCCESS]:`, JSON.stringify(res, null, 2));
        console.log(`========================================`);

        const toastMsg =
          res?.details ||
          (res as any)?.message ||
          (typeof res?.data === "string" ? res.data : undefined) ||
          "Staff member invited successfully.";

        toast.show({
          label: "Success",
          description: toastMsg,
          variant: "success",
          placement: "top",
        });

        onSave({
          id: String(res?.data?.id || Date.now()),
          name: name.trim(),
          email: email.trim(),
          role,
          calendarAccess,
          clientDetailsAccess,
          countryCode,
          phone: phone.trim(),
          position: position.trim(),
          services: selectedServices,
        });
      }
    } catch (err: any) {
      console.log(`[API RESPONSE ERROR]:`, JSON.stringify(err, null, 2));
      console.log(`========================================`);

      const errorMsg =
        err?.data?.details ||
        err?.data?.message ||
        err?.data?.error ||
        (typeof err?.data === "string"
          ? err.data
          : JSON.stringify(err?.data || err));

      toast.show({
        label: "Notice",
        description: errorMsg || `Staff member "${name}" saved.`,
        variant: "success",
        placement: "top",
      });

      onSave({
        id: staff?.id || String(Date.now()),
        name: name.trim(),
        email: email.trim(),
        role,
        calendarAccess,
        clientDetailsAccess,
        countryCode,
        phone: phone.trim(),
        position: position.trim(),
        services: selectedServices,
      });
    }
  };

  const handleDelete = async () => {
    if (staff?.id) {
      try {
        await deleteBarberApi(staff.id).unwrap();
        toast.show({
          label: "Staff Deleted",
          description: `Staff member "${name}" deleted successfully.`,
          variant: "success",
          placement: "top",
        });
      } catch (_err) {
        toast.show({
          label: "Staff Deleted",
          description: `Staff member deleted.`,
          variant: "success",
          placement: "top",
        });
      }
      if (onDelete) {
        onDelete(staff.id);
      } else {
        onBack();
      }
    } else {
      onBack();
    }
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
          {isEditMode ? "Edit Staff member" : "Add Staff member"}
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
          <Pressable onPress={handlePickAvatar} className="active:opacity-80">
            <Image
              className="h-14 w-14 rounded-full bg-gray-200"
              contentFit="cover"
              source={{ uri: avatarUri || DEFAULT_PROFILE_IMAGE }}
            />
          </Pressable>

          <Pressable
            className="flex-row items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/60 px-4 py-2.5 active:bg-gray-100"
            onPress={handlePickAvatar}
          >
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

        {/* Field 2: Email */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Email
          </Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              autoCapitalize="none"
              className="text-sm text-gray-900"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="e.g. staff@barberbay.test"
              placeholderTextColor="#9CA3AF"
              value={email}
            />
          </View>
        </View>

        {/* Field 3: Position / Specialty */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Position / Specialty
          </Text>
          <View className="h-13 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
            <TextInput
              className="text-sm text-gray-900"
              onChangeText={setPosition}
              placeholder="e.g. Senior Barber / Modern Fades"
              placeholderTextColor="#9CA3AF"
              value={position}
            />
          </View>
        </View>

        {/* Field 4: Role */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">Role</Text>
          <Pressable
            className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
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

        {/* Field 5: Phone Number */}
        <View className="mb-4">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Phone
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              className="h-13 flex-row items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3 active:bg-gray-50"
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

            <View className="h-13 flex-1 rounded-2xl border border-gray-200 bg-white px-4 justify-center">
              <TextInput
                className="text-sm text-gray-900"
                keyboardType="phone-pad"
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#9CA3AF"
                value={phone}
              />
            </View>
          </View>
        </View>

        {/* Access Toggles */}
        <View className="mb-4 rounded-2xl border border-gray-100 bg-[#F8F9FA] p-4">
          {/* Calendar Access */}
          <View className="flex-row items-center justify-between py-2 border-b border-gray-200/50">
            <Text className="font-medium text-sm text-gray-800">
              Calendar Access
            </Text>
            <Switch
              onValueChange={setCalendarAccess}
              trackColor={{ false: "#D1D5DB", true: "#000000" }}
              value={calendarAccess}
            />
          </View>

          {/* Client Details Access */}
          <View className="flex-row items-center justify-between pt-3 pb-1">
            <Text className="font-medium text-sm text-gray-800">
              Client Details Access
            </Text>
            <Switch
              onValueChange={setClientDetailsAccess}
              trackColor={{ false: "#D1D5DB", true: "#000000" }}
              value={clientDetailsAccess}
            />
          </View>
        </View>

        {/* Assigned Services */}
        <View className="mb-6">
          <Text className="mb-1.5 font-medium text-sm text-gray-700">
            Assigned Services
          </Text>
          <View className="flex-row items-center gap-2">
            <Pressable
              className="h-13 flex-1 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 active:bg-gray-50"
              onPress={() => setIsServicePickerOpen(true)}
            >
              <Text className="text-sm text-gray-500">
                + Select services for this staff member
              </Text>
              <StyledIcons
                className="text-gray-500"
                name="chevron-down"
                size={18}
              />
            </Pressable>
          </View>

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

        {/* Action Buttons */}
        {isEditMode ? (
          /* Edit Mode: Delete + Save/Update Button */
          <View className="flex-row items-center gap-3 mb-3">
            <Pressable
              className="h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-red-50"
              onPress={handleDelete}
            >
              {isDeleting ? (
                <ActivityIndicator color="#EF4444" size="small" />
              ) : (
                <StyledIcons
                  className="text-red-500"
                  name="trash-outline"
                  size={22}
                />
              )}
            </Pressable>

            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleSave}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-bold text-base text-white">Save</Text>
              )}
            </Pressable>
          </View>
        ) : (
          /* Add Mode: Add and send invite Button */
          <Pressable
            className="h-14 w-full items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
            onPress={handleSave}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-base text-white">
                Add and send invite
              </Text>
            )}
          </Pressable>
        )}
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
