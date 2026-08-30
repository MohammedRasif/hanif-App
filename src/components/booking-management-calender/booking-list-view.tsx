import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export interface BookingListItem {
  amount: string;
  /** Assigned barber — fallback for the details page while it loads. */
  barberId?: string;
  barberName?: string;
  /** Drives `GET /v1/bookings/{id}/` when the row is tapped. */
  bookingId?: number | string;
  duration: string;
  durationMinutes?: number;
  id: string;
  /** `Cash` / `Card` / `Online`. */
  paymentMethod?: string;
  serviceName: string;
  /** Booking status straight from the API, e.g. `confirmed`. */
  status?: string;
  /** `09:30 – 10:00` */
  timeLabel?: string;
  title: string;
}

export interface BookingGroup {
  appointmentCount: number;
  dateTitle: string;
  /** Anchors the initial scroll position of the list. */
  isToday: boolean;
  items: BookingListItem[];
  newClientCount: number;
  totalValue: string;
  workingHours: string;
}

/** Chip tones per booking status. Split because RN never cascades a View's text color. */
const STATUS_TONES: Record<string, { bg: string; text: string }> = {
  cancelled: { bg: "bg-red-50", text: "text-red-600" },
  completed: { bg: "bg-green-50", text: "text-green-700" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700" },
  in_progress: { bg: "bg-indigo-50", text: "text-indigo-700" },
  no_show: { bg: "bg-gray-100", text: "text-gray-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700" },
  scheduled: { bg: "bg-blue-50", text: "text-blue-700" },
};

const FALLBACK_STATUS_TONE = { bg: "bg-gray-100", text: "text-gray-600" };

function statusTone(status?: string) {
  return STATUS_TONES[(status ?? "").toLowerCase()] ?? FALLBACK_STATUS_TONE;
}

function statusLabel(status?: string) {
  if (!status) {
    return "";
  }
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type BookingListViewProps = {
  groups?: BookingGroup[];
  isError?: boolean;
  isLoading?: boolean;
  onPressItem?: (item: BookingListItem) => void;
  onRetry?: () => void;
  onSwitchToCalendar: () => void;
};

export function BookingListView({
  onPressItem,
  onRetry,
  onSwitchToCalendar,
  groups = [],
  isError = false,
  isLoading = false,
}: BookingListViewProps) {
  const scrollRef = useRef<ScrollView>(null);
  /** Y of today's day header inside the scroll content, once measured. */
  const todayOffset = useRef<null | number>(null);
  const hasAnchoredToday = useRef(false);

  const isEmpty =
    !groups ||
    groups.length === 0 ||
    groups.every((g) => !g.items || g.items.length === 0);
  const showGroups = !(isLoading || isError || isEmpty);

  const todayIndex = useMemo(
    () => groups.findIndex((group) => group.isToday),
    [groups],
  );

  // Children alternate day-header / day-body, so every even index is a header
  const stickyHeaderIndices = useMemo(
    () => groups.map((_group, index) => index * 2),
    [groups],
  );

  // A new payload (or a date rollover) re-anchors the list on today
  useEffect(() => {
    hasAnchoredToday.current = false;
    todayOffset.current = todayIndex <= 0 ? 0 : null;
  }, [todayIndex, groups.length]);

  /** Pins today's section to the top, leaving past days reachable above it. */
  const anchorToday = () => {
    const offset = todayOffset.current;
    if (hasAnchoredToday.current || offset === null || offset <= 0) {
      return;
    }
    hasAnchoredToday.current = true;
    scrollRef.current?.scrollTo({ animated: false, y: offset });
  };

  /**
   * Sticky children have their `onLayout` stripped by React Native, so today's
   * header position is derived from the previous day's body: the body carries the
   * section gap as padding, so the next header starts exactly at its bottom edge.
   */
  const handleBodyLayout = (index: number, y: number, height: number) => {
    if (index !== todayIndex - 1) {
      return;
    }
    todayOffset.current = y + height;
    // Content may still be growing below — retry once this frame settles
    requestAnimationFrame(anchorToday);
  };

  return (
    <Container className="flex-1 bg-white" isScrollable={false}>
      {/* The padded wrapper keeps sticky day headers clear of the status bar */}
      <View className="flex-1 pt-15">
        {/* Scrollable Content — opens on today, scroll up for upcoming days */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          onContentSizeChange={anchorToday}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={showGroups ? stickyHeaderIndices : undefined}
        >
          {isLoading ? (
            <View className="py-20 items-center justify-center">
              <StyledIcons
                className="text-gray-400 animate-spin mb-3"
                name="sync-outline"
                size={32}
              />
              <Text className="font-medium text-base text-gray-500">
                Loading appointments...
              </Text>
            </View>
          ) : isError ? (
            <View className="py-20 items-center justify-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
                <StyledIcons
                  className="text-red-500"
                  name="alert-circle-outline"
                  size={32}
                />
              </View>
              <Text className="font-bold text-lg text-gray-900 mb-1">
                Couldn&apos;t load appointments
              </Text>
              <Text className="font-normal text-sm text-gray-400 text-center max-w-xs mb-4">
                Check your connection and try again.
              </Text>
              {Boolean(onRetry) && (
                <Pressable
                  className="rounded-full bg-black px-5 py-2.5 active:opacity-80"
                  onPress={onRetry}
                >
                  <Text className="font-semibold text-white text-xs">
                    Try again
                  </Text>
                </Pressable>
              )}
            </View>
          ) : isEmpty ? (
            <View className="py-20 items-center justify-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <StyledIcons
                  className="text-gray-400"
                  name="calendar-outline"
                  size={32}
                />
              </View>
              <Text className="font-bold text-lg text-gray-900 mb-1">
                No appointments found
              </Text>
              <Text className="font-normal text-sm text-gray-400 text-center max-w-xs">
                There are no appointments recorded for this date.
              </Text>
            </View>
          ) : (
            groups.flatMap((group, index) => [
              /* Sticky Day Header — stays pinned while its day scrolls past */
              <View
                className="bg-white px-5 pt-2 pb-3 pr-20"
                key={`header-${group.dateTitle}-${index}`}
              >
                <Text className="font-bold text-2xl text-gray-900 tracking-tight">
                  {group.dateTitle}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-400 font-normal">
                  {group.workingHours || "—"}
                </Text>
              </View>,

              <View
                className="px-5 pb-8"
                key={`body-${group.dateTitle}-${index}`}
                onLayout={(event) =>
                  handleBodyLayout(
                    index,
                    event.nativeEvent.layout.y,
                    event.nativeEvent.layout.height,
                  )
                }
              >
                {/* Summary Metrics Card */}
                <View className="flex-row items-center justify-between rounded-3xl border border-gray-100 bg-[#F9FAFB] p-5 mb-5 shadow-2xs">
                  <View className="flex-1 items-start">
                    <Text className="text-xs font-medium text-gray-400">
                      Value
                    </Text>
                    <Text className="mt-1 font-bold text-lg text-gray-900">
                      {group.totalValue}
                    </Text>
                  </View>

                  <View className="h-8 w-px bg-gray-200 mx-2" />

                  <View className="flex-1 items-start pl-2">
                    <Text className="text-xs font-medium text-gray-400">
                      Appointment
                    </Text>
                    <Text className="mt-1 font-bold text-lg text-gray-900">
                      {group.appointmentCount}
                    </Text>
                  </View>

                  <View className="h-8 w-px bg-gray-200 mx-2" />

                  <View className="flex-1 items-start pl-2">
                    <Text className="text-xs font-medium text-gray-400">
                      New clint
                    </Text>
                    <Text className="mt-1 font-bold text-lg text-gray-900">
                      {group.newClientCount}
                    </Text>
                  </View>
                </View>

                {/* Appointments List */}
                <View className="gap-5">
                  {group.items.length === 0 ? (
                    <Text className="pb-1 text-sm text-gray-400">
                      No appointments on this day.
                    </Text>
                  ) : (
                    group.items.map((item) => (
                      <Pressable
                        className="flex-row items-center justify-between active:opacity-60"
                        key={item.id}
                        onPress={() => onPressItem?.(item)}
                      >
                        <View className="flex-1 flex-row items-center gap-3">
                          {/* Left Orange Accent Indicator Line */}
                          <View className="h-10 w-1 rounded-full bg-[#FF9500]" />

                          {/* User Avatar Circle */}
                          <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200">
                            <StyledIcons
                              className="text-gray-600"
                              name="person"
                              size={20}
                            />
                          </View>

                          {/* Title & Subtitle */}
                          <View className="flex-1 pr-2">
                            <Text
                              className="font-bold text-base text-gray-900"
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <Text
                              className="text-xs font-medium text-gray-400 mt-0.5"
                              numberOfLines={1}
                            >
                              {item.serviceName}
                            </Text>

                            {/* Status & Payment Method */}
                            <View className="mt-1.5 flex-row items-center gap-1.5">
                              {Boolean(item.status) && (
                                <View
                                  className={`rounded-full px-2 py-0.5 ${
                                    statusTone(item.status).bg
                                  }`}
                                >
                                  <Text
                                    className={`font-semibold text-[10px] ${
                                      statusTone(item.status).text
                                    }`}
                                  >
                                    {statusLabel(item.status)}
                                  </Text>
                                </View>
                              )}
                              {Boolean(item.paymentMethod) && (
                                <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5">
                                  <StyledIcons
                                    className="text-gray-500"
                                    name="card-outline"
                                    size={10}
                                  />
                                  <Text className="font-semibold text-[10px] text-gray-600">
                                    {item.paymentMethod}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        {/* Price & Duration */}
                        <View className="items-end">
                          <Text className="font-bold text-base text-gray-900">
                            {item.amount}
                          </Text>
                          <Text className="text-xs font-medium text-gray-400 mt-0.5">
                            {item.duration}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </View>
              </View>,
            ])
          )}
        </ScrollView>
      </View>

      {/* Floating switch-to-calendar button, pinned over the day header */}
      <Pressable
        className="absolute right-5 top-16 h-11 w-11 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
        onPress={onSwitchToCalendar}
      >
        <StyledIcons
          className="text-gray-900"
          name="calendar-outline"
          size={20}
        />
      </Pressable>
    </Container>
  );
}
