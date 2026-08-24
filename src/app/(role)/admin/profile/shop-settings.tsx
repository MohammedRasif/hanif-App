import { Container } from "@/components/container";
import { ShopSettingsScreen } from "@/feature/admin/profile/shop-settings";
import React from "react";

export default function ShopSettingsRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ShopSettingsScreen />
    </Container>
  );
}
