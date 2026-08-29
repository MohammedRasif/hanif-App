import CustomCalendar from "@/lib/calender";
import { transformBookingCalendarView } from "@/lib/calender/api-transformer";
import type { Appointment } from "@/lib/calender/types";
import { getErrorMessage } from "@/lib/error-utils";
import { useGetProfileQuery } from "@/Redux/feature/auth";
import {
  formatCalendarDate,
  useCancelBookingByIdMutation,
  useCreateBookingMutation,
  useGetBookingBarbersQuery,
  useGetBookingCalendarViewQuery,
  useGetBookingDetailsQuery,
  useUpdateBookingByIdMutation,
  type BookingCalendarViewType,
} from "@/Redux/feature/bookingCalendarApi";
import { useToast } from "heroui-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { AddReservationDialog } from "./add-reservation-dialog";
import { AddTimeOffDialog } from "./add-time-off-dialog";
import { BookingCalendarMenu } from "./booking-calendar-menu";
import {
  BookAgainConfirmModal,
  BookAgainFormModal,
  CheckoutPageView,
} from "./booking-detail-modal";
import {
  BookingEditModal,
  type BookingEditPayload,
} from "./booking-edit-modal";
import { BookingListView, DEFAULT_BOOKING_GROUPS } from "./booking-list-view";
import {
  CheckoutPaymentPage,
  type CheckoutSubmitPayload,
} from "./checkout-payment-page";
import { ConfirmAddReservationDialog } from "./confirm-add-reservation-dialog";
import { ConfirmAlertDialog } from "./confirm-alert-dialog";
import { FinalAddReservationDialog } from "./final-add-reservation-dialog";
import { OrderCompletedPage } from "./order-completed-page";
import {
  StaffFilterBottomSheet,
  StaffWorkingHoursPage,
} from "./staff-filter-working-hours";

export interface BookingManagementCalendarProps {
  initialDateStr?: string;
  onBookingConfirmed?: (bookingData: any) => void;
  onTimeOffSaved?: (timeOffData: any) => void;
  viewType?: BookingCalendarViewType;
}

