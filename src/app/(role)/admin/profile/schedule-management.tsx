import { Container } from "@/components/container";
import { ScheduleManagementScreen } from "@/feature/admin/profile/schedule-management";
import React from "react";

export default function ScheduleManagementRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ScheduleManagementScreen />
    </Container>
  );
}
