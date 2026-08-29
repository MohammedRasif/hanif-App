import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { AddBusinessDaysOffView } from "./add-business-days-off-view";
import { AddStaffTimeOffView } from "./add-staff-time-off-view";
import { BusinessHoursView } from "./business-hours-view";
import { OpeningCalendarView } from "./opening-calendar-view";
import { ScheduleMenuView } from "./schedule-menu-view";
import { ShiftView } from "./shift-view";
import { StaffMemberTimeOffDetailView } from "./staff-member-time-off-detail-view";
import { StaffTimeOffView } from "./staff-time-off-view";
import { StaffWorkingHoursView } from "./staff-working-hours-view";
import type { ScheduleManagementProps, ScheduleSubPage } from "./types";

export function ScheduleManagementScreen({
  onBack,
  initialPage = "menu",
}: ScheduleManagementProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<ScheduleSubPage>(initialPage);
  const [selectedStaffMember, setSelectedStaffMember] = useState<any>(null);
  const [activeShifts, setActiveShifts] = useState<any[] | null>(null);
  const [activeTimeOff, setActiveTimeOff] = useState<any[] | null>(null);
  const todayStr = React.useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
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
          onDateChange={(d) => setSelectedDate(d)}
          onNavigateToAddBusinessDaysOff={() =>
            handleNavigate("add-business-days-off")
          }
          onNavigateToAddStaffTimeOff={() =>
            handleNavigate("add-staff-time-off")
          }
          onNavigateToBusinessHours={(dateStr) => {
            if (dateStr) setSelectedDate(dateStr);
            handleNavigate("business-hours");
          }}
          onNavigateToShift={(shiftsData, dateStr) => {
            if (shiftsData) setActiveShifts(shiftsData);
            if (dateStr) setSelectedDate(dateStr);
            handleNavigate("shift");
          }}
          onNavigateToTimeOff={(timeOffData, dateStr) => {
            if (timeOffData) setActiveTimeOff(timeOffData);
            if (dateStr) setSelectedDate(dateStr);
            handleNavigate("staff-time-off");
          }}
          selectedDate={selectedDate}
        />
      ) : currentPage === "shift" ? (
        <ShiftView
          liveShifts={activeShifts}
          onBack={handleBack}
          selectedDate={selectedDate}
        />
      ) : currentPage === "staff-time-off" ? (
        <StaffTimeOffView
          liveTimeOff={activeTimeOff}
          onAddNewTimeOff={() => handleNavigate("add-staff-time-off")}
          onBack={handleBack}
          onSelectStaff={(staff) => {
            setSelectedStaffMember(staff);
            handleNavigate("staff-time-off-detail");
          }}
          selectedDate={selectedDate}
        />
      ) : currentPage === "staff-time-off-detail" ? (
        <StaffMemberTimeOffDetailView
          onBack={handleBack}
          staff={selectedStaffMember}
        />
      ) : currentPage === "business-hours" ? (
        <BusinessHoursView onBack={handleBack} selectedDate={selectedDate} />
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
