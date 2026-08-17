import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";
import { View } from "react-native";
import { AddReservationDialog } from "./add-reservation-dialog";
import { AddTimeOffDialog } from "./add-time-off-dialog";
import { BookingCalendarMenu } from "./booking-calendar-menu";
import { ConfirmAddReservationDialog } from "./confirm-add-reservation-dialog";
import { FinalAddReservationDialog } from "./final-add-reservation-dialog";

export interface BookingManagementCalendarProps {
  initialDateStr?: string;
  onBookingConfirmed?: (bookingData: any) => void;
  onTimeOffSaved?: (timeOffData: any) => void;
}

export function BookingManagementCalendar({
  initialDateStr = "2026-07-18",
  onBookingConfirmed,
  onTimeOffSaved,
}: BookingManagementCalendarProps) {
  const [selectedDateStr, setSelectedDateStr] = useState(initialDateStr);

  // Dialog Visibility State for 3-Step Booking Flow
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);

  const [bookingAccumulator, setBookingAccumulator] = useState<any>({});

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
    console.log("Final Booking Confirmed:", finalData);
    onBookingConfirmed?.(finalData);
    setIsStep3Open(false);
    setBookingAccumulator({});
  };

  const handleSaveTimeOff = (data: {
    timeOffDuration: string;
    timeOffReason: string;
  }) => {
    console.log("Time Off Submitted:", data);
    onTimeOffSaved?.(data);
    setIsTimeOffDialogOpen(false);
  };

  return (
    <View className="flex-1 bg-white">
      <CustomCalendar
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      >
        {/* Floating Menu Action Overlay */}
        <BookingCalendarMenu
          onOpenReservationDialog={() => setIsStep1Open(true)}
          onOpenTimeOffDialog={() => setIsTimeOffDialogOpen(true)}
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
