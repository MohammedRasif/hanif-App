import { ClientListView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useRouter, type Href } from "expo-router";
import React from "react";

export default function StaffClientScreen() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <ClientListView
        onPressAdd={() => console.log("Add new client clicked")}
        onSelectGroup={(group) => {
          const groupKey = (group as any).key || group.id || "all";
          router.push({
            pathname: "/(role)/staff/client/group-client-select",
            params: {
              group: groupKey,
              title: group.title,
            },
          } as Href);
        }}
      />
    </Container>
  );
}
