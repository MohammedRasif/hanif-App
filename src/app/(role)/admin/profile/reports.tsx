import { Container } from "@/components/container";
import { ReportsScreen } from "@/feature/admin/profile/reports";
import React from "react";

export default function ReportsRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ReportsScreen />
    </Container>
  );
}
