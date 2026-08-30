import { formatCalendarDate } from "@/Redux/feature/bookingCalendarApi";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyledIcons } from "../styled-icons";
import { CalendarAppointmentCard } from "./appointment-card";
import { minutesOfDay } from "./date-utils";
import type { Appointment, Barber, CalendarBlock } from "./types";

const TIME_AXIS_WIDTH = 56; // Fixed width for sticky left time column
const BARBER_HEADER_HEIGHT = 52; // Fixed height for barber avatar header
const MIN_CARD_HEIGHT = 48;
const ONE_MINUTE_MS = 60_000;

type Props = {
  activeDateStr?: string;
  appointments: Appointment[];
  barbers: Barber[];
  blocks?: CalendarBlock[];
  children?: React.ReactNode;
  columnWidth?: number;
  endHour?: number;
  hourHeight?: number;
  onPressAppointment?: (appointment: Appointment) => void;
  onPressFab?: () => void;
  renderEventCard?: (appointment: Appointment) => React.ReactNode;
  renderFab?: () => React.ReactNode;
  showFab?: boolean;
  startHour?: number;
};

export function CalendarGridTimeline({
  activeDateStr,
  appointments,
  barbers,
  blocks = [],
  children,
  columnWidth = 165,
  endHour = 19,
  hourHeight = 120,
  onPressAppointment,
  onPressFab,
  renderEventCard,
  renderFab,
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

  // Ticks every minute so the current-time indicator keeps up with the clock
  const [nowMinutes, setNowMinutes] = useState(() => minutesOfDay(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMinutes(minutesOfDay(new Date()));
    }, ONE_MINUTE_MS);
    return () => clearInterval(timer);
  }, []);

  // Helper to calculate top position and height for any timeline range
  const getRangeLayout = (startIso: string, endIso: string) => {
    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    const startMinutesFromStart =
      (startDate.getHours() - startHour) * 60 + startDate.getMinutes();
    const durationMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    const top = (startMinutesFromStart / 60) * hourHeight;
    const height = Math.max(
      (durationMinutes / 60) * hourHeight,
      MIN_CARD_HEIGHT,
    );

    return { top, height };
  };

  // Red line follows the real clock, and only on the day actually being viewed
  const gridStartMinutes = startHour * 60;
  const gridEndMinutes = (endHour + 1) * 60;
  const isViewingToday =
    !activeDateStr || activeDateStr === formatCalendarDate();
  const showCurrentTimeLine =
    isViewingToday &&
    nowMinutes >= gridStartMinutes &&
    nowMinutes <= gridEndMinutes;
  const currentTimeTop = ((nowMinutes - gridStartMinutes) / 60) * hourHeight;

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
              className="justify-between -pt-2 pb-1 pr-0.5 items-end"
              key={h.hourNum}
              style={{ height: hourHeight }}
            >
              <Text className="font-semibold text-gray-700 text-xs tracking-tighter">
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
                    {/* Breaks / time off: shop-wide blocks repeat in every column */}
                    {blocks
                      .filter(
                        (block) =>
                          block.barberId === null ||
                          block.barberId === barber.id,
                      )
                      .map((block) => {
                        const { top, height } = getRangeLayout(
                          block.startTime,
                          block.endTime,
                        );
                        return (
                          <View
                            className="absolute left-1 right-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-2.5"
                            key={block.id}
                            style={{ top, height }}
                          >
                            <Text
                              className="font-bold text-gray-500 text-xs tracking-tight"
                              numberOfLines={1}
                            >
                              {block.timeDisplay}
                            </Text>
                            <Text
                              className="mt-0.5 text-[11px] text-gray-400"
                              numberOfLines={2}
                            >
                              {block.label}
                            </Text>
                          </View>
                        );
                      })}

                    {/* Render Appointments belonging to this barber column */}
                    {appointments
                      .filter((a) => a.barberId === barber.id)
                      .map((appt) => {
                        const { top, height } = getRangeLayout(
                          appt.startTime,
                          appt.endTime,
                        );
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

              {/* Red Current Time Indicator Line (live clock, today only) */}
              {showCurrentTimeLine && (
                <View
                  className="absolute left-0 right-0 z-20 flex-row items-center pointer-events-none"
                  style={{
                    top: currentTimeTop,
                    width: totalGridWidth,
                  }}
                >
                  <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-red-500" />
                  <View className="flex-1 h-0.5 bg-red-500" />
                  <View className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-red-500" />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Floating Action Button or Custom Non-Scrollable Overlay */}
      {renderFab ? (
        renderFab()
      ) : children ? (
        children
      ) : showFab ? (
        <Pressable
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg z-40 active:scale-95"
          onPress={onPressFab}
        >
          <StyledIcons className="text-white" name="add" size={28} />
        </Pressable>
      ) : null}
    </View>
  );
}
