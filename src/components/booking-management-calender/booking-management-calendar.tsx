import CustomCalendar, {
  DEFAULT_APPOINTMENTS,
  DEFAULT_BARBERS,
} from "@/lib/calender";
import type { Appointment } from "@/lib/calender/types";
import { useToast } from "heroui-native";
import React, { useState } from "react";
import { View } from "react-native";
import { AddReservationDialog } from "./add-reservation-dialog";
import { AddTimeOffDialog } from "./add-time-off-dialog";
import { BookingCalendarMenu } from "./booking-calendar-menu";
import {
  BookAgainConfirmModal,
  BookAgainFormModal,
  CheckoutPageView,
} from "./booking-detail-modal";
import { BookingListView, DEFAULT_BOOKING_GROUPS } from "./booking-list-view";
import { ConfirmAddReservationDialog } from "./confirm-add-reservation-dialog";
import { FinalAddReservationDialog } from "./final-add-reservation-dialog";
import {
  StaffFilterBottomSheet,
  StaffWorkingHoursPage,
} from "./staff-filter-working-hours";

export interface BookingManagementCalendarProps {
  initialDateStr?: string;
  onBookingConfirmed?: (bookingData: any) => void;
  onTimeOffSaved?: (timeOffData: any) => void;
}

export function BookingManagementCalendar({
  initialDateStr,
  onBookingConfirmed,
  onTimeOffSaved,
}: BookingManagementCalendarProps) {
  const { toast } = useToast();

  const [selectedDateStr, setSelectedDateStr] = useState(
    initialDateStr || "2026-07-18",
  );
  const [currentViewMode, setCurrentViewMode] = useState<"calendar" | "list">(
    "calendar",
  );

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
  const [isBookAgainFormOpen, setIsBookAgainFormOpen] = useState(false);
  const [isBookAgainConfirmOpen, setIsBookAgainConfirmOpen] = useState(false);
  const [bookAgainData, setBookAgainData] = useState<any>({});

  const [bookingAccumulator, setBookingAccumulator] = useState<any>({});

  // Handle Clicking any Appointment in Calendar Grid
  const handlePressAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCheckoutOpen(true);
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
  const handleStep3Confirm = (finalData: any) => {
    toast.show({
      label: "Successfully booked!",
      description: "Reservation added to calendar.",
      variant: "success",
      placement: "top",
    });
    onBookingConfirmed?.(finalData);
    setIsStep3Open(false);
    setBookingAccumulator({});
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

  // Handle Unpaid Actions
  const handleCancelUnpaid = () => {
    toast.show({
      label: "Order cancelled",
      description: "The unpaid booking has been cancelled.",
      variant: "danger",
      placement: "top",
    });
    setIsCheckoutOpen(false);
  };

  const handleCompleteOrder = () => {
    if (selectedAppointment) {
      (selectedAppointment as any).status = "completed";
      (selectedAppointment as any).isPaid = true;
      (selectedAppointment as any).paymentStatus = "Paid";
    }
    toast.show({
      label: "Payment completed!",
      description: "Order marked as paid successfully.",
      variant: "success",
      placement: "top",
    });
    setIsCheckoutOpen(false);
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

  // Render Full-Screen Checkout Page (Image 1-5) when an appointment is selected
  if (isCheckoutOpen && selectedAppointment) {
    return (
      <View className="flex-1 bg-white">
        <CheckoutPageView
          appointment={selectedAppointment}
          onBack={() => setIsCheckoutOpen(false)}
          onCancelUnpaid={handleCancelUnpaid}
          onCompleteOrder={handleCompleteOrder}
          onOpenBookAgain={() => setIsBookAgainFormOpen(true)}
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
        appointments={DEFAULT_APPOINTMENTS}
        barbers={DEFAULT_BARBERS}
        onPressAppointment={handlePressAppointment}
        onPressFilter={() => setIsStaffFilterOpen(true)}
        onPressListView={() => setCurrentViewMode("list")}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      >
        {/* Floating Menu Action Overlay */}
        <BookingCalendarMenu
          onOpenReservationDialog={() => setIsStep1Open(true)}
          onOpenTimeOffDialog={() => setIsTimeOffDialogOpen(true)}
        />

        {/* Staff Filter Bottom Sheet (Image 2) */}
        <StaffFilterBottomSheet
          isOpen={isStaffFilterOpen}
          onOpenChange={setIsStaffFilterOpen}
          onSelectStaffHours={handleSelectStaffForHours}
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
        />

        {/* Step 3: Final Booking Summary Modal */}
        <FinalAddReservationDialog
          bookingData={bookingAccumulator}
          isOpen={isStep3Open}
          onBack={() => {
            setIsStep3Open(false);
            setIsStep2Open(true);
          }}
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
