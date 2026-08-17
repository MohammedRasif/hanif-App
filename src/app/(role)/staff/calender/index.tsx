import { Container } from "@/components/container";
import {
  AddReservationDialog,
  AddTimeOffDialog,
  ConfirmAddReservationDialog,
  FinalAddReservationDialog,
  StaffCalendarMenu,
} from "@/feature/staff/calendar";
import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";

export default function CalenderIndex() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

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
    setIsStep3Open(false);
    setBookingAccumulator({});
  };

  const handleSaveTimeOff = (data: {
    timeOffDuration: string;
    timeOffReason: string;
  }) => {
    console.log("Time Off Submitted:", data);
    setIsTimeOffDialogOpen(false);
  };

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <CustomCalendar
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      >
        {/* Floating Menu Action Overlay */}
        <StaffCalendarMenu
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
    </Container>
  );
}
