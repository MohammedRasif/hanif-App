# Barbers Bay: Custom Calendar Component Library & Production Guide

This document outlines the modular component library architecture of the **Barbers Bay Calendar Schedule Engine** located at [`src/lib/calender/`](file:///c:/yeasin2002/office/Barbers-Bay/src/lib/calender/).

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Library Folder Structure](#2-library-folder-structure)
3. [API Reference & Props](#3-api-reference--props)
4. [Usage Example](#4-usage-example)
5. [Multi-Barber Sticky Matrix Design](#5-multi-barber-sticky-matrix-design)

---

## 1. Architecture Overview

The custom calendar is packaged into an in-house reusable component library in **`src/lib/calender/`**. It acts as a modular, self-contained multi-barber daily timeline view built with zero external calendar dependencies.

Key architectural goals achieved:

- **High Reusability & Flexibility**: Configurable via props (`barbers`, `appointments`, `columnWidth`, `startHour`, `endHour`, `renderEventCard`, etc.).
- **Clean Component Separation**: Separated into focused sub-components (`CalendarHeaderView`, `CalendarGridTimeline`, `CalendarAppointmentCard`).
- **Bi-Directional Sticky Axis**: Sticky pinned left time axis with horizontal column scrolling.

---

## 2. Library Folder Structure

```
src/lib/calender/
├── index.tsx              # Main entry point & default export <CustomCalendar />
├── types.ts              # TypeScript interfaces (Barber, Appointment, DayItem, CalendarProps)
├── appointment-card.tsx   # Custom event & reservation card component
├── calendar-header.tsx    # Header title & horizontal date carousel
├── calendar-grid.tsx      # Timeline grid, sticky time axis & multi-barber matrix
└── mock-data.ts           # Fallback demo barbers & appointments dataset
```

---

## 3. API Reference & Props

### `<CustomCalendar />` Props

| Prop                 | Type                               | Default                | Description                                    |
| :------------------- | :--------------------------------- | :--------------------- | :--------------------------------------------- |
| `activeDateStr`      | `string`                           | `"2026-07-18"`         | Controlled active date (YYYY-MM-DD)            |
| `onSelectDate`       | `(day: DayItem) => void`           | `undefined`            | Date selection callback                        |
| `barbers`            | `Barber[]`                         | `DEFAULT_BARBERS`      | List of barbers/resources to render as columns |
| `appointments`       | `Appointment[]`                    | `DEFAULT_APPOINTMENTS` | List of appointments to map across the grid    |
| `columnWidth`        | `number`                           | `165`                  | Minimum width per barber column (px)           |
| `startHour`          | `number`                           | `7`                    | Timeline start hour (24-hr format)             |
| `endHour`            | `number`                           | `19`                   | Timeline end hour (24-hr format)               |
| `hourHeight`         | `number`                           | `120`                  | Height per 1-hour slot in pixels               |
| `onPressAppointment` | `(appt: Appointment) => void`      | `undefined`            | Callback when tapping an appointment card      |
| `renderEventCard`    | `(appt: Appointment) => ReactNode` | `undefined`            | Custom event card renderer override            |
| `showFab`            | `boolean`                          | `true`                 | Show/hide Floating Action Button               |
| `onPressFab`         | `() => void`                       | `undefined`            | Callback when tapping the FAB                  |

---

## 4. Usage Example

```tsx
import Container from "@/components/container";
import CustomCalendar from "@/lib/calender";
import React, { useState } from "react";

export default function MyScheduleScreen() {
  const [date, setDate] = useState("2026-07-18");

  return (
    <Container className="flex-1 bg-white">
      <CustomCalendar
        activeDateStr={date}
        onSelectDate={(day) => setDate(day.fullDateStr)}
        onPressAppointment={(appt) =>
          console.log("Tapped appointment:", appt.id)
        }
      />
    </Container>
  );
}
```

---

## 5. Multi-Barber Sticky Matrix Design

1. **Sticky Left Time Column**: Pinned at `left: 0`, `w-14` (`56px`), `z-30`. Stays visible as users scroll horizontally across N barbers.
2. **Spacious Barber Columns**: Each column is guaranteed a width of `165px`, eliminating card text squishing and broken layout wrapping.
3. **Synchronized Header Row**: Barber avatar headers and grid columns scroll together seamlessly inside a horizontal `ScrollView`.
