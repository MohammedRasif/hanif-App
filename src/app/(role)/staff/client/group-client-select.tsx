import { GroupClientSelectView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export default function GroupClientSelect() {
  const router = useRouter();
  const { group, title } = useLocalSearchParams<{
    group?: "all" | "new";
    title?: string;
  }>();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <GroupClientSelectView
        filterGroup={group === "new" ? "new" : "all"}
        groupTitle={title}
        onBack={() => router.back()}
        onProceed={(selectedIds) => {
          console.log("Proceed with clients:", selectedIds);
          router.push("/(role)/staff/client/group-client-message-send");
        }}
      />
    </Container>
  );
}