export function BookingManagementCalendar({
  initialDateStr,
  onBookingConfirmed,
  onTimeOffSaved,
  viewType = "admin",
}: BookingManagementCalendarProps) {
  const { toast } = useToast();

  const [selectedDateStr, setSelectedDateStr] = useState(
    initialDateStr || formatCalendarDate(),
  );
  const [currentViewMode, setCurrentViewMode] = useState<"calendar" | "list">(
    "calendar",
  );

  // Active shop of the logged-in user drives the shop_id query param
  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const shopId = profileResponse?.data?.active_shop?.id;

  // GET /v1/booking/?view_type=&shop_id=&date=&display_mode=calendar
  const {
    data: calendarResponse,
    isError: isCalendarError,
    isFetching: isCalendarFetching,
    refetch: refetchCalendar,
  } = useGetBookingCalendarViewQuery(
    {
      date: selectedDateStr,
      display_mode: "calendar",
      shop_id: shopId ?? "",
      view_type: viewType,
    },
    { skip: !shopId },
  );

  const calendar = useMemo(
    () => transformBookingCalendarView(calendarResponse?.data, selectedDateStr),
    [calendarResponse?.data, selectedDateStr],
  );

  // Staff filter: `null` keeps every barber visible (the default)
  const [selectedBarberIds, setSelectedBarberIds] = useState<null | string[]>(
    null,
  );

  const visibleBarbers = useMemo(() => {
    if (selectedBarberIds === null) return calendar.barbers;
    const selected = new Set(selectedBarberIds);
    return calendar.barbers.filter((barber) => selected.has(String(barber.id)));
  }, [calendar.barbers, selectedBarberIds]);

  const isCalendarBusy = isProfileLoading || isCalendarFetching;
  const isCalendarEmpty = !isCalendarBusy && visibleBarbers.length === 0;
  const isHiddenByFilter =
    isCalendarEmpty &&
    calendar.barbers.length > 0 &&
    selectedBarberIds !== null;

  // Staff Filter & Working Hours Flow States
  const [isStaffFilterOpen, setIsStaffFilterOpen] = useState(false);
  const [isWorkingHoursPageOpen, setIsWorkingHoursPageOpen] = useState(false);
  const [selectedStaffForHours, setSelectedStaffForHours] = useState<any>(null);

  // Dialog Visibility State for 3-Step Booking Flow
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);

  // Checkout & Book Again Flow States
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentPageOpen, setIsPaymentPageOpen] = useState(false);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isBookAgainFormOpen, setIsBookAgainFormOpen] = useState(false);
  const [isBookAgainConfirmOpen, setIsBookAgainConfirmOpen] = useState(false);
  const [bookAgainData, setBookAgainData] = useState<any>({});

  const [bookingAccumulator, setBookingAccumulator] = useState<any>({});

  // GET /v1/bookings/{id}/ — details for the appointment tapped in the grid
  const selectedBookingId = selectedAppointment?.bookingId;
  const {
    data: bookingDetailsResponse,
    isError: isBookingDetailsError,
    isFetching: isBookingDetailsFetching,
    refetch: refetchBookingDetails,
  } = useGetBookingDetailsQuery(selectedBookingId ?? "", {
    skip: !(isCheckoutOpen && selectedBookingId),
  });

  const booking = bookingDetailsResponse?.data;
  const firstBookingAppointment = booking?.appointments_details?.[0];

  // The assigned barber scopes the "Add item" service list and the edit search
  const activeBarberId =
    booking?.barber?.id ?? firstBookingAppointment?.barber?.id;

  // GET /v1/barbers/?shop={shop id} — staff filter + the edit-mode search
  const { data: barbersResponse, isFetching: isBarbersFetching } =
    useGetBookingBarbersQuery({ shop: shopId ?? "" }, { skip: !shopId });

  const barbers = useMemo(() => barbersResponse?.data ?? [], [barbersResponse]);

  const allBarberIds = useMemo(
    () => barbers.map((barber) => String(barber.id)),
    [barbers],
  );

  // Barbers the calendar returned a column for on the active date
  const calendarBarberIds = useMemo(
    () => calendar.barbers.map((barber) => String(barber.id)),
    [calendar.barbers],
  );

  // Create booking mutation
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();

  const [updateBooking, { isLoading: isUpdatingBooking }] =
    useUpdateBookingByIdMutation();
  const [cancelBooking, { isLoading: isCancellingBooking }] =
    useCancelBookingByIdMutation();

  const isBookingMutating = isUpdatingBooking || isCancellingBooking;
  const isBookingPaid =
    (booking?.payment_status ?? "").toLowerCase() === "paid";

  // Handle Clicking any Appointment in Calendar Grid
  const handlePressAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCheckoutOpen(true);
    setIsPaymentPageOpen(false);
    setIsOrderCompleted(false);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setIsPaymentPageOpen(false);
    setIsEditBookingOpen(false);
    setIsOrderCompleted(false);
    setSelectedAppointment(null);
  };

  // Handle Selecting Staff Member from Filter Bottom Sheet -> Open Working Hours Page
  const handleSelectStaffForHours = (staffItem: any) => {
    setSelectedStaffForHours(staffItem);
    setIsWorkingHoursPageOpen(true);
  };

  // Step 1 Submission -> Open Step 2
  const handleStep1Submit = (customerData: any) => {
    setBookingAccumulator((prev: any) => ({ ...prev, ...customerData }));
    setIsStep1Open(false);
    setIsStep2Open(true);
  };

  // Step 2 Submission -> Open Step 3
  const handleStep2Submit = (confirmData: any) => {
    setBookingAccumulator((prev: any) => ({ ...prev, ...confirmData }));
    setIsStep2Open(false);
    setIsStep3Open(true);
  };

  // Step 3 Submission -> Final Booking Confirmed
  const handleStep3Confirm = async (finalData: any) => {
    try {
      // Extract necessary data from finalData (which comes from bookingData in FinalAddReservationDialog)
      const {
        customerId,
        serviceId,
        barberId,
        appointment_date,
        startTime,
        payment_method,
        customerName,
        serviceName,
        barberName,
        price,
        serviceDuration,
      } = finalData;

      // Ensure appointment_date is in YYYY-MM-DD format
      let formattedDate = appointment_date;
      if (formattedDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(formattedDate)) {
          try {
            const parsedDate = new Date(formattedDate);
            if (!isNaN(parsedDate.getTime())) {
              formattedDate = parsedDate.toISOString().split("T")[0];
            } else {
              formattedDate = formatCalendarDate();
            }
          } catch (e) {
            formattedDate = formatCalendarDate();
          }
        }
      } else {
        formattedDate = formatCalendarDate();
      }

      // Ensure start_time is in HH:MM:SS format
      let formattedStartTime = startTime || "09:00:00";
      if (formattedStartTime && formattedStartTime.split(":").length === 2) {
        // If it's HH:MM format, add :00 for seconds
        formattedStartTime = `${formattedStartTime}:00`;
      } else if (formattedStartTime && !formattedStartTime.includes(":")) {
        // Try to parse it as a time
        try {
          const parsedTime = new Date(`2000-01-01T${formattedStartTime}`);
          if (!isNaN(parsedTime.getTime())) {
            formattedStartTime = parsedTime.toTimeString().split(" ")[0];
          } else {
            formattedStartTime = "09:00:00";
          }
        } catch (e) {
          formattedStartTime = "09:00:00";
        }
      }

      // Prepare payload for create booking
      const payload = {
        customer_id: customerId,
        shop: Number(shopId),
        barber: Number(barberId),
        services: [Number(serviceId)],
        appointment_date: formattedDate, // YYYY-MM-DD
        start_time: formattedStartTime, // HH:MM:SS
        payment_method: payment_method || "cash",
        tip_amount: 0,
      };

      console.log("Creating booking with payload:", payload);

      // Create the booking
      const response = await createBooking(payload).unwrap();

      if (response.success) {
        toast.show({
          label: "Successfully booked!",
          description: `Reservation for ${customerName || "Customer"} added to calendar.`,
          variant: "success",
          placement: "top",
        });
        onBookingConfirmed?.(response.data);
        setIsStep3Open(false);
        setBookingAccumulator({});
        // Refresh calendar to show new booking
        refetchCalendar();
      }
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      // Show more detailed error message
      const errorMessage =
        error?.data?.details ||
        error?.message ||
        "Failed to create the booking.";
      toast.show({
        label: "Booking failed",
        description: errorMessage,
        variant: "danger",
        placement: "top",
      });
    }
  };

  const handleSaveTimeOff = (data: {
    timeOffDuration: string;
    timeOffReason: string;
  }) => {
    toast.show({
      label: "Time off saved!",
      description: data.timeOffReason || "Time off added to schedule.",
      variant: "success",
      placement: "top",
    });
    onTimeOffSaved?.(data);
    setIsTimeOffDialogOpen(false);
  };

  // Cancel button -> confirm -> POST /v1/bookings/{id}/cancel/
  const handleConfirmCancelBooking = async () => {
    if (!selectedBookingId) return;
    try {
      await cancelBooking(selectedBookingId).unwrap();
      toast.show({
        label: "Order cancelled",
        description: "The booking has been cancelled.",
        variant: "danger",
        placement: "top",
      });
      setIsCancelAlertOpen(false);
      closeCheckout();
    } catch (error) {
      toast.show({
        label: "Couldn't cancel",
        description: getErrorMessage(error, "Failed to cancel the booking."),
        variant: "danger",
        placement: "top",
      });
    }
  };

  /**
   * Paid bookings are marked completed straight away and land on the
   * "Order completed" confirmation. Unpaid ones go through the checkout page
   * first so the tip, discount and payment type can be captured.
   */
  const handleCompleteOrder = async () => {
    if (!selectedBookingId) return;

    if (!isBookingPaid) {
      setIsPaymentPageOpen(true);
      return;
    }

    // PATCH /v1/bookings/{id}/ with status=completed (already-paid booking)
    try {
      await updateBooking({
        id: selectedBookingId,
        body: { status: "completed" },
      }).unwrap();
      setIsOrderCompleted(true);
    } catch (error) {
      toast.show({
        label: "Couldn't complete order",
        description: getErrorMessage(error, "Failed to complete the order."),
        variant: "danger",
        placement: "top",
      });
    }
  };

  // PATCH /v1/bookings/{id}/ with the checkout selections (unpaid booking)
  const handleCheckoutSubmit = async (payload: CheckoutSubmitPayload) => {
    if (!selectedBookingId) return;

    console.log(
      "selected booking id:",
      payload.discount.toFixed,
      // {
      //     discount: payload.discount.toFixed(2),
      //     payment_method: payload.paymentMethod,
      //     services: payload.serviceIds,
      //     status: "completed",
      //     tip_amount: payload.tipAmount.toFixed(2),
      //   }
    );

    try {
      await updateBooking({
        id: selectedBookingId,
        body: {
          discount: payload.discount.toFixed(2),
          payment_method: payload.paymentMethod,
          services: payload.serviceIds,
          status: "completed",
          tip_amount: payload.tipAmount.toFixed(2),
        },
      }).unwrap();
      setIsPaymentPageOpen(false);
      setIsOrderCompleted(true);
    } catch (error) {
      toast.show({
        label: "Checkout failed",
        description: getErrorMessage(error, "Failed to complete the payment."),
        variant: "danger",
        placement: "top",
      });
    }
  };

  // PATCH /v1/bookings/{id}/ with the new date, time and staff
  const handleSaveBookingEdit = async (payload: BookingEditPayload) => {
    if (!selectedBookingId) return;
    try {
      await updateBooking({
        id: selectedBookingId,
        body: {
          appointment_date: payload.appointmentDate,
          barber: payload.barberId,
          start_time: payload.startTime,
        },
      }).unwrap();
      toast.show({
        label: "Booking updated",
        description: "Date, time and staff have been saved.",
        variant: "success",
        placement: "top",
      });
      setIsEditBookingOpen(false);
    } catch (error) {
      toast.show({
        label: "Couldn't update booking",
        description: getErrorMessage(error, "Failed to update the booking."),
        variant: "danger",
        placement: "top",
      });
    }
  };

  // Handle Book Again Flow
  const handleDoneBookAgainForm = (formData: any) => {
    setBookAgainData(formData);
    setIsBookAgainConfirmOpen(true);
  };

  const handleConfirmBookAgain = () => {
    setIsBookAgainConfirmOpen(false);
    toast.show({
      label: "Successfully booked!",
      description: "New appointment has been created.",
      variant: "success",
      placement: "top",
    });
    onBookingConfirmed?.(bookAgainData);
  };

  // Render Dashboard Appointments List View (Image 1) when active
  if (currentViewMode === "list") {
    return (
      <BookingListView
        groups={DEFAULT_BOOKING_GROUPS}
        onSwitchToCalendar={() => setCurrentViewMode("calendar")}
      />
    );
  }

  // Render Staff Working Hours Page (Image 3) when active
  if (isWorkingHoursPageOpen) {
    return (
      <StaffWorkingHoursPage
        onBack={() => setIsWorkingHoursPageOpen(false)}
        onSaveAll={() => setIsWorkingHoursPageOpen(false)}
        staffName={selectedStaffForHours?.name || "Isaac"}
      />
    );
  }

  // Render the "Order completed" confirmation once a booking is marked complete
  if (isCheckoutOpen && isOrderCompleted) {
    return <OrderCompletedPage booking={booking} onDone={closeCheckout} />;
  }

  // Render the Checkout / payment page (unpaid "Complete order" path)
  if (isCheckoutOpen && isPaymentPageOpen && booking) {
    return (
      <CheckoutPaymentPage
        barberId={activeBarberId}
        booking={booking}
        isSubmitting={isUpdatingBooking}
        onBack={() => setIsPaymentPageOpen(false)}
        onSubmit={handleCheckoutSubmit}
        shopId={shopId}
      />
    );
  }

  // Render Full-Screen Booking Details Page when an appointment is selected
  if (isCheckoutOpen && selectedAppointment) {
    return (
      <View className="flex-1 bg-white">
        <CheckoutPageView
          appointment={selectedAppointment}
          booking={booking}
          isError={isBookingDetailsError}
          isLoading={isBookingDetailsFetching}
          isMutating={isBookingMutating}
          onBack={closeCheckout}
          onCancelBooking={() => setIsCancelAlertOpen(true)}
          onCompleteOrder={handleCompleteOrder}
          onEdit={() => setIsEditBookingOpen(true)}
          onOpenBookAgain={() => setIsBookAgainFormOpen(true)}
          onRetry={() => refetchBookingDetails()}
        />

        {/* Edit mode: date, time and staff (with barber search) */}
        {!!booking && (
          <BookingEditModal
            barbers={barbers}
            booking={booking}
            isLoadingBarbers={isBarbersFetching}
            isOpen={isEditBookingOpen}
            isSaving={isUpdatingBooking}
            onOpenChange={setIsEditBookingOpen}
            onSave={handleSaveBookingEdit}
          />
        )}

        {/* Cancel booking confirmation */}
        <ConfirmAlertDialog
          cancelLabel="Keep booking"
          confirmLabel="Yes, cancel"
          description="Cancelling frees up this slot and can't be undone."
          icon="alert-circle-outline"
          isConfirming={isCancellingBooking}
          isOpen={isCancelAlertOpen}
          onConfirm={handleConfirmCancelBooking}
          onOpenChange={setIsCancelAlertOpen}
          title="Cancel this booking?"
          tone="danger"
        />

        {/* Book Again Step 1: Form Popup Dialog (Image 3) */}
        <BookAgainFormModal
          isOpen={isBookAgainFormOpen}
          onDone={handleDoneBookAgainForm}
          onOpenChange={setIsBookAgainFormOpen}
        />

        {/* Book Again Step 2: Confirmation Summary Popup Dialog (Image 4) */}
        <BookAgainConfirmModal
          bookingData={bookAgainData}
          isOpen={isBookAgainConfirmOpen}
          onBack={() => {
            setIsBookAgainConfirmOpen(false);
            setIsBookAgainFormOpen(true);
          }}
          onConfirm={handleConfirmBookAgain}
          onOpenChange={setIsBookAgainConfirmOpen}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <CustomCalendar
        activeDateStr={selectedDateStr}
        appointments={calendar.appointments}
        barbers={visibleBarbers}
        blocks={calendar.blocks}
        endHour={calendar.endHour}
        onPressAppointment={handlePressAppointment}
        onPressFilter={() => setIsStaffFilterOpen(true)}
        onPressListView={() => setCurrentViewMode("list")}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
        startHour={calendar.startHour}
        workingHoursLabel={calendar.workingHoursLabel}
      >
        {/* Calendar Fetch States (overlaid so the date bar stays usable) */}
        {isCalendarBusy && (
          <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center bg-white/70">
            <ActivityIndicator color="#111827" size="large" />
          </View>
        )}

        {isCalendarError && !isCalendarBusy && (
          <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center gap-3 bg-white/90 px-8">
            <Text className="text-center font-semibold text-gray-900 text-sm">
              Couldn&apos;t load the calendar
            </Text>
            <Pressable
              className="rounded-full bg-black px-5 py-2.5 active:opacity-80"
              onPress={() => refetchCalendar()}
            >
              <Text className="font-semibold text-white text-xs">
                Try again
              </Text>
            </Pressable>
          </View>
        )}

        {isCalendarEmpty && !isCalendarError && (
          <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center gap-3 bg-white/90 px-8">
            <Text className="text-center text-gray-400 text-sm">
              {isHiddenByFilter
                ? "No staff selected in the filter."
                : shopId
                  ? "No staff scheduled for this date."
                  : "No shop assigned to your account yet."}
            </Text>
            {isHiddenByFilter && (
              <Pressable
                className="rounded-full bg-black px-5 py-2.5 active:opacity-80"
                onPress={() => setSelectedBarberIds(null)}
              >
                <Text className="font-semibold text-white text-xs">
                  Show all staff
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Floating Menu Action Overlay (kept above the state overlays) */}
        <BookingCalendarMenu
          onOpenReservationDialog={() => setIsStep1Open(true)}
          // onOpenTimeOffDialog={() => setIsTimeOffDialogOpen(true)}
        />

        {/* Staff Filter Bottom Sheet (Image 2) */}
        <StaffFilterBottomSheet
          barbers={barbers}
          isLoading={isBarbersFetching}
          isOpen={isStaffFilterOpen}
          onChangeSelected={setSelectedBarberIds}
          onOpenChange={setIsStaffFilterOpen}
          onSelectStaffHours={handleSelectStaffForHours}
          selectedIds={selectedBarberIds ?? allBarberIds}
          workingBarberIds={calendarBarberIds}
        />

        {/* Step 1: Customer Selection Modal */}
        <AddReservationDialog
          isOpen={isStep1Open}
          onOpenChange={setIsStep1Open}
          onSubmit={handleStep1Submit}
        />

        {/* Step 2: Service & Barber Selection Modal */}
        <ConfirmAddReservationDialog
          customerData={bookingAccumulator}
          isOpen={isStep2Open}
          onBack={() => {
            setIsStep2Open(false);
            setIsStep1Open(true);
          }}
          onOpenChange={setIsStep2Open}
          onSubmit={handleStep2Submit}
          shopId={shopId} // Pass shopId here
        />

        {/* Step 3: Final Booking Summary Modal */}
        <FinalAddReservationDialog
          bookingData={bookingAccumulator}
          isOpen={isStep3Open}
          onBack={() => {
            setIsStep3Open(false);
            setIsStep2Open(true);
          }}
          isConfirming={isCreatingBooking}
          onConfirm={handleStep3Confirm}
          onOpenChange={setIsStep3Open}
        />

        {/* HeroUI Native Time Off Modal */}
        <AddTimeOffDialog
          isOpen={isTimeOffDialogOpen}
          onOpenChange={setIsTimeOffDialogOpen}
          onSubmit={handleSaveTimeOff}
        />
      </CustomCalendar>
    </View>
  );
}

export default BookingManagementCalendar;
