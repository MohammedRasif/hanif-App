import { Container } from "@/components/container";
import { ServiceSetupScreen } from "@/feature/admin/profile/service-setup";
import React from "react";

export default function ServiceSetupRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ServiceSetupScreen />
    </Container>
  );
}
