import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { withUniwind } from "uniwind";
import { CalendarAppointmentCard } from "./appointment-card";
import type { Appointment, Barber } from "./types";

const StyledIonicons = withUniwind(Ionicons);

const TIME_AXIS_WIDTH = 56; // Fixed width for sticky left time column
const BARBER_HEADER_HEIGHT = 52; // Fixed height for barber avatar header

type Props = {
  appointments: Appointment[];
  barbers: Barber[];
  columnWidth?: number;
  endHour?: number;
  hourHeight?: number;
  onPressAppointment?: (appointment: Appointment) => void;
  onPressFab?: () => void;
  renderEventCard?: (appointment: Appointment) => React.ReactNode;
  showFab?: boolean;
  startHour?: number;
};

export function CalendarGridTimeline({
  appointments,
  barbers,
  columnWidth = 165,
  endHour = 19,
  hourHeight = 120,
  onPressAppointment,
  onPressFab,
  renderEventCard,
  showFab = true,
  startHour = 7,
}: Props) {
  // Hours array from startHour to endHour
  const hours = useMemo(() => {
    const list = [];
    for (let h = startHour; h <= endHour; h++) {
      const period = h >= 12 ? "pm" : "am";
      const displayHour = h > 12 ? h - 12 : h;
      list.push({
        hourNum: h,
        label: `${displayHour}:00 ${period}`,
      });
    }
    return list;
  }, [startHour, endHour]);

  // Helper to calculate top position and height for an appointment
  const getAppointmentLayout = (appt: Appointment) => {
    const startDate = new Date(appt.startTime);
    const endDate = new Date(appt.endTime);

    const startMinutesFromStart =
      (startDate.getHours() - startHour) * 60 + startDate.getMinutes();
    const durationMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    const top = (startMinutesFromStart / 60) * hourHeight;
    const height = Math.max((durationMinutes / 60) * hourHeight, 48); // Min height 48px

    return { top, height };
  };

  // Fixed red line position matching 8:45 AM indicator
  const redLineMinutes = (8 - startHour) * 60 + 45; // 8:45 AM
  const redLineTop = (redLineMinutes / 60) * hourHeight;

  const totalGridWidth = barbers.length * columnWidth;
  const totalTimelineHeight = (endHour - startHour + 1) * hourHeight;

  return (
    <View className="flex-1 bg-white relative">
      {/* Vertical ScrollView for Timeline Hours */}
      <ScrollView
        contentContainerStyle={{
          height: totalTimelineHeight + BARBER_HEADER_HEIGHT,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Left Time Axis (Fixed on the left while grid scrolls horizontally) */}
        <View
          className="absolute left-0 border-r border-gray-100 bg-white z-30"
          style={{
            top: BARBER_HEADER_HEIGHT,
            width: TIME_AXIS_WIDTH,
            height: totalTimelineHeight,
          }}
        >
          {hours.map((h, idx) => (
            <View
              className="justify-between pt-1 pb-1 pr-2 items-end"
              key={h.hourNum}
              style={{ height: hourHeight }}
            >
              <Text className="font-bold text-gray-700 text-xs tracking-tight">
                {h.label}
              </Text>
              {idx < hours.length - 1 && (
                <>
                  <Text className="text-gray-400 text-[10px]">15</Text>
                  <Text className="text-gray-400 text-[10px]">30</Text>
                  <Text className="text-gray-400 text-[10px]">45</Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Horizontal ScrollView for Multi-Barber Columns */}
        <ScrollView
          contentContainerStyle={{
            width: totalGridWidth + TIME_AXIS_WIDTH,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-1 relative">
            {/* Top Barber Header Row (Inside Horizontal Scroll for Perfect Column Sync) */}
            <View
              className="flex-row border-b border-gray-100 bg-white z-20"
              style={{
                paddingLeft: TIME_AXIS_WIDTH,
                height: BARBER_HEADER_HEIGHT,
              }}
            >
              {barbers.map((barber, barberIndex) => (
                <View
                  className={`flex-row items-center gap-2 px-3 ${
                    barberIndex < barbers.length - 1
                      ? "border-r border-gray-100"
                      : ""
                  }`}
                  key={barber.id}
                  style={{ width: columnWidth }}
                >
                  <Image
                    contentFit="cover"
                    source={{ uri: barber.avatar }}
                    style={{ width: 34, height: 34, borderRadius: 17 }}
                  />
                  <View className="flex-1">
                    <Text
                      className="font-semibold text-gray-900 text-xs"
                      numberOfLines={1}
                    >
                      {barber.name}
                    </Text>
                    <Text
                      className="text-gray-400 text-[10px]"
                      numberOfLines={1}
                    >
                      {barber.workingHours}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Grid Timeline Area */}
            <View
              className="flex-1 relative"
              style={{ paddingLeft: TIME_AXIS_WIDTH }}
            >
              {/* Background Grid Horizontal Lines for each Hour */}
              {hours.map((h) => (
                <View
                  className="border-t border-gray-100 absolute left-0 right-0"
                  key={h.hourNum}
                  style={{
                    top: (h.hourNum - startHour) * hourHeight,
                    height: hourHeight,
                    width: totalGridWidth,
                  }}
                />
              ))}

              {/* Barber Columns Matrix */}
              <View
                className="flex-row h-full"
                style={{ width: totalGridWidth }}
              >
                {barbers.map((barber, barberIndex) => (
                  <View
                    className={`relative ${
                      barberIndex < barbers.length - 1
                        ? "border-r border-gray-100"
                        : ""
                    }`}
                    key={barber.id}
                    style={{ width: columnWidth }}
                  >
                    {/* Render Appointments belonging to this barber column */}
                    {appointments
                      .filter((a) => a.barberId === barber.id)
                      .map((appt) => {
                        const { top, height } = getAppointmentLayout(appt);
                        return (
                          <View
                            className="absolute left-1 right-1 z-10"
                            key={appt.id}
                            style={{
                              top,
                              height,
                            }}
                          >
                            {renderEventCard ? (
                              renderEventCard(appt)
                            ) : (
                              <CalendarAppointmentCard
                                appointment={appt}
                                onPress={onPressAppointment}
                              />
                            )}
                          </View>
                        );
                      })}
                  </View>
                ))}
              </View>

              {/* Red Current Time Indicator Line (Matching mockup at 8:45 AM) */}
              <View
                className="absolute left-0 right-0 z-20 flex-row items-center pointer-events-none"
                style={{
                  top: redLineTop,
                  width: totalGridWidth,
                }}
              >
                <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500" />
                <View className="flex-1 h-[2px] bg-red-500" />
                <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-red-500" />
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      {showFab && (
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg z-40 active:scale-95"
          onPress={onPressFab}
        >
          <StyledIonicons className="text-white" name="add" size={28} />
        </Pressable>
      )}
    </View>
  );
}
