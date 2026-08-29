import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import {
  useGetBookingServicesQuery,
  type BookingDetailsData,
  type BookingPaymentMethod,
  type BookingServiceOption,
} from "@/Redux/feature/bookingCalendarApi";
import { Dialog } from "heroui-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  appointmentDurationMinutes,
  formatAppointmentWhen,
  formatDurationLabel,
  formatMoney,
  formatMoneyShort,
  TIP_PRESETS,
  toAmount,
} from "./checkout-utils";

export interface CheckoutSubmitPayload {
  discount: number;
  paymentMethod: BookingPaymentMethod;
  /** Existing service ids plus everything picked through "Add item". */
  serviceIds: Array<number | string>;
  tipAmount: number;
}

type PaymentOption = {
  icon: "card-outline" | "cash-outline";
  label: string;
  value: BookingPaymentMethod;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  { icon: "card-outline", label: "Online pay", value: "online" },
  { icon: "cash-outline", label: "Cash", value: "cash" },
];

type CheckoutPaymentPageProps = {
  /** Drives the `barber` param when loading the "Add item" service list. */
  barberId?: null | number | string;
  booking: BookingDetailsData;
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: (payload: CheckoutSubmitPayload) => void;
  shopId?: null | number | string;
};

export function CheckoutPaymentPage({
  barberId,
  booking,
  isSubmitting = false,
  onBack,
  onSubmit,
  shopId,
}: CheckoutPaymentPageProps) {
  const [addedItems, setAddedItems] = useState<BookingServiceOption[]>([]);
  const [discountText, setDiscountText] = useState("");
  const [tipText, setTipText] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<BookingPaymentMethod | null>(null);
  const [showPaymentError, setShowPaymentError] = useState(false);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  // Only the selected barber's services are offered, so load them lazily
  const { data: servicesResponse, isFetching: isServicesFetching } =
    useGetBookingServicesQuery(
      { barber: barberId ?? undefined, shop: shopId ?? "" },
      { skip: !(isAddItemOpen && shopId) },
    );

  // Every booked service row across every appointment
  const bookedServices = useMemo(
    () =>
      (booking.appointments_details ?? []).flatMap((appointment) =>
        appointment.services.map((service) => ({
          ...service,
          appointmentDate: appointment.appointment_date,
        })),
      ),
    [booking.appointments_details],
  );

  const bookedServiceIds = useMemo(
    () => bookedServices.map((service) => service.service_id),
    [bookedServices],
  );

  const baseSubtotal = bookedServices.reduce(
    (sum, service) => sum + toAmount(service.price),
    0,
  );
  const addedSubtotal = addedItems.reduce(
    (sum, item) => sum + toAmount(item.price),
    0,
  );
  const subtotal = baseSubtotal + addedSubtotal;

  const discount = Math.min(Math.max(toAmount(discountText), 0), subtotal);
  const discountPercent =
    subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;
  const tipAmount = Math.max(toAmount(tipText), 0);
  const total = subtotal - discount + tipAmount;

  const selectedTipPreset = TIP_PRESETS.find(
    (preset) => `${preset}` === tipText.trim(),
  );

  const handleSelectTip = (preset: number) => {
    setTipText(selectedTipPreset === preset ? "" : `${preset}`);
  };

  const handleRemoveAddedItem = (serviceId: number | string) => {
    setAddedItems((prev) =>
      prev.filter((item) => String(item.id) !== String(serviceId)),
    );
  };

  const handleCheckout = () => {
    if (!paymentMethod) {
      setShowPaymentError(true);
      return;
    }
    setShowPaymentError(false);
    onSubmit({
      discount,
      paymentMethod,
      serviceIds: [...bookedServiceIds, ...addedItems.map((item) => item.id)],
      tipAmount,
    });
  };

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* Page Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 pt-12 pb-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={onBack}
        >
          <StyledIcons className="text-gray-900" name="arrow-back" size={24} />
        </Pressable>
        <Text className="font-bold text-gray-900 text-xl">Checkout</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pre-selected services from the booking */}
        {bookedServices.map((service) => (
          <View
            className="mb-3 flex-row items-start justify-between rounded-3xl border border-gray-100 bg-main-bg-overlay p-4"
            key={String(service.id)}
          >
            <View className="flex-1 pr-3">
              <Text
                className="font-bold text-base text-gray-900"
                numberOfLines={1}
              >
                {service.service_name}
              </Text>
              <Text className="mt-1 text-gray-400 text-xs">
                {formatAppointmentWhen({
                  appointment_date: service.appointmentDate,
                  start_time: service.start_time,
                })}
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-bold text-base text-gray-900">
                {formatMoney(service.price)}
              </Text>
              <Text className="mt-1 text-gray-400 text-xs">
                {formatDurationLabel(appointmentDurationMinutes(service))}
              </Text>
            </View>
          </View>
        ))}

        {/* Services picked through "Add item" */}
        {addedItems.length > 0 && (
          <View className="mt-2 mb-1">
            <Text className="mb-2 font-bold text-gray-900 text-sm">
              New added
            </Text>
            {addedItems.map((item) => (
              <View
                className="mb-3 flex-row items-center justify-between rounded-3xl border border-[#FF9500]/30 bg-[#FF9500]/5 p-4"
                key={String(item.id)}
              >
                <View className="flex-1 pr-3">
                  <Text
                    className="font-bold text-base text-gray-900"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="mt-1 text-gray-400 text-xs">
                    {formatDurationLabel(item.duration_minutes) || "Added item"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="font-bold text-base text-gray-900">
                    {formatMoney(item.price)}
                  </Text>
                  <Pressable
                    className="h-7 w-7 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                    onPress={() => handleRemoveAddedItem(item.id)}
                  >
                    <StyledIcons
                      className="text-gray-600"
                      name="close"
                      size={16}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Discount summary card */}
        {discount > 0 && (
          <View className="mb-3 flex-row items-start justify-between rounded-3xl border border-gray-100 bg-main-bg-overlay p-4">
            <Text className="font-bold text-base text-gray-900">Discount</Text>
            <View className="items-end">
              <Text className="font-bold text-base text-gray-900">
                -{formatMoney(discount)}
              </Text>
              <Text className="mt-1 text-gray-400 text-xs">
                {discountPercent}%
              </Text>
            </View>
          </View>
        )}

        {/* Add item / Discount actions */}
        <View className="mt-1 mb-6 flex-row items-center gap-3">
          <Pressable
            className="h-12 flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
            onPress={() => setIsAddItemOpen(true)}
          >
            <StyledIcons className="text-gray-900" name="add" size={18} />
            <Text className="font-semibold text-gray-900 text-sm">
              Add item
            </Text>
          </Pressable>

          <Pressable
            className="h-12 flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
            onPress={() => setIsDiscountOpen(true)}
          >
            <StyledIcons
              className="text-gray-900"
              name="pricetag-outline"
              size={16}
            />
            <Text className="font-semibold text-gray-900 text-sm">
              Discount
            </Text>
          </Pressable>
        </View>

        {/* Tip presets (optional) */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center gap-2">
            <Text className="font-bold text-gray-900 text-lg">Tip</Text>
            <Text className="text-gray-400 text-xs">(optional)</Text>
          </View>
          <View className="flex-row flex-wrap gap-2.5">
            {TIP_PRESETS.map((preset) => {
              const isSelected = selectedTipPreset === preset;
              return (
                <Pressable
                  className={`h-11 min-w-[68px] items-center justify-center rounded-2xl border px-4 ${
                    isSelected
                      ? "border-[#FF9500] bg-[#FF9500]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                  key={preset}
                  onPress={() => handleSelectTip(preset)}
                >
                  <Text
                    className={`font-bold text-sm ${
                      isSelected ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ${preset}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Payment type (mandatory) */}
        <View className="mb-4">
          <View className="mb-3 flex-row items-center gap-1">
            <Text className="font-bold text-gray-900 text-lg">
              Payment type
            </Text>
            <Text className="font-bold text-[#FF3B30] text-lg">*</Text>
          </View>
          <View className="flex-row gap-2.5">
            {PAYMENT_OPTIONS.map((option) => {
              const isSelected = paymentMethod === option.value;
              return (
                <Pressable
                  className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border px-4 ${
                    isSelected
                      ? "border-[#FF9500] bg-[#FF9500]"
                      : "border-gray-200 bg-white active:bg-gray-50"
                  }`}
                  key={option.value}
                  onPress={() => {
                    setPaymentMethod(option.value);
                    setShowPaymentError(false);
                  }}
                >
                  <StyledIcons
                    className={isSelected ? "text-white" : "text-gray-700"}
                    name={option.icon}
                    size={18}
                  />
                  <Text
                    className={`font-semibold text-sm ${
                      isSelected ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {showPaymentError && (
            <Text className="mt-2 text-[#FF3B30] text-xs">
              Select a payment type to continue.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Pinned Tip / Total / Checkout bar */}
      <View className="border-t border-gray-100 bg-white px-5 pt-3 pb-8">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Text className="font-semibold text-base text-gray-900">Tip</Text>
            <View className="h-11 w-24 justify-center rounded-2xl border border-gray-200 bg-white px-3">
              <TextInput
                className="text-gray-900 text-sm"
                inputMode="decimal"
                keyboardType="decimal-pad"
                onChangeText={setTipText}
                placeholder="$00"
                placeholderTextColor="#9CA3AF"
                value={tipText}
              />
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="font-semibold text-base text-gray-500">Total</Text>
            <Text className="font-bold text-gray-900 text-xl">
              {formatMoneyShort(total)}
            </Text>
          </View>
        </View>

        <Pressable
          className={`h-14 w-full flex-row items-center justify-center gap-2 rounded-2xl shadow-md ${
            isSubmitting
              ? "bg-[#FF9500]/60"
              : "bg-[#FF9500] active:bg-[#e08300]"
          }`}
          disabled={isSubmitting}
          onPress={handleCheckout}
        >
          {isSubmitting && <ActivityIndicator color="#FFFFFF" size="small" />}
          <Text className="font-bold text-base text-white">Checkout</Text>
        </Pressable>
      </View>

      {/* Add item: multi-select list of the selected barber's services */}
      <AddItemModal
        addedItems={addedItems}
        bookedServiceIds={bookedServiceIds}
        isLoading={isServicesFetching}
        isOpen={isAddItemOpen}
        onConfirm={(items) => {
          setAddedItems(items);
          setIsAddItemOpen(false);
        }}
        onOpenChange={setIsAddItemOpen}
        services={servicesResponse?.data ?? []}
      />

      {/* Discount: single number field */}
      <DiscountModal
        isOpen={isDiscountOpen}
        maxDiscount={subtotal}
        onApply={(value) => {
          setDiscountText(value);
          setIsDiscountOpen(false);
        }}
        onOpenChange={setIsDiscountOpen}
        value={discountText}
      />
    </Container>
  );
}

type AddItemModalProps = {
  addedItems: BookingServiceOption[];
  /** Services already on the booking are not offered again. */
  bookedServiceIds: Array<number | string>;
  isLoading?: boolean;
  isOpen: boolean;
  onConfirm: (items: BookingServiceOption[]) => void;
  onOpenChange: (open: boolean) => void;
  services: BookingServiceOption[];
};

function AddItemModal({
  addedItems,
  bookedServiceIds,
  isLoading = false,
  isOpen,
  onConfirm,
  onOpenChange,
  services,
}: AddItemModalProps) {
  const [draftIds, setDraftIds] = useState<string[]>(() =>
    addedItems.map((item) => String(item.id)),
  );

  // Re-sync the draft each time the sheet opens
  useEffect(() => {
    if (isOpen) setDraftIds(addedItems.map((item) => String(item.id)));
  }, [isOpen, addedItems]);

  const bookedIds = useMemo(
    () => new Set(bookedServiceIds.map((id) => String(id))),
    [bookedServiceIds],
  );

  const selectableServices = useMemo(
    () => services.filter((service) => !bookedIds.has(String(service.id))),
    [services, bookedIds],
  );

  const toggle = (serviceId: string) => {
    setDraftIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleConfirm = () => {
    const picked = selectableServices.filter((service) =>
      draftIds.includes(String(service.id)),
    );
    onConfirm(picked);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          <Dialog.Title className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
            Add item
          </Dialog.Title>
          <Text className="mb-4 text-gray-500 text-sm">
            Pick the services this staff member will add.
          </Text>

          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator color="#111827" size="small" />
            </View>
          ) : selectableServices.length === 0 ? (
            <Text className="py-8 text-center text-gray-400 text-sm">
              No other services assigned to this staff member.
            </Text>
          ) : (
            <ScrollView
              className="mb-5 max-h-72"
              showsVerticalScrollIndicator={false}
            >
              {selectableServices.map((service) => {
                const serviceId = String(service.id);
                const isSelected = draftIds.includes(serviceId);
                return (
                  <Pressable
                    className={`mb-2.5 flex-row items-center justify-between rounded-2xl border p-3.5 ${
                      isSelected
                        ? "border-[#FF9500] bg-[#FF9500]/5"
                        : "border-gray-200 bg-white active:bg-gray-50"
                    }`}
                    key={serviceId}
                    onPress={() => toggle(serviceId)}
                  >
                    <View className="flex-1 flex-row items-center gap-3">
                      <View
                        className={`h-5 w-5 items-center justify-center rounded-md border ${
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
                      <View className="flex-1">
                        <Text
                          className="font-semibold text-gray-900 text-sm"
                          numberOfLines={1}
                        >
                          {service.name}
                        </Text>
                        {!!service.duration_minutes && (
                          <Text className="text-gray-400 text-xs">
                            {formatDurationLabel(service.duration_minutes)}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text className="font-bold text-gray-900 text-sm">
                      {formatMoney(service.price)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View className="flex-row items-center gap-3">
            <Pressable
              className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
              onPress={() => onOpenChange(false)}
            >
              <Text className="font-semibold text-base text-gray-700">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              className="h-13 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={handleConfirm}
            >
              <Text className="font-bold text-base text-white">
                {draftIds.length > 0 ? `Add (${draftIds.length})` : "Add"}
              </Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

type DiscountModalProps = {
  isOpen: boolean;
  maxDiscount: number;
  onApply: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  value: string;
};

function DiscountModal({
  isOpen,
  maxDiscount,
  onApply,
  onOpenChange,
  value,
}: DiscountModalProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (isOpen) setDraft(value);
  }, [isOpen, value]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60" />
        <Dialog.Content className="w-[94%] max-w-sm rounded-4xl bg-white p-6 shadow-2xl">
          <Dialog.Title className="mb-1 font-bold text-2xl text-gray-900 tracking-tight">
            Discount
          </Dialog.Title>
          <Text className="mb-4 text-gray-500 text-sm">
            Enter the amount to take off this order.
          </Text>

          <View className="mb-2 h-13 flex-row items-center rounded-2xl border border-gray-200 bg-white px-4">
            <Text className="mr-1 font-semibold text-base text-gray-500">
              $
            </Text>
            <TextInput
              autoFocus
              className="flex-1 text-base text-gray-900"
              inputMode="decimal"
              keyboardType="decimal-pad"
              onChangeText={setDraft}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              value={draft}
            />
          </View>
          <Text className="mb-5 text-gray-400 text-xs">
            Max {formatMoney(maxDiscount)}
          </Text>

          <View className="flex-row items-center gap-3">
            <Pressable
              className="h-13 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white active:bg-gray-50"
              onPress={() => {
                onApply("");
                onOpenChange(false);
              }}
            >
              <Text className="font-semibold text-base text-gray-700">
                Remove
              </Text>
            </Pressable>
            <Pressable
              className="h-13 flex-1 items-center justify-center rounded-2xl bg-[#FF9500] active:bg-[#e08300]"
              onPress={() => onApply(draft)}
            >
              <Text className="font-bold text-base text-white">Apply</Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default CheckoutPaymentPage;
