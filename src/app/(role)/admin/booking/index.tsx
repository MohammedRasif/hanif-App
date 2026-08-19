import { BookingManagementCalendar } from "@/components/booking-management-calender";
import { Container } from "@/components/container";
import React from "react";

export default function AdminBookingScreen() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <BookingManagementCalendar />
    </Container>
  );
}
