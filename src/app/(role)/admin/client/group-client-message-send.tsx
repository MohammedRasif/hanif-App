import { GroupClientMessageView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useRouter } from "expo-router";
import React from "react";

export default function AdminGroupClientMessageSend() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <GroupClientMessageView
        buttonText="Create message to 233 clint"
        onBack={() => router.back()}
        onSubmit={() => {
          console.log("Admin create message clicked");
          router.push("/(role)/admin/client/group-client-message");
        }}
      />
    </Container>
  );
}
