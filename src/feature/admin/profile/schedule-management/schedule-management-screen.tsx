import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { AddBusinessDaysOffView } from "./add-business-days-off-view";
import { AddStaffTimeOffView } from "./add-staff-time-off-view";
import { BusinessHoursView } from "./business-hours-view";
import { OpeningCalendarView } from "./opening-calendar-view";
import { ScheduleMenuView } from "./schedule-menu-view";
import { ShiftView } from "./shift-view";
import { StaffTimeOffView } from "./staff-time-off-view";
import { StaffWorkingHoursView } from "./staff-working-hours-view";
import type { ScheduleManagementProps, ScheduleSubPage } from "./types";

export function ScheduleManagementScreen({
  onBack,
  initialPage = "menu",
}: ScheduleManagementProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<ScheduleSubPage>(initialPage);
  const [navigationHistory, setNavigationHistory] = useState<ScheduleSubPage[]>(
    [initialPage],
  );

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const nextHistory = [...navigationHistory];
      nextHistory.pop();
      const prevPage = nextHistory[nextHistory.length - 1] || "menu";
      setNavigationHistory(nextHistory);
      setCurrentPage(prevPage);
    } else if (currentPage !== "menu") {
      setCurrentPage("menu");
      setNavigationHistory(["menu"]);
    } else {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    }
  };

  const handleNavigate = (page: ScheduleSubPage) => {
    setNavigationHistory((prev) => [...prev, page]);
    setCurrentPage(page);
  };

  return (
    <View className="flex-1 bg-white">
      {currentPage === "menu" ? (
        <ScheduleMenuView onBack={handleBack} onNavigate={handleNavigate} />
      ) : currentPage === "opening-calendar" ? (
        <OpeningCalendarView
          onBack={handleBack}
          onNavigateToAddBusinessDaysOff={() =>
            handleNavigate("add-business-days-off")
          }
          onNavigateToAddStaffTimeOff={() =>
            handleNavigate("add-staff-time-off")
          }
          onNavigateToBusinessHours={() => handleNavigate("business-hours")}
          onNavigateToShift={() => handleNavigate("shift")}
          onNavigateToTimeOff={() => handleNavigate("staff-time-off")}
        />
      ) : currentPage === "shift" ? (
        <ShiftView onBack={handleBack} />
      ) : currentPage === "staff-time-off" ? (
        <StaffTimeOffView
          onAddNewTimeOff={() => handleNavigate("add-staff-time-off")}
          onBack={handleBack}
        />
      ) : currentPage === "business-hours" ? (
        <BusinessHoursView onBack={handleBack} />
      ) : currentPage === "staff-working-hours" ? (
        <StaffWorkingHoursView onBack={handleBack} />
      ) : currentPage === "add-business-days-off" ? (
        <AddBusinessDaysOffView onBack={handleBack} />
      ) : currentPage === "add-staff-time-off" ? (
        <AddStaffTimeOffView onBack={handleBack} />
      ) : (
        <ScheduleMenuView onBack={handleBack} onNavigate={handleNavigate} />
      )}
    </View>
  );
}
