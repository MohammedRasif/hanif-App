import { Container } from "@/components/container";
import { ReviewsScreen } from "@/feature/admin/profile/reviews";
import React from "react";

export default function ReviewsRoute() {
  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ReviewsScreen />
    </Container>
  );
}
