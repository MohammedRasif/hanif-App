import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { BusinessHoursView } from "./business-hours-view";
import { OpeningCalendarView } from "./opening-calendar-view";
import { ScheduleMenuView } from "./schedule-menu-view";
import { StaffTimeOffView } from "./staff-time-off-view";
import { StaffWorkingHoursView } from "./staff-working-hours-view";
import type { ScheduleManagementProps, ScheduleSubPage } from "./types";

export function ScheduleManagementScreen({
  onBack,
  initialPage = "menu",
}: ScheduleManagementProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<ScheduleSubPage>(initialPage);

  const handleBack = () => {
    if (currentPage !== "menu") {
      setCurrentPage("menu");
    } else {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    }
  };

  const handleNavigate = (page: ScheduleSubPage) => {
    setCurrentPage(page);
  };

  return (
    <View className="flex-1 bg-white">
      {currentPage === "menu" ? (
        <ScheduleMenuView onBack={handleBack} onNavigate={handleNavigate} />
      ) : currentPage === "opening-calendar" ? (
        <OpeningCalendarView
          onBack={handleBack}
          onNavigateToBusinessHours={() => handleNavigate("business-hours")}
          onNavigateToShift={() => handleNavigate("staff-working-hours")}
          onNavigateToTimeOff={() => handleNavigate("staff-time-off")}
        />
      ) : currentPage === "staff-time-off" ? (
        <StaffTimeOffView onBack={handleBack} />
      ) : currentPage === "business-hours" ? (
        <BusinessHoursView onBack={handleBack} />
      ) : currentPage === "staff-working-hours" ? (
        <StaffWorkingHoursView onBack={handleBack} />
      ) : (
        <ScheduleMenuView onBack={handleBack} onNavigate={handleNavigate} />
      )}
    </View>
  );
}
