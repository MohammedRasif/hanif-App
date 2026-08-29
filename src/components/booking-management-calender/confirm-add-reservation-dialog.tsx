// confirm-add-reservation-dialog.tsx - With dropdown selectors
import { CommonInput } from "@/components/shared";
import { StyledIcons } from "@/lib";
import {
  useGetBookingBarbersQuery,
  useGetBookingServicesQuery,
  type BookingBarber,
  type BookingServiceOption,
} from "@/Redux/feature/bookingCalendarApi";
import { useForm } from "@tanstack/react-form";
import { Dialog } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
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
  shopId?: number | string;
};

type PaymentMethod = "cash" | "card";

const confirmReservationSchema = z.object({
  barber: z.string().min(1, "Barber selection is required"),
  service: z.string().min(1, "Service selection is required"),
  dateTime: z.string().min(1, "Date & time is required"),
  endTime: z.string().min(1, "End time is required"),
  paymentMethod: z.enum(["cash", "card"]),
});

export function ConfirmAddReservationDialog({
  isOpen,
  onOpenChange,
  onBack,
  onSubmit,
  customerData,
  shopId,
}: Props) {
  const { height: screenHeight } = useWindowDimensions();

  // State for dropdown modals
  const [showBarberPicker, setShowBarberPicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  // State for selected values
  const [selectedBarberId, setSelectedBarberId] = useState<
    number | string | null
  >(null);
  const [selectedServiceId, setSelectedServiceId] = useState<
    number | string | null
  >(null);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("cash");

  // Get barbers for the shop
  const {
    data: barbersData,
    isLoading: isLoadingBarbers,
    isError: isBarbersError,
    refetch: refetchBarbers,
  } = useGetBookingBarbersQuery(
    { shop: shopId ?? "" },
    { skip: !shopId || !isOpen },
  );

  // Get services - filtered by selected barber
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetBookingServicesQuery(
    {
      shop: shopId ?? "",
      barber: selectedBarberId || undefined,
    },
    { skip: !shopId || !isOpen },
  );

  const barbers = barbersData?.data || [];
  const services = servicesData?.data || [];

  // Filter barbers based on selected service
  const filteredBarbers = useMemo(() => {
    if (!selectedServiceId) return barbers;
    return barbers.filter((barber) => {
      return barber.assigned_services?.some(
        (service) => String(service.id) === String(selectedServiceId),
      );
    });
  }, [barbers, selectedServiceId]);

  // Filter services based on selected barber
  const filteredServices = useMemo(() => {
    if (!selectedBarberId) return services;
    const selectedBarber = barbers.find(
      (b) => String(b.id) === String(selectedBarberId),
    );
    if (!selectedBarber) return services;
    const assignedServiceIds = new Set(
      selectedBarber.assigned_services?.map((s) => String(s.id)) || [],
    );
    return services.filter((service) =>
      assignedServiceIds.has(String(service.id)),
    );
  }, [services, selectedBarberId, barbers]);

  // Get selected objects
  const selectedBarber = barbers.find(
    (b) => String(b.id) === String(selectedBarberId),
  );
  const selectedService = services.find(
    (s) => String(s.id) === String(selectedServiceId),
  );

  // Reset selections when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBarberId(null);
      setSelectedServiceId(null);
      setSelectedDateTime("");
      setSelectedEndTime("");
      setSelectedDate("");
      setSelectedPaymentMethod("cash");
    }
  }, [isOpen]);

  // Auto-select if only one option available
  useEffect(() => {
    if (
      filteredBarbers.length === 1 &&
      !selectedBarberId &&
      filteredBarbers[0]
    ) {
      setSelectedBarberId(filteredBarbers[0].id);
    }
  }, [filteredBarbers]);

  useEffect(() => {
    if (
      filteredServices.length === 1 &&
      !selectedServiceId &&
      filteredServices[0]
    ) {
      setSelectedServiceId(filteredServices[0].id);
    }
  }, [filteredServices]);

  // Generate date options (today + next 7 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const displayStr = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      dates.push({ value: dateStr, label: displayStr });
    }
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const dateOptions = generateDateOptions();
  const timeSlots = generateTimeSlots();

  // TanStack Form
  const form = useForm({
    defaultValues: {
      barber:
        selectedBarber?.user_details?.name || selectedBarber?.user_name || "",
      service: selectedService?.name || "",
      dateTime: selectedDateTime || "Select date & time",
      endTime: selectedEndTime || "Select end time",
      paymentMethod: selectedPaymentMethod,
    },
    validators: {
      onChange: confirmReservationSchema,
    },
    onSubmit: async ({ value }) => {
      // Format the date correctly for the API
      const formattedDate =
        selectedDate || new Date().toISOString().split("T")[0];

      // Format the time correctly
      let formattedTime = selectedDateTime || "09:00:00";
      if (formattedTime && formattedTime.split(":").length === 2) {
        formattedTime = `${formattedTime}:00`;
      }

      onSubmit?.({
        ...customerData,
        ...value,
        barberId: selectedBarberId,
        barberName:
          selectedBarber?.user_details?.name ||
          selectedBarber?.user_name ||
          value.barber,
        serviceId: selectedServiceId,
        serviceName: selectedService?.name || value.service,
        serviceDuration: selectedService?.duration_minutes || 0,
        price: selectedService?.price || 0,
        dateTime: selectedDateTime,
        endTime: selectedEndTime,
        startTime: formattedTime, // HH:MM:SS format
        appointment_date: formattedDate, // YYYY-MM-DD format
        payment_method: selectedPaymentMethod,
        customerId: customerData?.customerId,
        customerName: customerData?.fullName,
        email: customerData?.email,
        phone: customerData?.phone,
      });
    },
  });

  // Update form values when selections change
  useEffect(() => {
    const barberName =
      selectedBarber?.user_details?.name || selectedBarber?.user_name || "";
    form.setFieldValue("barber", barberName);
  }, [selectedBarber]);

  useEffect(() => {
    form.setFieldValue("service", selectedService?.name || "");
  }, [selectedService]);

  useEffect(() => {
    const displayText =
      selectedDate && selectedDateTime
        ? `${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${selectedDateTime}`
        : selectedDateTime || "Select date & time";
    form.setFieldValue("dateTime", displayText);
  }, [selectedDate, selectedDateTime]);

  useEffect(() => {
    form.setFieldValue("endTime", selectedEndTime || "Select end time");
  }, [selectedEndTime]);

  useEffect(() => {
    form.setFieldValue("paymentMethod", selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  const handleSelectBarber = (barber: BookingBarber) => {
    setSelectedBarberId(barber.id);
    setShowBarberPicker(false);
  };

  const handleSelectService = (service: BookingServiceOption) => {
    setSelectedServiceId(service.id);
    setShowServicePicker(false);
  };

  const handleSelectDate = (dateStr: string | undefined) => {
    if (dateStr === undefined) return;
    setSelectedDate(dateStr);
  };

  const handleSelectDateTime = (time: string | undefined) => {
    if (time === undefined) return;
    setSelectedDateTime(time);
    if (selectedService && time) {
      const [hoursStr, minutesStr] = time.split(":");
      const hours = parseInt(hoursStr || "", 10);
      const minutes = parseInt(minutesStr || "", 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const totalMinutes =
          hours * 60 + minutes + (selectedService.duration_minutes || 30);
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        const endTimeStr = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
        setSelectedEndTime(endTimeStr);
      }
    }
  };

  const handleConfirmDateTime = () => {
    if (selectedDate && selectedDateTime) {
      setShowDateTimePicker(false);
    }
  };

  const handleCancelDateTime = () => {
    setSelectedDate("");
    setSelectedDateTime("");
    setSelectedEndTime("");
    setShowDateTimePicker(false);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const isLoading = isLoadingBarbers || isLoadingServices;

  // Dropdown Picker Modal - Reusable dropdown component
  const DropdownModal = ({
    visible,
    onClose,
    title,
    children,
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <View className="w-[90%] max-h-[70%] bg-white rounded-3xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-lg text-gray-900">{title}</Text>
            <Pressable onPress={onClose} className="p-2">
              <StyledIcons className="text-gray-500" name="close" size={24} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  // Date & Time Picker Modal
  const DateTimePickerModal = () => (
    <Modal
      visible={showDateTimePicker}
      transparent
      animationType="fade"
      onRequestClose={handleCancelDateTime}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={handleCancelDateTime}
      >
        <View className="w-[90%] max-h-[80%] bg-white rounded-3xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-lg text-gray-900">
              Select Date & Time
            </Text>
            <Pressable onPress={handleCancelDateTime} className="p-2">
              <StyledIcons className="text-gray-500" name="close" size={24} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="font-semibold text-gray-700 mb-2">
              Select Date
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {dateOptions.map((date) => (
                <TouchableOpacity
                  key={date.value}
                  className={`px-4 py-2 rounded-full border ${
                    selectedDate === date.value
                      ? "bg-[#FF9500] border-[#FF9500]"
                      : "bg-white border-gray-200"
                  }`}
                  onPress={() => handleSelectDate(date.value)}
                >
                  <Text
                    className={
                      selectedDate === date.value
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    {date.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-semibold text-gray-700 mb-2">
              Select Time
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  className={`px-4 py-2 rounded-full border ${
                    selectedDateTime === time
                      ? "bg-[#FF9500] border-[#FF9500]"
                      : "bg-white border-gray-200"
                  }`}
                  onPress={() => handleSelectDateTime(time)}
                >
                  <Text
                    className={
                      selectedDateTime === time ? "text-white" : "text-gray-700"
                    }
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedDate && selectedDateTime && (
              <View className="mt-4 p-3 rounded-2xl bg-[#FFF9F0] border border-[#FF9500]/20">
                <Text className="text-xs text-gray-600">Selected</Text>
                <Text className="font-semibold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at {selectedDateTime}
                </Text>
              </View>
            )}

            <View className="flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
              <Pressable
                className="flex-1 h-12 rounded-2xl bg-gray-100 items-center justify-center"
                onPress={handleCancelDateTime}
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                className={`flex-1 h-12 rounded-2xl items-center justify-center ${
                  selectedDate && selectedDateTime
                    ? "bg-[#FF9500]"
                    : "bg-gray-300"
                }`}
                onPress={handleConfirmDateTime}
                disabled={!selectedDate || !selectedDateTime}
              >
                <Text className="font-bold text-white">Confirm</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[92%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Dialog.Title className="font-bold text-2xl text-gray-900">
              Add new reservation
            </Dialog.Title>
            <Pressable
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => onOpenChange(false)}
            >
              <StyledIcons className="text-gray-600" name="close" size={20} />
            </Pressable>
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

          {/* Customer info summary */}
          {customerData?.fullName && (
            <View className="mb-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <Text className="text-xs text-gray-500">Customer</Text>
              <Text className="font-semibold text-gray-900">
                {customerData.fullName}
              </Text>
              {customerData.email && (
                <Text className="text-gray-500 text-xs">
                  {customerData.email}
                </Text>
              )}
            </View>
          )}

          {/* Form Fields */}
          {!isLoading ? (
            <ScrollView
              className="mb-4"
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: screenHeight * 0.45 }}
            >
              <View>
                {/* Service Dropdown */}
                <View className="mb-3">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Service
                  </Text>
                  <Pressable
                    className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4"
                    onPress={() => setShowServicePicker(true)}
                  >
                    <Text
                      className={
                        selectedService ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedService?.name || "Tap to select service"}
                    </Text>
                    <StyledIcons
                      className="text-gray-400"
                      name="chevron-down"
                      size={20}
                    />
                  </Pressable>
                </View>

                {/* Barber Dropdown */}
                <View className="mb-3">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Barber
                  </Text>
                  <Pressable
                    className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4"
                    onPress={() => setShowBarberPicker(true)}
                  >
                    <Text
                      className={
                        selectedBarber ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedBarber?.user_details?.name ||
                        selectedBarber?.user_name ||
                        "Tap to select barber"}
                    </Text>
                    <StyledIcons
                      className="text-gray-400"
                      name="chevron-down"
                      size={20}
                    />
                  </Pressable>
                </View>

                {/* Date & Time Dropdown */}
                <View className="mb-3">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    Date & Time
                  </Text>
                  <Pressable
                    className="h-13 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4"
                    onPress={() => setShowDateTimePicker(true)}
                  >
                    <Text
                      className={
                        selectedDate && selectedDateTime
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    >
                      {selectedDate && selectedDateTime
                        ? `${new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${selectedDateTime}`
                        : "Tap to select date & time"}
                    </Text>
                    <StyledIcons
                      className="text-gray-400"
                      name="calendar-outline"
                      size={20}
                    />
                  </Pressable>
                </View>

                {/* End Time - Auto-calculated */}
                <View className="mb-3">
                  <Text className="mb-1.5 font-medium text-sm text-gray-700">
                    End Time
                  </Text>
                  <View className="h-13 rounded-2xl border border-gray-200 bg-gray-50 px-4 justify-center">
                    <Text
                      className={
                        selectedEndTime ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedEndTime || "Auto-calculated"}
                    </Text>
                  </View>
                </View>

                {/* Payment Method */}
                <View className="mt-2 mb-4">
                  <Text className="mb-2 font-medium text-sm text-gray-700">
                    Payment Method
                  </Text>
                  <View className="flex-row gap-3">
                    <Pressable
                      className={`flex-1 py-3 px-4 rounded-2xl border ${
                        selectedPaymentMethod === "cash"
                          ? "bg-[#FFF9F0] border-[#FF9500]"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      onPress={() => handlePaymentMethodSelect("cash")}
                    >
                      <View className="flex-row items-center justify-center gap-2">
                        <StyledIcons
                          className={
                            selectedPaymentMethod === "cash"
                              ? "text-[#FF9500]"
                              : "text-gray-400"
                          }
                          name="cash-outline"
                          size={20}
                        />
                        <Text
                          className={
                            selectedPaymentMethod === "cash"
                              ? "font-semibold text-gray-900"
                              : "text-gray-600"
                          }
                        >
                          Cash
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      className={`flex-1 py-3 px-4 rounded-2xl border ${
                        selectedPaymentMethod === "card"
                          ? "bg-[#FFF9F0] border-[#FF9500]"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      onPress={() => handlePaymentMethodSelect("card")}
                    >
                      <View className="flex-row items-center justify-center gap-2">
                        <StyledIcons
                          className={
                            selectedPaymentMethod === "card"
                              ? "text-[#FF9500]"
                              : "text-gray-400"
                          }
                          name="card-outline"
                          size={20}
                        />
                        <Text
                          className={
                            selectedPaymentMethod === "card"
                              ? "font-semibold text-gray-900"
                              : "text-gray-600"
                          }
                        >
                          Card
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>

                {/* Selected summary */}
                {selectedBarber &&
                  selectedService &&
                  selectedDateTime &&
                  selectedDate && (
                    <View className="p-3 rounded-2xl bg-[#FFF9F0] border border-[#FF9500]/20">
                      <Text className="text-xs text-gray-600">
                        Selected Summary
                      </Text>
                      <Text className="font-semibold text-gray-900">
                        {selectedBarber.user_details?.name ||
                          selectedBarber.user_name}{" "}
                        • {selectedService.name}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {selectedService.duration_minutes} min • $
                        {selectedService.price}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {selectedDateTime}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        Payment:{" "}
                        {selectedPaymentMethod === "cash"
                          ? "💰 Cash"
                          : "💳 Card"}
                      </Text>
                    </View>
                  )}
              </View>
            </ScrollView>
          ) : (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator color="#FF9500" size="large" />
              <Text className="mt-3 text-gray-500 text-sm">
                Loading options...
              </Text>
            </View>
          )}

          {/* Dropdown Modals */}
          <DropdownModal
            visible={showServicePicker}
            onClose={() => setShowServicePicker(false)}
            title="Select Service"
          >
            {isLoadingServices ? (
              <ActivityIndicator
                color="#FF9500"
                size="large"
                className="py-8"
              />
            ) : isServicesError ? (
              <View className="py-8 items-center">
                <Text className="text-red-500">Failed to load services</Text>
                <Pressable onPress={() => refetchServices()} className="mt-2">
                  <Text className="text-[#FF9500]">Retry</Text>
                </Pressable>
              </View>
            ) : filteredServices.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-sm">
                  {selectedBarberId
                    ? "No services available for selected barber"
                    : "No services available"}
                </Text>
              </View>
            ) : (
              filteredServices.map((service) => {
                const isSelected =
                  String(service.id) === String(selectedServiceId);
                return (
                  <TouchableOpacity
                    key={String(service.id)}
                    className={`flex-row items-center justify-between px-4 py-3 border-b border-gray-100 ${
                      isSelected ? "bg-orange-50" : ""
                    }`}
                    onPress={() => handleSelectService(service)}
                  >
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 text-sm">
                        {service.name}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {service.duration_minutes} min • ${service.price}
                      </Text>
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
              })
            )}
          </DropdownModal>

          <DropdownModal
            visible={showBarberPicker}
            onClose={() => setShowBarberPicker(false)}
            title="Select Barber"
          >
            {isLoadingBarbers ? (
              <ActivityIndicator
                color="#FF9500"
                size="large"
                className="py-8"
              />
            ) : isBarbersError ? (
              <View className="py-8 items-center">
                <Text className="text-red-500">Failed to load barbers</Text>
                <Pressable onPress={() => refetchBarbers()} className="mt-2">
                  <Text className="text-[#FF9500]">Retry</Text>
                </Pressable>
              </View>
            ) : filteredBarbers.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-sm">
                  {selectedServiceId
                    ? "No barbers available for selected service"
                    : "No barbers available"}
                </Text>
              </View>
            ) : (
              filteredBarbers.map((barber) => {
                const isSelected =
                  String(barber.id) === String(selectedBarberId);
                const barberName =
                  barber.user_details?.name || barber.user_name || "Barber";
                const hasSelectedService = selectedServiceId
                  ? barber.assigned_services?.some(
                      (s) => String(s.id) === String(selectedServiceId),
                    )
                  : true;

                return (
                  <TouchableOpacity
                    key={String(barber.id)}
                    className={`flex-row items-center justify-between px-4 py-3 border-b border-gray-100 ${
                      isSelected ? "bg-orange-50" : ""
                    } ${!hasSelectedService ? "opacity-50" : ""}`}
                    onPress={() => {
                      if (hasSelectedService) {
                        handleSelectBarber(barber);
                      }
                    }}
                    disabled={!hasSelectedService}
                  >
                    <View className="flex-1">
                      <Text className="font-medium text-gray-900 text-sm">
                        {barberName}
                      </Text>
                      {barber.specialty && (
                        <Text className="text-gray-500 text-xs mt-0.5">
                          {barber.specialty}
                        </Text>
                      )}
                      {barber.assigned_services &&
                        barber.assigned_services.length > 0 && (
                          <Text className="text-gray-400 text-xs mt-0.5">
                            {barber.assigned_services.length} service
                            {barber.assigned_services.length > 1 ? "s" : ""}
                          </Text>
                        )}
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
              })
            )}
          </DropdownModal>

          {/* Date & Time Picker Modal */}
          <DateTimePickerModal />

          {/* Bottom Actions */}
          <View className="flex-row items-center gap-3 pt-3 border-t border-gray-100">
            <Pressable
              className="h-14 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 active:bg-gray-100"
              onPress={onBack}
            >
              <Text className="font-semibold text-base text-gray-700">
                Back
              </Text>
            </Pressable>
            <Pressable
              className={`h-14 flex-1 items-center justify-center rounded-2xl ${
                selectedBarberId &&
                selectedServiceId &&
                selectedDateTime &&
                selectedDate
                  ? "bg-[#FF9500] active:bg-[#e08300]"
                  : "bg-gray-300"
              }`}
              onPress={() => form.handleSubmit()}
              disabled={
                !selectedBarberId ||
                !selectedServiceId ||
                !selectedDateTime ||
                !selectedDate ||
                isLoading
              }
            >
              <Text className="font-bold text-base text-white">
                Next: Review
              </Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
