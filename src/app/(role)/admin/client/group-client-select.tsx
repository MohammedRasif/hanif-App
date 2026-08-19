import { GroupClientSelectView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useRouter } from "expo-router";
import React from "react";

export default function AdminGroupClientSelect() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <GroupClientSelectView
        onBack={() => router.back()}
        onProceed={(selectedIds) => {
          console.log("Admin proceed with clients:", selectedIds);
          router.push("/(role)/admin/client/group-client-message-send");
        }}
      />
    </Container>
  );
}
