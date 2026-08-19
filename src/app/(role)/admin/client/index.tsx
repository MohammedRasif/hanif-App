import { ClientListView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useRouter } from "expo-router";
import React from "react";

export default function AdminClientScreen() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ClientListView
        onPressAdd={() => console.log("Admin add new client clicked")}
        onSelectGroup={() =>
          router.push("/(role)/admin/client/group-client-select")
        }
      />
    </Container>
  );
}
