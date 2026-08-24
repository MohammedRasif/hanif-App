import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { MOCK_STAFF_MEMBERS } from "./mock-data";
import { StaffFormView } from "./staff-form-view";
import { StaffListView } from "./staff-list-view";
import type { StaffManagementProps, StaffMemberItem } from "./types";

export function StaffManagementScreen({ onBack }: StaffManagementProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [staffList, setStaffList] =
    useState<StaffMemberItem[]>(MOCK_STAFF_MEMBERS);
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberItem | null>(
    null,
  );

  const handleBack = () => {
    if (currentView === "form") {
      setCurrentView("list");
      setSelectedStaff(null);
    } else {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    }
  };

  const handleSelectStaff = (staff: StaffMemberItem) => {
    setSelectedStaff(staff);
    setCurrentView("form");
  };

  const handleAddNewStaff = () => {
    setSelectedStaff({
      id: Date.now().toString(),
      name: "",
      email: "",
      role: "Staff",
      calendarAccess: true,
      clientDetailsAccess: true,
      countryCode: "+44",
      phone: "",
      position: "",
      services: ["Face wash"],
    });
    setCurrentView("form");
  };

  const handleSaveStaff = (savedStaff: StaffMemberItem) => {
    setStaffList((prev) => {
      const exists = prev.some((s) => s.id === savedStaff.id);
      if (exists) {
        return prev.map((s) => (s.id === savedStaff.id ? savedStaff : s));
      }
      return [savedStaff, ...prev];
    });
    setCurrentView("list");
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    setCurrentView("list");
    setSelectedStaff(null);
  };

  return (
    <View className="flex-1 bg-white">
      {currentView === "list" ? (
        <StaffListView
          onAddNewStaff={handleAddNewStaff}
          onBack={handleBack}
          onSelectStaff={handleSelectStaff}
          staffList={staffList}
        />
      ) : (
        <StaffFormView
          onBack={handleBack}
          onDelete={handleDeleteStaff}
          onSave={handleSaveStaff}
          staff={selectedStaff}
        />
      )}
    </View>
  );
}
