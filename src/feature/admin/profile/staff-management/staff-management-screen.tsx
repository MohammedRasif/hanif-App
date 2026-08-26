import { getUserData } from "@/lib/storage";
import { useGetBarbersByShopQuery } from "@/Redux/feature/shop";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { StaffFormView } from "./staff-form-view";
import { StaffListView } from "./staff-list-view";
import type { StaffManagementProps, StaffMemberItem } from "./types";

export function StaffManagementScreen({ onBack }: StaffManagementProps) {
  const router = useRouter();

  const userData = useMemo(() => getUserData(), []);
  const shopId = userData?.shops?.[0]?.id || 1;

  // 📡 GET /v1/barbers/?shop_id={shop_id}
  const {
    data: barbersResponse,
    isLoading: isBarbersLoading,
    refetch,
  } = useGetBarbersByShopQuery(shopId, { refetchOnMountOrArgChange: true });

  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [selectedStaff, setSelectedStaff] = useState<StaffMemberItem | null>(
    null,
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Transform API barbers data
  const staffList: StaffMemberItem[] = useMemo(() => {
    if (barbersResponse?.data && Array.isArray(barbersResponse.data)) {
      return barbersResponse.data.map((b: any) => ({
        id: String(b.id),
        name: b.user_details?.name || b.user_name || "Staff Member",
        email: b.user_details?.email || "",
        phone: b.user_details?.phone || "",
        countryCode: "+880",
        position: b.specialty || "Barber",
        role: (b.role || "staff") as any,
        calendarAccess: b.calendar_access ?? true,
        clientDetailsAccess: b.client_details_access ?? true,
        avatarUrl: b.user_details?.image || undefined,
        services: b.assigned_services?.map((s: any) => s.name) || [],
      }));
    }
    return [];
  }, [barbersResponse]);

  const handleBack = () => {
    if (currentView === "form") {
      setCurrentView("list");
      setSelectedStaff(null);
      refetch();
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
    setSelectedStaff(null); // Empty form for adding new staff
    setCurrentView("form");
  };

  const handleSaveStaff = async (_savedStaff: StaffMemberItem) => {
    setIsSyncing(true);
    setCurrentView("list");
    setSelectedStaff(null);
    try {
      await refetch();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteStaff = async (_staffId: string) => {
    setIsSyncing(true);
    setCurrentView("list");
    setSelectedStaff(null);
    try {
      await refetch();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {currentView === "list" ? (
        <StaffListView
          isLoading={isBarbersLoading || isSyncing}
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
