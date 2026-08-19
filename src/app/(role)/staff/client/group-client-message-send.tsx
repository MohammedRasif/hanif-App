import { GroupClientMessageView } from "@/components/client-management";
import { Container } from "@/components/container";
import { useRouter } from "expo-router";
import React from "react";

export default function GroupClientMessageSend() {
  const router = useRouter();

  return (
    <Container className="bg-white flex-1" isScrollable={false}>
      <GroupClientMessageView
        buttonText="Create message to 233 clint"
        onBack={() => router.back()}
        onSubmit={() => {
          console.log("Create message clicked");
          router.push("/(role)/staff/client/group-client-message");
        }}
      />
    </Container>
  );
}
