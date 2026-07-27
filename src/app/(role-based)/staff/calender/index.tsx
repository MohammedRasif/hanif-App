import { Container } from "@/components/container";
import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";
import {
  AddReservationDialog,
  AddTimeOffDialog,
  StaffCalendarMenu,
} from "../components";

export default function CalenderIndex() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  // Dialog Visibility State
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);

  const handleSaveReservation = (data: {
    clientName: string;
    serviceName: string;
  }) => {
    console.log("New Reservation Submitted:", data);
    setIsReservationDialogOpen(false);
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
          onOpenReservationDialog={() => setIsReservationDialogOpen(true)}
          onOpenTimeOffDialog={() => setIsTimeOffDialogOpen(true)}
        />

        {/* HeroUI Native Reservation Modal */}
        <AddReservationDialog
          isOpen={isReservationDialogOpen}
          onOpenChange={setIsReservationDialogOpen}
          onSubmit={handleSaveReservation}
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
