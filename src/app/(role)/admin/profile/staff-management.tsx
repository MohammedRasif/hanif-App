import { Container } from "@/components/container";
import { StaffManagementScreen } from "@/feature/admin/profile/staff-management";
import React from "react";

export default function StaffManagementRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <StaffManagementScreen />
    </Container>
  );
}
