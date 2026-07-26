# Barbers Bay: Custom Calendar Library Developer Guide & Usage Manual

Welcome to the developer documentation for the **Barbers Bay Custom Calendar Engine** ([`src/lib/calender/`](file:///c:/yeasin2002/office/Barbers-Bay/src/lib/calender/)).

This guide serves as a complete reference for current and future engineers to understand, integrate, extend, and maintain the custom multi-barber calendar schedule component.

---

## Table of Contents

1. [Overview & Architectural Philosophy](#1-overview--architectural-philosophy)
2. [Module Directory & File Structure](#2-module-directory--file-structure)
3. [Quick Start Example](#3-quick-start-example)
4. [Data Schemas & Type Definitions](#4-data-schemas--type-definitions)
5. [Complete Props Reference](#5-complete-props-reference)
6. [Advanced Integration Scenarios](#6-advanced-integration-scenarios)
   - [Scenario 1: Connecting to Real Backend APIs](#scenario-1-connecting-to-real-backend-apis)
   - [Scenario 2: Custom Event Card Overrides](#scenario-2-custom-event-card-overrides)
   - [Scenario 3: Interacting with Appointments & Add Button](#scenario-3-interacting-with-appointments--add-button)
   - [Scenario 4: Customizing Salon Working Hours & Column Widths](#scenario-4-customizing-salon-working-hours--column-widths)
7. [Internal Layout Mathematics & Performance Notes](#7-internal-layout-mathematics--performance-notes)

---

## 1. Overview & Architectural Philosophy

The **Custom Calendar Engine** is an in-house, zero-dependency schedule timeline component designed specifically for multi-barber salon management.

### Key Architectural Strengths:

- **Zero Heavy Dependencies**: Built purely with React Native core primitives (`ScrollView`, `View`, `Text`, `Pressable`, `Image`), avoiding third-party library breaking changes or Reanimated strict mode warnings.
- **Bi-Directional Matrix Layout**: Supports vertical scrolling through 12+ daily operating hours alongside horizontal scrolling across N barber columns.
- **Sticky Pinned Time Axis**: The left time column (`7:00 am`, `8:00 am`...) stays pinned on the left as users scroll horizontally through barbers.
- **Guaranteed Column Width (`165px`)**: Prevents appointment titles and text from squishing or breaking into awkward single-letter vertical lines.

---

## 2. Module Directory & File Structure

The library lives inside [`src/lib/calender/`](file:///c:/yeasin2002/office/Barbers-Bay/src/lib/calender/):

```
src/lib/calender/
├── index.tsx              # Main entry point & default export <CustomCalendar />
├── types.ts              # TypeScript schemas (Barber, Appointment, DayItem, CalendarProps)
├── appointment-card.tsx   # Individual appointment & reservation UI card component
├── calendar-header.tsx    # Header view containing title, subtitle & horizontal day selector carousel
├── calendar-grid.tsx      # Timeline grid, sticky time axis & multi-barber matrix engine
└── mock-data.ts           # Default fallback barbers and dense appointment dataset
```

---

## 3. Quick Start Example

Import `<CustomCalendar />` from `@/lib/calender` and place it inside your screen layout:

```tsx
import { Container } from "@/components/container";
import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";

export default function AppointmentScheduleScreen() {
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-18");

  return (
    <Container className="bg-white flex-1">
      <CustomCalendar
        activeDateStr={selectedDateStr}
        onSelectDate={(day) => setSelectedDateStr(day.fullDateStr)}
      />
    </Container>
  );
}
```

---

## 4. Data Schemas & Type Definitions

Defined in [`src/lib/calender/types.ts`](file:///c:/yeasin2002/office/Barbers-Bay/src/lib/calender/types.ts):

### `Barber`

Represents a staff member/barber rendered as a dedicated column in the grid.

```ts
export interface Barber {
  id: string; // Unique identifier e.g. "barber-1"
  name: string; // Full name e.g. "Mike Johnson"
  avatar: string; // Profile image URL
  workingHours: string; // Display hours string e.g. "09:00–10:40"
}
```

### `Appointment`

Represents a scheduled haircut appointment or time block reservation.

```ts
export interface Appointment {
  id: string; // Unique appointment ID
  barberId: string; // Matches Barber.id column
  barberName: string; // Barber name reference
  startTime: string; // ISO string e.g. "2026-07-18T09:00:00"
  endTime: string; // ISO string e.g. "2026-07-18T10:40:00"
  timeDisplay: string; // Time badge string e.g. "09:00 – 10:40"
  serviceName: string; // Main service name e.g. "Classic men's haircut"
  userName?: string; // Customer name e.g. "Alex Rivera"
  subTitle?: string; // Optional additional description
  cardType: "appointment" | "reservation";
  status?: "completed" | "confirmed" | "pending" | "reservation";
  bgColor: string; // Card background color (#FFFDE7, #EBF5FF, #F3F4F6)
  durationMinutes: number; // Duration in minutes
}
```

### `DayItem`

Represents a date item in the top horizontal day carousel.

```ts
export interface DayItem {
  dayName: string; // Short day string e.g. "Mon"
  dateNumber: number; // Numeric day e.g. 18
  fullDateStr: string; // YYYY-MM-DD string e.g. "2026-07-18"
  date: Date; // JavaScript Date instance
}
```

---

## 5. Complete Props Reference

### `<CustomCalendar />` Props

| Prop                 | Type                               | Default Value          | Description                                                                                         |
| :------------------- | :--------------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------- |
| `activeDateStr`      | `string`                           | `"2026-07-18"`         | **Controlled Active Date**. Pass `YYYY-MM-DD` string to filter appointments by date.                |
| `onSelectDate`       | `(day: DayItem) => void`           | `undefined`            | **Date Change Handler**. Callback fired when a user selects a day in the horizontal carousel.       |
| `barbers`            | `Barber[]`                         | `DEFAULT_BARBERS`      | **Barber Columns Array**. Array of barbers to render as columns across the grid.                    |
| `appointments`       | `Appointment[]`                    | `DEFAULT_APPOINTMENTS` | **Appointments Dataset**. Array of appointments to position on the timeline grid.                   |
| `days`               | `DayItem[]`                        | `DEFAULT_DAYS`         | **Date Carousel Items**. Array of days to display in the top horizontal carousel.                   |
| `columnWidth`        | `number`                           | `165`                  | **Barber Column Width (px)**. Guaranteed width per barber column to prevent text squishing.         |
| `startHour`          | `number`                           | `7`                    | **Grid Start Hour**. 24-hour format starting time for the vertical axis (e.g. `7` for 7:00 AM).     |
| `endHour`            | `number`                           | `19`                   | **Grid End Hour**. 24-hour format ending time for the vertical axis (e.g. `19` for 7:00 PM).        |
| `hourHeight`         | `number`                           | `120`                  | **Hour Viewport Height (px)**. Pixel height allocated for 1 hour on the timeline (30px per 15 min). |
| `workingHoursLabel`  | `string`                           | `"9.00 - 6.00 pm"`     | **Salon Working Hours Text**. Subtitle string rendered below the main header title.                 |
| `onPressAppointment` | `(appt: Appointment) => void`      | `undefined`            | **Appointment Card Tap Handler**. Fired when a user taps an appointment card.                       |
| `renderEventCard`    | `(appt: Appointment) => ReactNode` | `undefined`            | **Custom Card Component Override**. Allows passing a custom UI card renderer.                       |
| `showFab`            | `boolean`                          | `true`                 | **FAB Toggle**. Show or hide the bottom-right floating `+` action button.                           |
| `onPressFab`         | `() => void`                       | `undefined`            | **FAB Tap Handler**. Fired when tapping the floating `+` add appointment button.                    |

---

## 6. Advanced Integration Scenarios

### Scenario 1: Connecting to Real Backend APIs

Fetch real barbers and appointments from your backend (e.g., Supabase or REST API) and pass them directly to `<CustomCalendar />`:

```tsx
import { Container } from "@/components/container";
import CustomCalendar, { Appointment, Barber, DayItem } from "@/lib/calender";
import React, { useEffect, useState } from "react";

export default function RealBookingScreen() {
  const [selectedDate, setSelectedDate] = useState("2026-07-18");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Example: Fetch from API
    async function loadData() {
      const barberRes = await fetch("/api/barbers");
      const apptRes = await fetch(`/api/appointments?date=${selectedDate}`);
      setBarbers(await barberRes.json());
      setAppointments(await apptRes.json());
    }
    loadData();
  }, [selectedDate]);

  return (
    <Container className="bg-white flex-1">
      <CustomCalendar
        activeDateStr={selectedDate}
        appointments={appointments}
        barbers={barbers}
        onSelectDate={(day: DayItem) => setSelectedDate(day.fullDateStr)}
      />
    </Container>
  );
}
```

---

### Scenario 2: Custom Event Card Overrides

If you want a specialized event card design (e.g., showing price badges or customer phone numbers), pass `renderEventCard`:

```tsx
import CustomCalendar, { Appointment } from "@/lib/calender";
import React from "react";
import { Text, View } from "react-native";

export default function CustomCardScreen() {
  return (
    <CustomCalendar
      renderEventCard={(appt: Appointment) => (
        <View className="flex-1 rounded-xl p-2 bg-indigo-50 border border-indigo-200">
          <Text className="font-bold text-xs text-indigo-900">
            {appt.timeDisplay}
          </Text>
          <Text className="font-semibold text-xs text-indigo-800">
            {appt.userName}
          </Text>
          <Text className="text-[10px] text-indigo-600">
            {appt.serviceName}
          </Text>
        </View>
      )}
    />
  );
}
```

---

### Scenario 3: Interacting with Appointments & Add Button

Trigger modals when tapping appointment cards or pressing the Floating Action Button:

```tsx
import CustomCalendar, { Appointment } from "@/lib/calender";
import React from "react";
import { Alert } from "react-native";

export default function InteractiveScheduleScreen() {
  const handlePressAppointment = (appt: Appointment) => {
    Alert.alert(
      "Appointment Details",
      `${appt.userName} - ${appt.serviceName}`,
    );
  };

  const handlePressFab = () => {
    Alert.alert("New Booking", "Open creation modal");
  };

  return (
    <CustomCalendar
      onPressAppointment={handlePressAppointment}
      onPressFab={handlePressFab}
    />
  );
}
```

---

### Scenario 4: Customizing Salon Working Hours & Column Widths

For larger salons with extended operating hours (e.g. 8:00 AM to 10:00 PM) or wider columns:

```tsx
import CustomCalendar from "@/lib/calender";
import React from "react";

export default function ExtendedHoursScreen() {
  return (
    <CustomCalendar
      columnWidth={180} // Wider columns for tablets or large phones
      endHour={22} // 10:00 PM end time
      hourHeight={130} // Slightly taller hour slots
      startHour={8} // 8:00 AM start time
      workingHoursLabel="8:00 AM - 10:00 PM"
    />
  );
}
```

---

## 7. Internal Layout Mathematics & Performance Notes

### 1. Position & Height Calculation Math

In [`calendar-grid.tsx`](file:///c:/yeasin2002/office/Barbers-Bay/src/lib/calender/calendar-grid.tsx):

```ts
const startMinutesFromStart =
  (startDate.getHours() - startHour) * 60 + startDate.getMinutes();
const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

const top = (startMinutesFromStart / 60) * hourHeight;
const height = Math.max((durationMinutes / 60) * hourHeight, 48); // Minimum 48px height
```

### 2. Sticky Left Time Axis Mechanism

- The left time axis is positioned absolutely at `left: 0`, `width: 56px`, `zIndex: 30`, `bg-white`.
- As the right barber grid scrolls horizontally inside a nested `ScrollView`, the time axis remains pinned to the left edge so time markers (`7:00 am`, `15`, `30`, `45`) are always visible.

### 3. Performance Optimization Checklist

- **Filtering**: `appointments` are filtered by `activeDateStr` using `useMemo`.
- **Render Stability**: Native flex layout calculations avoid JS animation re-renders.
- **Strict Mode Cleanliness**: 100% clean compilation under React 19 and React Compiler with zero Reanimated shared value warnings.
